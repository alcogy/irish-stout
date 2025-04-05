import IrishStout from '../src/irish-stout.js';
import { NodeTextBox, NodeDisplay, NodeCondition, NodeNumberBox } from '../src/buildin-nodes.js';

const stout = new IrishStout("root");

stout.addNode(new NodeTextBox());
stout.addNode(new NodeDisplay());

// Mouse event on Buttons.
const addButton = document.getElementById('add-node');
addButton.addEventListener('click', onClickAddNode);
function onClickAddNode() {
  const type = document.getElementById('node-type');
  stout.addNode(selectNode(type.value));
}

function selectNode(type) {
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

