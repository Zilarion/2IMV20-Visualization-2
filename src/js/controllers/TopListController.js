'use strict';

var Controller = require('../core/Controller');
var d3 = require('d3');
const ElementList = require('../core/ElementList');

class PositionList extends ElementList {
    get data() {
        const grouped = new Map();

        this.controller.values.asKeyValueArray()
            .filter(([,value]) => value !== null)
            .forEach(([country, value]) => {
            if (!grouped.has(value)) {
                grouped.set(value, [[country, value]]);
            } else {
                grouped.get(value).push([country, value]);
            }
        });

        return Array.from(grouped.entries())
            .sort(([a,], [b,]) => this.controller.highest ? b - a : a - b)
            .slice(0, 3)
            .map(([, countriesAndValues]) => countriesAndValues);
    }

    get keyMapping() {
        return (_, i) => i;
    }

    select() {
        return this.container
            .selectAll('li.toplist__position');
    }

    enter(elements) {
        const li = elements
            .append('li')
            .classed('mdl-list__item', true)
            .classed('toplist__position', true);

        li
            .append('div')
            .classed('mdl-list__item-avatar', true)
            .text((_, i) => i+1);

        const content = li
            .append('div')
            .classed('mdl-list__item-primary-content', true);

        content
            .append('ul')
            .classed('mdl-list', true);
    }

    exit(elements) {
        elements
            .remove()
    }
}

class CountryList extends ElementList {
    get data() {
        return (countriesAndValues) => countriesAndValues;
    }

    get keyMapping() {
        return ([country,]) => country;
    }

    select() {
        return this.container
            .selectWithData()
            .select('ul')
            .selectAll('li');
    }

    enter(elements) {
        const li = elements
            .append('li')
            .classed('mdl-list__item', true)
            .classed('mdl-list__item--two-line', true);

        const content = li
            .append('div')
            .classed('mdl-list__item-primary-content', true);

        const country = content
            .append('div');

        country
            .append('span')
            .classed('flag-icon', true)
            .style('background-image', ([countryCode,]) => {
                const country = this.controller.countries.get(countryCode);

                return country && country.alpha2Code ?
                    `url('/img/flags/${country.alpha2Code.toLowerCase()}.svg')`
                    : 'none';
            });

        country
            .append('span')
            .text(([countryCode,]) => {
                const country = this.controller.countries.get(countryCode);

                return country ? country.name : '';
            });

        const value = content
            .append('div')
            .classed('toplist__value', true)
            .classed('mdl-list__item-sub-title', true);

        value
            .append('span')
            .classed('toplist__number', true);

        value
            .append('span')
            .classed('toplist__meter', true)
            .append('span');

        li.on('click', ([countryCode,]) => {
            const view = this.controller.view;
            view.app.show('comparisonView', {
                country1: countryCode,
                metric: view.data.metric,
                properties: view.data.properties
            });
        });

        li.on('mouseover', ([countryCode,]) => {
            this.controller.view.worldMapController.container.select(`[data-country="${countryCode}"]`)
                .classed('hovered', true)
                .each(function () {
                    this.parentNode.appendChild(this);
                });
        });

        li.on('mouseout', ([countryCode,]) => {
            this.controller.view.worldMapController.container.select(`[data-country="${countryCode}"]`)
                .classed('hovered', false)
                .each(function () {
                    this.parentNode.appendChild(this);
                });
        });
    }

    exit(elements) {
        elements
            .remove()
    }

    updateElements(elements) {
        const format = (value) => {
            const metric = this.controller.view.metric;

            return value !== null ? d3.format(metric.format)(value) : '-';
        };

        const percentage = (value) => {
            if (value === null) {
                return 0;
            }

            const metric = this.controller.view.metric;

            return d3.format("%")(
                Object.entries(metric.scaleArguments)
                    .map(([key, value]) => x => x[key](value))
                    .reduce((b, a) => (x) => b(a(x)), x => x)(
                        d3.scale
                            [metric.scale]()
                    )
                .domain([metric.minValue, metric.maxValue])
                .range([0, 1])(value)
            );
        };

        elements
            .select('.toplist__number')
            .text(([,value]) => format(value));

        elements
            .select('.toplist__meter span')
            .style('width', ([,value]) => percentage(value));
    }
}

class TopListController extends Controller {
    init() {
        this.positionList = new PositionList(
            this,
            this.container.select('ol')
        );

        this.countryList = new CountryList(
            this,
            this.positionList
        );
    }

    update() {
        this.positionList.update();
        this.countryList.update();
    }
}

module.exports = TopListController;
