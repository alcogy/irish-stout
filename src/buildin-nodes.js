import { makeId, States } from './utils.js';
import IO from './io.js';
import Node from './node.js';

export class NodeTextBox extends Node {
  constructor() {
    super();
    this.label = 'My Text';
  }

  makeIOs() {
    const body = document.createElement('div');
    body.innerText = 'Hello Guinness!';
    const io = new IO(this.id, 'output', body);
    
    return [io];
  }

  action() {
    return 'Hello Guinness!';
  }

}

export class NodeNumberBox extends Node {
  constructor() {
    super();
    this.label = 'Number';
    this.input = null;
  }

  render() {
    const node = super.makeNodeBase();
    const nodeIOs = super.makeNodeIOConainer();
    
    // IO
    const input = document.createElement('input');
    input.type = 'number';
    input.value = 0;
    this.input = input;
    const body = document.createElement('div');
    body.appendChild(input);
    const io = new IO(this.id, 'output', body);
    this.ios.push(io.gate);
    
    nodeIOs.appendChild(io.render());
    node.appendChild(nodeIOs);

    this.element = node;
    return node;
  }

  action() {
    return this.input.value;
  }
}

export class NodeDisplay extends Node {
  constructor() {
    super();
    this.label = 'display';
    this.output = null;
    this.value = '';
  }

  makeIOs() {
    const body = document.createElement('div');
    this.output = body;
    const io = new IO(this.id, 'input', body, (v) => this.value = v);
    
    return [io];
  }

  action(v) {
    this.output.innerText = v;
  }
}

export class NodeCondition extends Node {
  constructor() {
    super();
    this.label = 'condition';
  }
 
  render() {
    const node = super.makeNodeBase();
    const nodeIOs = super.makeNodeIOConainer();
    
    // IO
    for (const label of ['input1', 'input2', 'True', 'False']) {
      const body = document.createElement('div');
      body.innerText = label;
      const isOutput = label.indexOf('input') < 0;

      if (isOutput) body.classList.add('right');
      const io = new IO(this.id, isOutput ? 'output' : 'input', body);
      this.ios.push(io.gate);
      nodeIOs.appendChild(io.render());
    }

    node.appendChild(nodeIOs);
    this.element = node;
    return node;
  }

}

export class NodeAdd extends Node {
  constructor() {
    super();
    this.label = 'Add';
    this.inputs = [];
  }
 
  render() {
    const node = super.makeNodeBase();
    const nodeIOs = super.makeNodeIOConainer();
    
    // IO
    for (const label of ['input1', 'input2', 'input3']) {
      const body = document.createElement('div');
      body.innerText = label;
      const io = new IO(this.id, 'input', body);
      this.ios.push(io.gate);
      nodeIOs.appendChild(io.render());
    }

    const output = document.createElement('div');
    output.classList.add('right');
    output.innerText = 'Output';
    const io = new IO(this.id, 'output', output);
    this.ios.push(io.gate);
    nodeIOs.appendChild(io.render());

    node.appendChild(nodeIOs);
    this.element = node;
    return node;
  }

}