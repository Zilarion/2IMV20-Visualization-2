'use strict';

const ComparisonView = require('../views/ComparisonView');
const CountriesCollection = require('../collections/CountriesCollection');
const CountriesView = require('../views/CountriesView');
const d3 = require('d3');
const MetricsCollection = require('../collections/MetricsCollection');
const Model = require('./Model');
const NavigationController = require('../controllers/NavigationController');
const Navigo = require('navigo');
const WorldView = require('../views/WorldView');

const DEFAULT_VIEW = 'worldView';

class App {
    constructor() {
        this.countries = new CountriesCollection();
        this.metrics = new MetricsCollection();

        this.views = {
            comparisonView: new ComparisonView(this, d3.select('#comparisonview')),
            countriesView: new CountriesView(this, d3.select('#countriesview')),
            worldView: new WorldView(this, d3.select('#worldview'))
        };

        this.navigationSettings = Model.create({view: DEFAULT_VIEW});
        
        new NavigationController(this, d3.select('.mdl-layout__drawer'), {data: this.navigationSettings});

        this.setupRouter();

        this.navigationSettings.on('change', () => {
            this.updateRoute();
        })
    }

    setupRouter() {
        this.router = new Navigo(null, false);

        let routes = {
            '/': () => {this.show(DEFAULT_VIEW, 'worldView');}
        };

        Object.entries(this.views)
            .forEach(([viewName, {routingTemplate}]) => {
                routes[routingTemplate] = {
                    as: viewName,
                    uses: (params, query) => {
                        this.show(viewName, Object.assign({}, params, query));
                    }
                }
            });


        this.router
            .on(routes)
            .resolve();
    }

    load() {
        this.countries.load();
        this.metrics.load();
    }

    show(viewName, params) {
        Object.values(this.views)
            .forEach(view => {
                view.container.classed('hidden', true);
            });

        this.views[viewName].show(params);
        this.views[viewName].container.classed('hidden', false);

        this.navigationSettings.view = viewName;
        this.navigationSettings.settings = this.views[viewName].data;
    }

    updateRoute() {
        this.router.pause();
        this.router.navigate(
            this.generateRoute(this.navigationSettings.view, this.navigationSettings.settings),
            true
        );
        this.router.resume();
    }

    generateRoute(view, settings) {
        const route = this.router._routes.filter(({name}) => name === view)[0];

        const paramKeys = route.route
            .split('/')
            .filter((part) => part.startsWith(':'))
            .map((part) => part.substr(1));

        let params = {};
        let query = {};

        const addToQuery = (key, value) => {
            if (typeof(value) === 'object') {
                Object.getOwnPropertyNames(value)
                    .forEach((subKey) => {
                        addToQuery(key + '.' + subKey, value[subKey])
                    });
            } else {
                query[key] = value;
            }
        };

        Object.getOwnPropertyNames(settings)
            .forEach(key => {
                const value = settings[key];

                if (paramKeys.includes(key)) {
                    params[key] = value;
                } else {
                    addToQuery(key, value)
                }
            });

        const path = route.route
            .split('/')
            .map((part) => {
                return part.startsWith(':') ?
                    params[part.substr(1)] :
                    part;
            })
            .join('/');

        const queryString = Object.entries(query)
            .map(([key, value]) => key + '=' + value)
            .join('&');

        return path + (queryString.length > 0 ? '?' : '') + queryString;
    }
}

module.exports = App;