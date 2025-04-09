import { States } from './utils.js';
import Edge from './edge.js';
import Node from './node.js';
import { Output } from './io.js';
import { styling } from './styling.js';

export class IrishStout {
  constructor(container: any) {
    States.container = document.getElementById(container);
    if (States.container === null) return;
    States.container.classList.add('irish-stout');
    States.container.addEventListener('mousedown', (e: MouseEvent) => this.onMouseDown(e));
    States.offset.top = States.container.getBoundingClientRect()['top'];
    States.offset.left = States.container.getBoundingClientRect()['left'];
    
    window.addEventListener('mousemove', (e: MouseEvent) => this.onMouseMove(e));
    window.addEventListener('mouseup', (e: MouseEvent) => this.onMouseUp(e));
    window.addEventListener('keyup', (e: KeyboardEvent) => this.onKeyUp(e));

    const style = document.createElement('style');
    style.textContent = styling;
    document.head.appendChild(style);
  }

  addNode(node: Node) {
    States.nodes.push(node);
    this.mount(node.render());
  }

  removeNode(nodeId: string) {
    States.nodes = States.nodes.filter((v) => v.id !== nodeId);
  }

  updateNodeProps(props: any) {
    if (States.selectedNode === null) return;
    States.selectedNode.update(props);
  }

  getSelectedNodeProps() {
    if (States.selectedNode === null) return;
    return States.selectedNode.props;
  }

  mount(dom: HTMLElement) {
    if (States.container !== null) {
      States.container.appendChild(dom);
    }
  }

  private onMouseDown(e: MouseEvent) {
    States.isHoldingContainer = true;
    States.mouse.x = e.clientX;
    States.mouse.y = e.clientY;
    States.selectedNode = null;
    const selected = document.querySelectorAll('div.node.selected');
    for (const sel of selected) {
      sel.classList.remove('selected');
    }
  }

  private onMouseMove(e: MouseEvent) {
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
          if (edge.from.type === 'output') (edge.from as Output).setConnect(null);
          if (edge.to.type === 'output') (edge.to as Output).setConnect(null);
          edge.remove();
          States.edges = States.edges.filter((v) => v !== edge);

          break;
        }
      }
      States.connecting.move(e.clientX, e.clientY);

    } else if (States.isHoldingContainer) {
      this.move(diff.x, diff.y);
    }

    States.mouse.x = e.clientX;
    States.mouse.y = e.clientY;
  }

  private onMouseUp(e: MouseEvent) {
    if (States.connecting) {
      this.connect();
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

  private onKeyUp(e: KeyboardEvent) {
    switch (e.key) {
      case 'Delete':
        if (States.selectedNode === null) return;
        const selectedId = States.selectedNode.id;
        States.selectedNode.remove();
        States.nodes = States.nodes.filter((v) => v.id !== selectedId);
        for (const edge of States.edges) {
          if (edge.includeNode(selectedId)) {
            edge.remove();
          }
        }
        States.edges = States.edges.filter((v) => !v.includeNode(selectedId));
        States.selectedNode = null;
        break;
      case 'Escape':
        const selected = document.querySelectorAll('div.node.selected');
        for (const sel of selected) {
          sel.classList.remove('selected');
        }
        break;
    }
  }

  private connect() {
    if (States.selectedIO.from === null || States.selectedIO.to === null) return;
    if (States.selectedIO.from.type === States.selectedIO.to.type) return;
    for (const edge of States.edges) {
      if (States.selectedIO.to.id === edge.from.id || States.selectedIO.to.id === edge.to.id ) return;
    }
    // Set connecttion on IO.
    if (States.selectedIO.from.type === 'output') {
      (States.selectedIO.from as Output).setConnect(States.selectedIO.to);
      States.selectedIO.to.update(States.selectedIO.from.value);
    } else {
      (States.selectedIO.to as Output).setConnect(States.selectedIO.from);
      States.selectedIO.from.update(States.selectedIO.to.value);
    }

    // create edge
    const edge = new Edge(States.selectedIO.from, States.selectedIO.to);
    States.edges.push(edge);
    const svg = edge.render();

    if (States.container !== null) {
      States.container.appendChild(svg);
    }
  }
  
  private move(dx: number, dy: number) {
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
