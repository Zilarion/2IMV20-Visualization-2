'use strict';

const Controller = require('../core/Controller');
const ElementList = require('../core/ElementList');

class LinkList extends ElementList {
    get data() {
        return Object.entries(this.controller.view.views);
    }

    get keyMapping() {
        return ([viewName,]) => viewName;
    }

    select() {
        return this.container
            .selectAll('.mdl-navigation__link');
    }

    enter(elements) {
        var self = this;

        const a = elements
            .append('a')
            .classed('mdl-navigation__link', true)
            .attr('href', '#')
            .on('click', ([viewName,]) => {

            });

        a
            .append('i')
            .classed('material-icons', true)
            .attr('role', 'presentation')
            .text(([,{icon}]) => icon);

        a
            .append('span')
            .text(([,{name}]) => name);
    }

    exit(elements) {
        elements
            .remove();
    }

    updateElements(elements) {
        elements
            .classed('mdl-navigation__link--current', ([viewName,]) => this.controller.data.view === viewName);
    }
}

class NavigationController extends Controller {
    init() {
        this.linkList = new LinkList(
            this,
            this.container
        );
    }

    update() {
        this.linkList.update();
    }
}

module.exports = NavigationController;