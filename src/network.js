export default class Network {
  constructor() {
    // 2 demention array.
    // a set as a data flow end to end.
    this.topology = [];
  }

  // from and to is Node object.
  add(from, to) {
    if (this.topology.length === 0) {
      this.topology.push([from, to]);
      return;
    }
    for (let i = 0; i < this.topology.length; i++) {
      for (let j = 0; j < this.topology[i].length; j++) {
        if (to.id === this.topology[i][j]?.id) {
          this.topology[i] = [from, ...this.topology[i]];
          return;
        }
        if (to.id === this.topology[i][j + 1]?.id) {
          this.topology[i] = [...this.topology[i], to];
          return;
        }
      }
    }
    this.topology.push([from, to]);
  }

  cut(from, to) {
    for (let i = 0; i < this.topology.length; i++) {
      for (let j = 0; j < this.topology[i].length; j++) {
        if (from.id === this.topology[i][j]?.id && to.id === this.topology[i][j + 1]?.id) {
          // remove the topology.
          if (this.topology[i].length <= 2) {
            this.topology.splice(i, 1);
            return;
          }
          
          // split topology
          const flow = [...this.topology[i]];

          if (j > 0) {
            this.topology[i] = flow.slice(0, j);
          }
          
          if (this.topology[i].length >= j + 2) {
            if (j === 0) {
              this.topology[i] = flow.slice(j + 1);
            } else {
              this.topology.push(flow.slice(j + 1));
            }
          }

          return;
        }
      }  
    }
  }
}