import { makeId, States } from './utils.js';
import { Edge } from './edge.js';
import { NodeTextBox, NodeDisplay, NodeCondition } from './node.js';

export default class IrishStout {
  constructor(container) {
    States.container = document.getElementById(container);
    States.container.classList.add('irish-stout');
    States.offset.top = States.container.getBoundingClientRect()['top'];
    States.offset.left = States.container.getBoundingClientRect()['left'];
    this.nodes = [];
    this.edges = [];
    
    window.addEventListener('mousemove', (e) => this.#onMouseMove(e));
    window.addEventListener('mouseup', (e) => this.#onMouseUp(e));
  }

  addNode(type) {
    const node = this.#selectNode(type);
    this.nodes.push(node);
    this.mount(node.render());
  }

  #selectNode(type) {
    switch(type) {
      case 'textbox':
        return new NodeTextBox(makeId());
      case 'display':
        return new NodeDisplay(makeId());
      case 'condition':
        return new NodeCondition(makeId());
    }
  }

  removeNode(nodeId) {
    this.nodes = this.nodes.filter((v) => v.id !== nodeId);
  }

  mount(dom) {
    States.container.appendChild(dom);
  }

  #onMouseMove(e) {
    if (States.holdingNode) {
      // Moving node
      const diff = {
        x: e.clientX - States.mouse.x,
        y: e.clientY - States.mouse.y,
      }
      States.holdingNode.move(diff.x, diff.y);
      States.mouse.x = e.clientX;
      States.mouse.y = e.clientY;

      // Moving Edge
      for (const edge of this.edges) {
        if (edge.includeNode(States.holdingNode.id)) edge.move();
      }
      
    } else if (States.connecting) {
      States.connecting.move(e.clientX, e.clientY);
    }
  }

  #onMouseUp() {
    if (States.connecting) {
      if (States.selectedIO.from && States.selectedIO.to) {
        const edge = new Edge(States.selectedIO.from, States.selectedIO.to);
        this.edges.push(edge);
        const svg = edge.render();
        States.container.appendChild(svg);
      }
      document.getElementById('drawing')?.remove();
    }
    
    States.holdingNode = null;
    States.connecting = null;
    States.selectedIO = {
      from: null,
      to: null,
    }
  }
  
}
