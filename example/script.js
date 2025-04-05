import IrishStout from '../src/irish-stout.js';

const stout = new IrishStout("root");

// Mouse event on Buttons.
const addButton = document.getElementById('add-node');
addButton.addEventListener('click', onClickAddNode);
function onClickAddNode() {
  const type = document.getElementById('node-type');
  stout.addNode(type.value);
}


const actionButton = document.getElementById('action');
actionButton.addEventListener('click', onClickAction);
function onClickAction() {
  stout.action();
}