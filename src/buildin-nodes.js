import { Input, Output } from './io.js';
import Node from './node.js';

export class NodeTextBox extends Node {
  constructor() {
    super();
    this.label = 'Textbox';
    this.output = null;
  }

  makeIOs() {
    const body = document.createElement('input');
    body.classList.add('textbox');
    body.addEventListener('change', (e) => this.#onChangeText(e));
    body.value = 'Hello Guinness!';
    const io = new Output(this.id, body, 'Hello Guinness!');
    this.output = io;

    return [io];
  }

  #onChangeText(e) {
    this.value = e.target.value;
    this.output.update(this.value);
  }

}

export class NodeNumberBox extends Node {
  constructor() {
    super();
    this.label = 'Number';
    this.output = null;
  }

  makeIOs() {
    const body = document.createElement('input');
    body.type = 'number';
    body.classList.add('textbox');
    body.addEventListener('change', (e) => this.#onChangeText(e));
    body.value = 0;
    const io = new Output(this.id, body, 0);
    this.output = io;

    return [io];
  }

  #onChangeText(e) {
    this.value = e.target.value;
    this.output.update(this.value);
  }
}

export class NodeDisplay extends Node {
  constructor() {
    super();
    this.label = 'Display';
    this.output = null;
    this.value = '';
  }

  makeIOs() {
    const body = document.createElement('div');
    this.output = body;
    const io = new Input(this.id, body, '', (v) => this.output.innerText = v);
    
    return [io];
  }
}

export class NodeCondition extends Node {
  constructor() {
    super();
    this.label = 'condition';
    this.input1 = null;
    this.input2 = null;
    this.outTrue = null;
    this.outFalse = null;
  }
 
  makeIOs() {
    // IO
    const ios = [];

    const input1 = document.createElement('div');
    input1.innerText = 'input1';
    this.input1 = new Input(this.id, input1, '', () => this.#equals());
    ios.push(this.input1);

    const input2 = document.createElement('div');
    input2.innerText = 'input2';
    this.input2 = new Input(this.id, input2, '', () => this.#equals());
    ios.push(this.input2);

    const outTrue = document.createElement('div');
    outTrue.innerText = 'True';
    outTrue.classList.add('right');
    this.outTrue = new Output(this.id, outTrue, 'True');
    ios.push(this.outTrue);

    const outFalse = document.createElement('div');
    outFalse.innerText = 'False';
    outFalse.classList.add('right');
    this.outFalse = new Output(this.id, outFalse, 'False');
    ios.push(this.outFalse);
    
    return ios;
  }

  #equals() {
    if (this.input1.value === this.input2.value) {
      this.outTrue.update('Equal!');
      this.outFalse.update('--');
    } else {
      this.outTrue.update('--');
      this.outFalse.update('Not Equal!');
    }
  }
}

export class NodeCalc extends Node {
  constructor() {
    super();
    this.label = 'Calcurate';
    this.value = 0;
    this.inputs = [];
    this.output = null;
  }
 
  makeIOs() {
    // IO
    const ios = [];
    for (const label of ['input1', 'input2', 'input3']) {
      const body = document.createElement('div');
      body.innerText = label;
      const io = new Input(this.id, body, 0, () => this.#calcuration());
      ios.push(io);
      this.inputs.push(io);
    }

    const output = document.createElement('div');
    output.classList.add('right');
    output.innerText = 'Output';
    const io = new Output(this.id, output, 0);
    ios.push(io);
    this.output = io;
    
    return ios;
  }

  #calcuration() {
    this.value = 0;
    for (const io of this.inputs) {
      this.value += Number(io.value);
    }
    this.output.update(this.value);
  }
}