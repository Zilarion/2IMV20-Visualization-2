'use strict';

const View = require('../core/View');

class MetricView extends View {
    get name() {
        return 'Metric';
    }
    get icon() {
        return 'poll';
    }
}

module.exports = MetricView;