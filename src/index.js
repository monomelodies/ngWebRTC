
"use strict";

import Service from './Service';
import 'angular-base64';

export default angular.module('ngWebRTC', ['base64'])
    .service('$webrtc', Service)
    .name;

