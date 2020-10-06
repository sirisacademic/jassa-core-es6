import * as PromiseBluebird from 'bluebird';

var shared = {
    Promise: PromiseBluebird,
    ajax: function() {
        throw new Error('not set!');
    }
};

export default shared;
