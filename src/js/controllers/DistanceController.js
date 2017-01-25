'use strict';

const Controller = require('../core/Controller');
const d3 = require('d3');
const d3Force = require('d3-force');
const ElementList = require('../core/ElementList');

const nodeData = [{id: 'NLD'}, {id: 'BEL'}];
class NodeList extends ElementList {

    get data() {
        return nodeData;
    }

    get keyMapping() {
        return ({id}) => id
    }

    select() {
        return this.container
            .selectAll('circle');
    }

    enter(elements) {
        const node = elements
            .append('circle')
            .attr('r', 5)
            .attr('fill', '#F00');

        node
            .append('title')
            .text(({id}) => id);
    }

    exit(elements) {
        elements
            .remove();
    }

    updateElements(elements) {
        elements
            .attr('cx', ({x}) => x)
            .attr('cy', ({y}) => y);
    }
}

const edgeData = [{source: 'BEL', target: 'NLD', distance: 0.5}];
class EdgeList extends ElementList {
    get data() {
        return edgeData;
    }

    get keyMapping() {
        return ({source, target}) => [source, target].join('-');
    }

    select() {
        return this.container
            .selectAll('line')
    }

    enter(elements) {
        elements
            .append('line');
    }

    exit(elements) {
        elements
            .remove()
    }

    updateElements(elements) {
        elements
            .attr('stroke-width', ({distance}) => Math.sqrt(distance))
            .attr('x1', ({source}) => source.x)
            .attr('y1', ({source}) => source.y)
            .attr('x2', ({target}) => target.x)
            .attr('y2', ({target}) => target.y);
    }
}

class DistanceController extends Controller {
    init() {
        this.svg = this.container.select('svg');
        this.nodeGroup = this.svg.append('g');
        this.edgeGroup = this.svg.append('g');

        this.nodeList = new NodeList(
            this,
            this.nodeGroup
        );

        this.edgeList = new EdgeList(
            this,
            this.edgeGroup
        );

        this.simulation = d3Force.forceSimulation()
            .nodes(this.nodeList.data);

        this.simulation
            .force(
                'link',
                d3Force.forceLink()
                    .id(({id}) => id)
                    .distance(({distance}) => distance*100)
            )
            .force(
                'charge',
                d3Force.forceManyBody()
            );
            // centering
            // collision

        this.simulation
            .force('link')
            .links(this.edgeList.data);

        this.simulation
            .on('tick', () => {this.update()});
    }

    update() {
        this.nodeList.update();
        this.edgeList.update();
    }
}

module.exports = DistanceController;