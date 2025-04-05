import { States } from './utils.js';
import { Edge } from './edge.js';
import { NodeTextBox, NodeDisplay, NodeCondition, NodeNumberBox } from './buildin-nodes.js';

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
    window.addEventListener('keyup', (e) => this.#onKeyUp(e));
  }

  addNode(type) {
    const node = this.#selectNode(type);
    this.nodes.push(node);
    this.mount(node.render());
  }

  action() {
    let result;
    for (const node of this.nodes) {
      result = node.action(result);
    }

    for (const edge of this.edges) {
      edge.move();
    }
  }

  #selectNode(type) {
    switch(type) {
      case 'textbox':
        return new NodeTextBox();
      case 'display':
        return new NodeDisplay();
      case 'number':
        return new NodeNumberBox();
      case 'condition':
        return new NodeCondition();
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
      this.#connect();
      document.getElementById('drawing')?.remove();
    }
    
    States.holdingNode = null;
    States.connecting = null;
    States.selectedIO = {
      from: null,
      to: null,
    }
  }

  #onKeyUp(e) {
    switch (e.key) {
      case 'Delete':
        States.selectedNode.remove();
        this.nodes = this.nodes.filter((v) => v.id !== States.selectedNode.id);
        // TODO Edge;
        for (const edge of this.edges) {
          if (edge.includeNode(States.selectedNode.id)) {
            edge.remove();
          }
        }
        this.edges = this.edges.filter((v) => !v.includeNode(States.selectedNode.id));
        States.selectedNode = null;
        break;
    }
  }

  #connect() {
    if (States.selectedIO.from === null || States.selectedIO.to === null) return;
    const edge = new Edge(States.selectedIO.from, States.selectedIO.to);
    this.edges.push(edge);
    const svg = edge.render();
    States.container.appendChild(svg);
    
  }
  
}
