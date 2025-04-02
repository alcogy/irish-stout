import { makeId, States } from './utils.js';
import { Connecting } from './edge.js';

class Node {
  constructor(id) {
    this.id = id;
    this.inputs = [];
    this.outputs = [];
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
    const node = document.createElement('div');
    node.id = this.id;
    node.style.top = this.top + 'px';
    node.style.left = this.left + 'px';
    node.style.zIndex = this.zIndex;
    node.classList.add('node');
    node.addEventListener('mousedown', (e) => this.onMouseDown(e));

    // Title
    const title = document.createElement('p');
    title.classList.add('node-title-input');
    title.innerText = this.label;
    
    // Header
    const nodeHeader = document.createElement('div');
    nodeHeader.classList.add('node-header');
    nodeHeader.appendChild(title);

    // Input   
    const nodeInputs = document.createElement('div');
    nodeInputs.classList.add('node-inputs');
    for (let i = 0; i < this.inputs.length; i++) {
      nodeInputs.appendChild(this.makeIO(this.id, this.inputs[i], i, 'input'));  
    }
    
    // Output
    const nodeOutputs = document.createElement('div');
    nodeOutputs.classList.add('node-outputs');
    for (let i = 0; i < this.outputs.length; i++) {
      nodeOutputs.appendChild(this.makeIO(this.id, this.outputs[i], i, 'output'));  
    }

    node.appendChild(nodeHeader);
    node.appendChild(nodeInputs);
    node.appendChild(nodeOutputs);

    this.element = node;
    return node;
  }

  update(...v) {

  }

  makeIO(parentId, str, index, io) {
    // Label
    const label = document.createElement('input');
    label.classList.add('io-label');
    label.value = str;
  
    // Circle
    const circle = document.createElement('button');
    circle.classList.add('circle');
    circle.id = makeId();
    circle.dataset.parentId = parentId;
    circle.dataset.io = io;
    circle.dataset.index = index;
    circle.addEventListener('mousedown', (e) => this.onMouseDownCircle(e, circle));
    circle.addEventListener('mouseenter', this.onMouseEnterCircle);
    circle.addEventListener('mouseleave', this.onMouseLeaveCircle);
    this.ios.push(circle);

    // Input
    const input = document.createElement('div');
    if (io === 'input') {
      input.classList.add('item');
      input.appendChild(circle);
      input.appendChild(label);
    } else {
      input.classList.add('node-output');
      input.appendChild(label);
      input.appendChild(circle);      
    }
  
    return input;
  }

  onMouseDown(e) {
    States.holdingNode = this;
    States.selectNode = this;
    States.mouse.x = e.clientX;
    States.mouse.y = e.clientY;
  }

  onMouseDownCircle(e, circle) {
    e.stopPropagation();
    
    const rect = circle.getBoundingClientRect();
    const start = {
      top: rect.top - States.offset.top + (rect.height / 2),
      left: rect.left - States.offset.left - (rect.width / 2),
    }
    States.connecting = new Connecting(start);
    States.selectedIO.from = circle;
    States.mouse.x = e.clientX;
    States.mouse.y = e.clientY;
  }

  onMouseEnterCircle(e) {
    States.selectedIO.to = e.target;  
  }
  
  onMouseLeaveCircle(e) {
    States.selectedIO.to = null
  }
}

export class NodeTextBox extends Node {
  constructor(id) {
    super(id);
    this.label = 'textbox';
    this.outputs = ['output'];
  }

  render() {
    // Node wrap
    const node = document.createElement('div');
    node.id = this.id;
    node.style.top = this.top + 'px';
    node.style.left = this.left + 'px';
    node.style.zIndex = this.zIndex;
    node.classList.add('node');
    node.addEventListener('mousedown', (e) => super.onMouseDown(e));

    // Title
    const title = document.createElement('input');
    title.classList.add('node-title-input');
    title.value = this.label;
    
    // Header
    const nodeHeader = document.createElement('div');
    nodeHeader.classList.add('node-header');
    nodeHeader.appendChild(title);

    // Input   
    const nodeInputs = document.createElement('div');
    nodeInputs.classList.add('node-textbox');
    const textbox = document.createElement('input');
    textbox.type = 'text';
    nodeInputs.appendChild(textbox);
    
    // Output
    const nodeOutputs = document.createElement('div');
    nodeOutputs.classList.add('node-outputs');
    nodeOutputs.appendChild(super.makeIO(this.id, 'output', 0, 'output'));  
    
    node.appendChild(nodeHeader);
    node.appendChild(nodeInputs);
    node.appendChild(nodeOutputs);

    this.element = node;
    return node;
  }
}

export class NodeDisplay extends Node {
  constructor(id) {
    super(id);
    this.label = 'display';
    this.inputs = ['input'];
    this.output = null;
    this.value = '';
  }

  render() {
    // Node wrap
    const node = document.createElement('div');
    node.id = this.id;
    node.style.top = this.top + 'px';
    node.style.left = this.left + 'px';
    node.style.zIndex = this.zIndex;
    node.classList.add('node');
    node.addEventListener('mousedown', (e) => super.onMouseDown(e));

    // Title
    const title = document.createElement('input');
    title.classList.add('node-title-input');
    title.value = this.label;
    
    // Header
    const nodeHeader = document.createElement('div');
    nodeHeader.classList.add('node-header');
    nodeHeader.appendChild(title);

    // Input
    const nodeInputs = document.createElement('div');   
    nodeInputs.classList.add('node-inputs');
    nodeInputs.appendChild(super.makeIO(this.id, 'input', 0, 'input'));  
    
    // Output
    const nodeOutputs = document.createElement('div');
    nodeOutputs.classList.add('output-text');
    nodeOutputs.innerText = this.value;
    this.output = nodeOutputs;

    node.appendChild(nodeHeader);
    node.appendChild(nodeInputs);
    node.appendChild(nodeOutputs);

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
    this.inputs = ['input1', 'input2'];
    this.outputs = ['True', 'False'];
    this.value = '';
  }
 
}