/**
 * Created by ruudandriessen on 26/01/2017.
 */
'use strict';

const Controller = require('../core/Controller');
const d3 = require('d3');

class ButtonController extends Controller {
    init() {
        let self = this;
        this.container.on("click", function() { self.callback(self.view); })
    }

    update() {
    }
}

module.exports = ButtonController;