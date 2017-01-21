'use strict';

const View = require('../core/View');

class CountryView extends View {
    get name() {
        return 'Country';
    }
    get icon() {
        return 'place';
    }

    get routingTemplate() {
        return '/country';
    }
}

module.exports = CountryView;