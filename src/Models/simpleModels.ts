export class Turing<T> {
  data: T[];
  index: number;
  isEmpty: boolean;

  constructor(data: T[] = [], index: number = 0) {
    this.data = data;
    this.index = index;
  }

  addElement(element: T) {
    this.data = this.data.slice(0, ++this.index + 1);
    this.data.push(element);
  }

  forward() {
    if (this.index === this.data.length - 1) {
      return null;
    }
    return this.data[++this.index];
  }

  backward() {
    if (this.index <= 0) {
      return null;
    }
    return this.data[--this.index];
  }

  getCurrent() {
    return (this.index !== -1) ? this.data[this.index] : null;
  }

  clearMachine() {
    this.data = [];
    this.index = -1;
  }

}
