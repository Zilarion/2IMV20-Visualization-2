'use strict';

const View = require('../core/View');

class MetricsView extends View {
    get name() {
        return 'Metrics';
    }
    get icon() {
        return 'poll';
    }

    get routingTemplate() {
        return '/metrics'
    }
}

module.exports = MetricsView;