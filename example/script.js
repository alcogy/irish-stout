
// Mouse event on Buttons.
const addButton = document.getElementById('add-node');
addButton.addEventListener('click', onClickAddNode);

const stout = new IrishStout("root");

function onClickAddNode() {
  stout.addNode();
}