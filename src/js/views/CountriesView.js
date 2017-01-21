'use strict';

const View = require('../core/View');

class CountriesView extends View {
    get name() {
        return 'Countries';
    }
    get icon() {
        return 'flag';
    }

    get routingTemplate() {
        return '/countries';
    }
}

module.exports = CountriesView;