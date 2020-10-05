/* global define */
/* global window */

import Jassa from './index.js';

if (typeof define == 'function' && define.amd) {
    define('Jassa', function () {
        return Jassa;
    });
} else {
    window.Jassa = Jassa;
}
