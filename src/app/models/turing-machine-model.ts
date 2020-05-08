export class Turing<T> {
  data: T[];
  index: number;
  isEmpty: boolean;

  constructor(data: T[] = [], index: number = 0) {
    this.data = data;
    this.index = index;
  }

  addElement(element: T): void {
    this.data = this.data.slice(0, ++this.index + 1);
    this.data.push(element);
  }

  forward(): T {
    if (this.index === this.data.length - 1) {
      return null;
    }
    return this.data[++this.index];
  }

  backward(): T {
    if (this.index <= 0) {
      return null;
    }
    return this.data[--this.index];
  }

  getCurrent(): T {
    return (this.index !== -1) ? this.data[this.index] : null;
  }

  clearMachine(): void {
    this.data = [];
    this.index = -1;
  }

}
