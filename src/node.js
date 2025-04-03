import { makeId, States } from './utils.js';
import IO from './io.js';
class Node {
  constructor(id) {
    this.id = id;
    this.left = 30;
    this.top = 30;
    this.zIndex = 1;
    this.element = null;
    this.ios = [];
  }

  setLabel(v) {
    this.label = v;
  }

  move(difX, difY) {
    this.left += difX;
    this.top += difY;
    this.element.style.left = this.left + 'px';
    this.element.style.top = this.top + 'px';
  }

  render() {
    // Node wrap
    const node = this.makeNodeBase();
    
    this.element = node;
    return node;
  }

  makeNodeBase() {
    // node base.
    const node = document.createElement('div');
    node.id = this.id;
    node.style.top = this.top + 'px';
    node.style.left = this.left + 'px';
    node.style.zIndex = this.zIndex;
    node.classList.add('node');
    node.addEventListener('mousedown', (e) => this.onMouseDown(e));

    // Title
    const title = document.createElement('h3');
    title.classList.add('node-title');
    title.innerText = this.label;

    // Header
    const header = document.createElement('div');
    header.classList.add('node-header');
    
    // Append elements.
    header.appendChild(title);
    node.appendChild(header);

    return node;
  }
  makeNodeIOConainer() {
    const nodeIOs = document.createElement('div');
    nodeIOs.classList.add('node-ios');
    return nodeIOs;
  }

  update(...v) {}

  onMouseDown(e) {
    States.holdingNode = this;
    States.selectNode = this;
    States.mouse.x = e.clientX;
    States.mouse.y = e.clientY;
  }
  
}

export class NodeTextBox extends Node {
  constructor(id) {
    super(id);
    this.label = 'My Text';
  }

  render() {
    const node = super.makeNodeBase();
    const nodeIOs = super.makeNodeIOConainer();
    
    // IO
    const body = document.createElement('div');
    body.innerText = 'Hello Guinness!';
    const io = new IO(this.id, 'output', body);
    this.ios.push(io.gate);
    
    nodeIOs.appendChild(io.render());
    node.appendChild(nodeIOs);

    this.element = node;
    return node;
  }

}

export class NodeDisplay extends Node {
  constructor(id) {
    super(id);
    this.label = 'display';
    this.value = '';
  }

  render() {
    const node = super.makeNodeBase();
    const nodeIOs = super.makeNodeIOConainer();
    
    // IO
    const body = document.createElement('div');
    body.innerText = this.value;
    const io = new IO(this.id, 'input', body);
    this.ios.push(io.gate);

    nodeIOs.appendChild(io.render());
    node.appendChild(nodeIOs);

    this.element = node;
    return node;
  }

  update(value) {
    this.output.innerText = value;
  }
}

export class NodeCondition extends Node {
  constructor(id) {
    super(id);
    this.label = 'condition';
    this.value = '';
  }
 
  render() {
    const node = super.makeNodeBase();
    const nodeIOs = super.makeNodeIOConainer();
    
    // IO
    for (const label of ['input1', 'input2', 'True', 'False']) {
      const body = document.createElement('div');
      body.innerText = label;
      const io = new IO(this.id, label.indexOf('input') >= 0 ? 'input' : 'output', body);
      this.ios.push(io.gate);
      nodeIOs.appendChild(io.render());
    }

    node.appendChild(nodeIOs);

    this.element = node;
    return node;
  }

}