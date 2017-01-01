'use strict';

class ElementList {
    constructor(controller, container) {
        this.controller = controller;
        this.container = container;
    }

    selectWithData() {
        return this
            .select()
            .data(this.data, this.keyMapping);
    }

    update() {
        const elements = this.selectWithData();

        this.enter(elements.enter());
        this.exit(elements.exit());
        this.updateElements(elements);
    }

    enter() {}

    exit() {}

    updateElements() {}
}

module.exports = ElementList;