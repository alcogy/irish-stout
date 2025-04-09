import {
  IrishStout,
  NodeTextBox,
  NodeDisplay,
  NodeNumberBox,
  NodeCondition,
  NodeCalc
} from '../dist/index.mjs';

const stout = new IrishStout("root");

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
    case 'calc':
      return new NodeCalc();
  }
}


const updateLabel = document.getElementById('update-label');
updateLabel.addEventListener('click', onClickUpdateLabel);
function onClickUpdateLabel() {
  // const label = document.getElementById('labeler');
  const props = stout.getSelectedNodeProps();
  console.log(props);
}