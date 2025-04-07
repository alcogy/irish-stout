import { States } from './utils.js';
import { Edge } from './edge.js';

export default class IrishStout {
  constructor(container) {
    States.container = document.getElementById(container);
    States.container.classList.add('irish-stout');
    States.container.addEventListener('mousedown', (e) => this.#onMouseDown(e));
    States.offset.top = States.container.getBoundingClientRect()['top'];
    States.offset.left = States.container.getBoundingClientRect()['left'];
    
    window.addEventListener('mousemove', (e) => this.#onMouseMove(e));
    window.addEventListener('mouseup', (e) => this.#onMouseUp(e));
    window.addEventListener('keyup', (e) => this.#onKeyUp(e));
  }

  addNode(node) {
    States.nodes.push(node);
    this.mount(node.render());
  }

  action() {
    let result;
    for (const node of States.nodes) {
      result = node.action(result);
    }

    for (const edge of States.edges) {
      edge.move();
    }
  }

  removeNode(nodeId) {
    States.nodes = States.nodes.filter((v) => v.id !== nodeId);
  }

  mount(dom) {
    States.container.appendChild(dom);
  }

  #onMouseDown(e) {
    States.isHoldingContainer = true;
    States.mouse.x = e.clientX;
    States.mouse.y = e.clientY;
  }

  #onMouseMove(e) {
    const diff = {
      x: e.clientX - States.mouse.x,
      y: e.clientY - States.mouse.y,
    }
    if (States.holdingNode) {
      // Moving node
      States.holdingNode.move(diff.x, diff.y);
      // Moving Edge
      for (const edge of States.edges) {
        if (edge.includeNode(States.holdingNode.id)) edge.move();
      }
      
    } else if (States.connecting) {
      // Remove curren connection
      for (const edge of States.edges) {
        if (edge.from.id === States.connecting.io.id || edge.to.id === States.connecting.io.id) {
          if (edge.from.type === 'output') edge.from.setConnect(null);
          if (edge.to.type === 'output') edge.to.setConnect(null);
          edge.remove();
          States.edges = States.edges.filter((v) => v !== edge);

          break;
        }
      }
      States.connecting.move(e.clientX, e.clientY);

    } else if (States.isHoldingContainer) {
      this.#move(diff.x, diff.y);
    }

    States.mouse.x = e.clientX;
    States.mouse.y = e.clientY;
  }

  #onMouseUp() {
    if (States.connecting) {
      this.#connect();
      document.getElementById('drawing')?.remove();
    }
    
    States.holdingNode = null;
    States.connecting = null;
    States.isHoldingContainer = false;
    States.selectedIO = {
      from: null,
      to: null,
    }
  }

  #onKeyUp(e) {
    switch (e.key) {
      case 'Delete':
        States.selectedNode.remove();
        States.nodes = States.nodes.filter((v) => v.id !== States.selectedNode.id);
        // TODO Edge;
        for (const edge of States.edges) {
          if (edge.includeNode(States.selectedNode.id)) {
            edge.remove();
          }
        }
        States.edges = States.edges.filter((v) => !v.includeNode(States.selectedNode.id));
        States.selectedNode = null;
        break;
    }
  }

  #connect() {
    if (States.selectedIO.from === null || States.selectedIO.to === null) return;
    if (States.selectedIO.from.type === States.selectedIO.to.type) return;
    for (const edge of States.edges) {
      if (States.selectedIO.to.id === edge.from.id || States.selectedIO.to.id === edge.to.id ) return;
    }
    // Set connecttion on IO.
    if (States.selectedIO.from.type === 'output') {
      States.selectedIO.from.setConnect(States.selectedIO.to);
      States.selectedIO.to.update(States.selectedIO.from.value);
    } else {
      States.selectedIO.to.setConnect(States.selectedIO.from);
      States.selectedIO.from.update(States.selectedIO.to.value);
    }

    // create edge
    const edge = new Edge(States.selectedIO.from, States.selectedIO.to);
    States.edges.push(edge);
    const svg = edge.render();
    States.container.appendChild(svg);    
  }
  
  #move(dx, dy) {
    // Moving all nodes
    for (const node of States.nodes) {
      node.move(dx, dy);
    }
    
    // Moving all edges
    for (const edge of States.edges) {
      edge.move();
    }
  }
}
