'use strict';

const Collection = require('../core/Collection');
const CountriesDAO = require('../dao/CountriesDAO');

class CountriesCollection extends Collection {
    loadData() {
        return CountriesDAO
            .getAll()
            .then(countries => {
                this.models = {};

                countries.forEach(country => {
                    this.models[country.code] = country;
                });
            });
    }
}

module.exports = CountriesCollection;