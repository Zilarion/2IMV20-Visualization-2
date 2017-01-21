'use strict';

const View = require('../core/View');

class ComparisonView extends View {
    get name() {
        return 'Country comparison';
    }
    get icon() {
        return 'compare_arrows';
    }

    get routingTemplate() {
        return '/country-comparison';
    }
}

module.exports = ComparisonView;