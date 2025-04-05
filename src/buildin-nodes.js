import { Input, Output } from './io.js';
import Node from './node.js';

export class NodeTextBox extends Node {
  constructor() {
    super();
    this.label = 'Guinness';
  }

  makeIOs() {
    const body = document.createElement('input');
    body.classList.add('textbox');
    body.addEventListener('change', (e) => this.#onChangeText(e));
    body.value = 'Hello Guinness!';
    const io = new Output(this.id, body, 'Hello Guinness!');
    
    return [io];
  }

  action() {
    for (const io of this.ios) {
      io.update(this.value);
    }
  }

  #onChangeText(e) {
    this.value = e.target.value;
    this.action();
  }

}

export class NodeDisplay extends Node {
  constructor() {
    super();
    this.label = "Ohara's";
    this.output = null;
    this.value = '';
  }

  makeIOs() {
    const body = document.createElement('div');
    this.output = body;
    const io = new Input(this.id, body, '', (v) => this.output.innerText = v);
    
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
 
  makeIOs() {
    // IO
    const ios = [];
    for (const label of ['input1', 'input2', 'True', 'False']) {
      const body = document.createElement('div');
      body.innerText = label;
      const isOutput = label.indexOf('input') < 0;

      if (isOutput) {
        body.classList.add('right');
        ios.push(new Output(this.id, body, label));
      } else {
        ios.push(new Input(this.id, body, label));
      }

      
    }
    
    return ios;
  }

  action(v) {
    for (const io of this.ios) {
      io.update(this.value);
    }
  }
}


export class NodeNumberBox extends Node {
  constructor() {
    super();
    this.label = 'Number';
    this.input = null;
  }

  makeIOs() {
    const body = document.createElement('input');
    body.type = 'number';
    body.classList.add('textbox');
    body.addEventListener('change', (e) => this.value = e.target.value);
    body.value = 0;
    const io = new Output(this.id, body, 0);
    
    return [io];
  }

  action() {
    return this.input.value;
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
      const io = new Input(this.id, body, 0);
      this.ios.push(io.gate);
      nodeIOs.appendChild(io.render());
    }

    const output = document.createElement('div');
    output.classList.add('right');
    output.innerText = 'Output';
    const io = new Output(this.id, output, 0);
    this.ios.push(io.gate);
    nodeIOs.appendChild(io.render());

    node.appendChild(nodeIOs);
    this.element = node;
    return node;
  }

}