!function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="/",t(t.s=1)}([function(e,n){!function(){"use strict";angular.module("base64",[]).constant("$base64",function(){var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";function n(n,t){var o=e.indexOf(n.charAt(t));if(-1==o)throw"Cannot decode base64";return o}function t(e,n){var t=e.charCodeAt(n);if(t>255)throw"INVALID_CHARACTER_ERR: DOM Exception 5";return t}return{encode:function(n){if(1!=arguments.length)throw"SyntaxError: Not enough arguments";var o,r,i=[],c=(n=""+n).length-n.length%3;if(0==n.length)return n;for(o=0;o<c;o+=3)r=t(n,o)<<16|t(n,o+1)<<8|t(n,o+2),i.push(e.charAt(r>>18)),i.push(e.charAt(r>>12&63)),i.push(e.charAt(r>>6&63)),i.push(e.charAt(63&r));switch(n.length-c){case 1:r=t(n,o)<<16,i.push(e.charAt(r>>18)+e.charAt(r>>12&63)+"==");break;case 2:r=t(n,o)<<16|t(n,o+1)<<8,i.push(e.charAt(r>>18)+e.charAt(r>>12&63)+e.charAt(r>>6&63)+"=")}return i.join("")},decode:function(e){var t,o,r,i=(e=""+e).length;if(0==i)return e;if(i%4!=0)throw"Cannot decode base64";t=0,"="==e.charAt(i-1)&&(t=1,"="==e.charAt(i-2)&&(t=2),i-=4);var c=[];for(o=0;o<i;o+=4)r=n(e,o)<<18|n(e,o+1)<<12|n(e,o+2)<<6|n(e,o+3),c.push(String.fromCharCode(r>>16,r>>8&255,255&r));switch(t){case 1:r=n(e,o)<<18|n(e,o+1)<<12|n(e,o+2)<<6,c.push(String.fromCharCode(r>>16,r>>8&255));break;case 2:r=n(e,o)<<18|n(e,o+1)<<12,c.push(String.fromCharCode(r>>16))}return c.join("")}}}())}()},function(e,n,t){e.exports=t(2)},function(e,n,t){"use strict";t.r(n);t(0);function o(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}var r=new WeakMap,i={},c={offerToReceiveAudio:!0,offerToReceiveVideo:!0},a=void 0,s=void 0,u={iceServers:[{urls:"stun:stun.l.google.com:19302"}]},d={url:"",methods:{postIceCandidate:function(e,n){return console.log("ngWebRTC :: posting Ice Candidate : ")},postOffer:function(e,n,t){return console.log("ngWebRTC :: posting offer data : ")}}},f=[],l=void 0;window.RTCPeerConnection=window.RTCPeerConnection||window.webkitRTCPeerConnection||window.mozRTCPeerConnection,window.RTCIceCandidate=window.RTCIceCandidate||window.mozRTCIceCandidate||window.webkitRTCIceCandidate,window.RTCSessionDescription=window.RTCSessionDescription||window.mozRTCSessionDescription||window.webkitRTCSessionDescription,navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;var p=function(){function e(n,t){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),r.set(this,{$q:n,$base64:t})}var n,t,s;return n=e,(t=[{key:"onConnect",value:function(e){return i.onConnect=e,this}},{key:"onDisconnect",value:function(e){return i.onDisconnect=e,this}},{key:"onPending",value:function(e){return i.onPending=e,this}},{key:"onStream",value:function(){return l.promise}},{key:"setServerConfig",value:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;d=e,n&&(u=n)}},{key:"getOffers",value:function(){var e=r.get(this).$q.defer();return d.methods.get("/webrtc/offer").then((function(n){return e.resolve((t=n.data.offers,o=[],angular.forEach(t,(function(e){switch(e.type){case"sdp-offer":e.RTCDescription=$base64.decode(e.RTCDescription),o.push(e);break;case"sdp-answer":e.RTCDescription=$base64.decode(e.RTCDescription),t=g((n=e).emitter),n={sdp:n.RTCDescription,type:"answer",emitter:n.emitter},angular.forEach(f,(function(e){t.addIceCandidate(new window.RTCIceCandidate(e))})),t.setRemoteDescription(new window.RTCSessionDescription(n),(function(){console.log("Added answer as local description : ",n)}),(function(e){console.log(e)}));break;case"ice":console.log("got ice from server : ",e),f.push(e.ice)}var n,t})),o));var t,o})).catch((function(n){return e.reject(n)})),e.promise}},{key:"acceptOffer",value:function(e){var n=g(e.emitter);e={sdp:e.RTCDescription,type:"offer",emitter:e.emitter},console.log(e),n.setRemoteDescription(new window.RTCSessionDescription(e)),angular.forEach(f,(function(e){n.addIceCandidate(new window.RTCIceCandidate(e))})),n.createAnswer((function(t){n.setLocalDescription(t),d.methods.postOffer(t,e.emitter,"sdp-answer").then((function(){console.log("ngWebRTC :: acceptOffer success")})).catch((function(e){console.log("ngWebRTC :: acceptOffer error",e)}))}),(function(e){console.log(e)}))}},{key:"refuseOffer",value:function(e){}},{key:"createOffer",value:function(e){var n=r.get(this).$q.defer(),t=g(e);return t.createOffer((function(o){t.setLocalDescription(o),d.methods.postOffer(o,e),n.resolve(o)}),(function(e){n.reject(e)}),c),n.promise}},{key:"getExternalMediaStream",value:function(){return(l=r.get(this).$q.defer()).promise}},{key:"getLocalMediaStream",value:function(){return a}},{key:"getUserMedia",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0,n=r.get(this).$q.defer();return navigator.getUserMedia(e||{audio:!0,video:!0},(function(e){a=e,n.resolve(a)}),(function(e){return n.reject(e)})),n.promise}},{key:"init",value:function(){}},{key:"onExternalIceCandidate",value:function(){g(iceCandidate.emitter).addIceCandidate(new window.RTCIceCandidate(iceCandidate.ice))}}])&&o(n.prototype,t),s&&o(n,s),e}();function g(e){var n=void 0;if(n||(n={}),n[e])return n[e];var t=new RTCPeerConnection(u);return n[e]=t,t.addStream(a),t.onicecandidate=function(n){return function(e,n){null!==e.candidate&&d.methods.postIceCandidate(e.candidate,n).then((function(){console.log("ngWebRTC :: Ice candidate correctly sent")})).catch((function(e){console.log("ngWebRTC :: Ice candidate error",e)}))}(n,e)},t.ontrack=h,t.oniceconnectionstatechange=function(){return function(e){switch(e){case"disconnected":i.onDisconnect(e);break;case"connected":case"completed":i.onConnect(e);break;case"checking":default:i.onPending(e)}}(t.iceConnectionState)},t}function h(e){s=e.streams[0]||void 0,l&&(l.resolve(s),l=void 0)}p.$inject=["$q","$base64"];n.default=angular.module("ngWebRTC",["base64"]).service("$webrtc",p).name}]);