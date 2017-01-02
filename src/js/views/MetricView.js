'use strict';

const View = require('../core/View');

class MetricView extends View {
    get name() {
        return 'Metric';
    }
    get icon() {
        return 'poll';
    }

    get routingTemplate() {
        return '/metric'
    }
}

module.exports = MetricView;