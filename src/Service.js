'use strict'

const privates = new WeakMap;
const callbacks = {};
const sdpConstraints = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
};

let stream = undefined;
// Default iceServer configuration
let iceConfig = {'iceServers': [{'urls': 'stun.l.google.com:19302'}]};
let serverConfig = {
    url: '',
    methods: {
        postIceCandidate: (candidate, recipientId)  => console.log('ngWebRTC :: posting Ice Candidate : '),
        postOffer: (RTCDescription, recipientId, type) => console.log('ngWebRTC :: posting offer data : ')
    }
};
let ice = [];

// Multi-browser globals config hacks
window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

export default class Service {

    constructor($q, $base64) {
        privates.set(this, {$q, $base64});
    }

    onConnect(ack) {
        callbacks.onConnect = ack;
        return this;
    }

    onDisconnect(ack) {
        callbacks.onDisconnect = ack;
        return this;
    }

    onPending(ack) {
        callbacks.onPending = ack;
        return this;
    }

    setServerConfig(_serverConfig, _iceConfig = undefined)
    {
        serverConfig = _serverConfig;
        if (_iceConfig) {
            iceConfig = _iceConfig;
        }
    }

    getOffers() {
        const deferred = privates.get(this).$q.defer();
        serverConfig.methods.get('/webrtc/offer')
            .then(request => deferred.resolve(parseData(request.data.offers)))
            .catch(error => deferred.reject(error));
        return deferred.promise;
    }

    acceptOffer(offer) {
        const peerConnection = getPeerConnection(offer.emitter);
        offer = {sdp: offer.RTCDescription, type: 'offer', emitter: offer.emitter};
        peerConnection.setRemoteDescription(new window.RTCSessionDescription(offer));
        angular.forEach(ice, function (iceCandidate) {
            peerConnection.addIceCandidate(new window.RTCIceCandidate(iceCandidate));
        });
        peerConnection.createAnswer(description => {
            peerConnection.setLocalDescription(description);
            serverConfig.methods.postOffer(description, offer.emitter, 'sdp-answer')
                .then(function () {
                    console.log('ngWebRTC :: acceptOffer success')
                })
                .catch(function (error) {
                    console.log('ngWebRTC :: acceptOffer error', error)
                })
            },
            function (error) {
                console.log(error)
            });
    }

    refuseOffer(offer) {
        // ???
    }

    createOffer(recipientId) {
        const deferred = privates.get(this).$q.defer();
        const peerConnection = getPeerConnection(recipientId);
        peerConnection
            .createOffer(
                function (RTCDescription) {
                    peerConnection.setLocalDescription(RTCDescription);
                    serverConfig.methods.postOffer(RTCDescription, recipientId);
                    deferred.resolve(RTCDescription);
                },
                function (error) {
                    deferred.reject(error);
                },
                sdpConstraints);
        return deferred.promise;
    }

    getExternalMediaStream() {
        return externalStream;
    }

    getLocalMediaStream() {
        return stream;
    }

    getUserMedia(constraints = undefined) {
        const deferred = privates.get(this).$q.defer();
        navigator.getUserMedia(
            constraints || { audio: true, video: true },
            _stream => {
                stream = _stream;
                deferred.resolve(stream);
            },
            error => deferred.reject(error)
        );
        return deferred.promise;
    }

    init() {
    }

    onExternalIceCandidate() {
        const peerConnection = getPeerConnection(iceCandidate.emitter);
        peerConnection.addIceCandidate(new window.RTCIceCandidate(iceCandidate.ice));
    }

};

Service.$inject = ['$q', '$base64'];

function parseData(offers) {
    let _offers = []
    angular.forEach(offers, function (offer) {
        switch (offer.type) {
            case 'sdp-offer':
                offer.RTCDescription = $base64.decode(offer.RTCDescription);
                _offers.push(offer);
                break;
            case 'sdp-answer':
                offer.RTCDescription = $base64.decode(offer.RTCDescription);
                acceptAnswer(offer);
                break;
            case 'ice':
                console.log('got ice from server : ', offer)
                ice.push(offer.ice);
                break;
        }
    });
    return _offers;
}

function acceptAnswer(answer) {
    const peerConnection = getPeerConnection(answer.emitter);
    answer = {sdp: answer.RTCDescription, type: 'answer', emitter: answer.emitter};
    angular.forEach(ice, iceCandidate => {
        peerConnection.addIceCandidate(new window.RTCIceCandidate(iceCandidate));
    });
    peerConnection.setRemoteDescription(
        new window.RTCSessionDescription(answer),
        function () {
            console.log('Added answer as local description : ', answer);
        },
        function (error) {
            console.log(error);
        }
    );
}

function getPeerConnection(id) {
    let peerConnections = undefined;
    if (!peerConnections) {
        peerConnections = {};
    }
    if (peerConnections[id]) {
        return peerConnections[id];
    }
    const peerConnection = new RTCPeerConnection(iceConfig)
    peerConnections[id] = peerConnection;
    peerConnection.addStream(_stream);
    peerConnection.onicecandidate = event => onIceCandidate(event, id);
    peerConnection.onaddstream = onAddStream;
    peerConnection.oniceconnectionstatechange = () => onIceConnectionStateChange(peerConnection.iceConnectionState);
    return peerConnection;
}

function onIceConnectionStateChange(state) {
    switch (state) {
        case 'disconnected':
          _disconnectCallback(state);
          break;
        case 'connected':
          _connectCallback(state);
          break;
        case 'completed':
          _connectCallback(state);
          break;
        case 'checking':
          _pendingCallback(state);
          break;
        default:
          _pendingCallback(state);
          break;
    }
}

function onAddStream(event) {
    externalStream = event.stream;
};


function onIceCandidate(event, recipient) {
    if (event.candidate !== null) {
        serverConfig.methods.postIceCandidate(event.candidate, recipient)
            .then(function () {
                console.log('ngWebRTC :: Ice candidate correctly sent');
            })
            .catch(function (error) {
                console.log('ngWebRTC :: Ice candidate error', error);
            });
    }
};

