![screen](/readme/screen.png)
Linkflow is a open source libraries for building node-based UI application. Imspired by VFX/3D Graphic Application. (e.g. SideFX Houdini, Maxon Cinema4D)

![GitHub License MIT](https://img.shields.io/github/license/wbkd/react-flow?color=%23ff0072)

## Getting started
1. Build the library.
  ```
  npm run build
  ```
2. read expoted javascript file from dist directory to your script.

3. To instance Linkflow class with root dom.
```
const linkflow = new Linkflow("root");
```

4. Add Node instance to linkflow's "addNode" method.
```
// NodeTextBox is build in node.
// You can customize your own node.
linkflow.addNode(new NodeTextBox());
```

5. Connect node by drag and drop on node's circle.


## Example
By **/example** directory, we implemented simple node style UI application.

