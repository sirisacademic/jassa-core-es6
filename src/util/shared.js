import * as PromiseBluebird from 'bluebird';
import * as $ from 'jquery';

var shared = {
    Promise: PromiseBluebird,
    ajax: $.ajax
};

export default shared;
