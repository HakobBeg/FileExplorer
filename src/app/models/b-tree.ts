import {File} from './file-model';
import {error} from '@angular/compiler/src/util';
import {FileNode} from './file-node-model';

export class BTree {
  root: FileNode;


  constructor(files: File[]) {

    this.root = new FileNode({path: ['root'], size: 0, type: 'folder', modificationDate: null}, null);

    files.forEach((file) => {

      let addTo;

      if (file.path.length === 2) {
        addTo = this.root;
      } else {


        addTo = this.search(file.path.slice(0, file.path.length - 1));

      }

      if (addTo) {
        this.addNewFile(file, addTo);
      } else {
        this.recursiveAdd(file.path.slice(0, file.path.length - 1), '', file.modificationDate);
        addTo = this.search(file.path.slice(0, file.path.length - 1));
        this.addNewFile(file, addTo);
      }
    });

  }

  recursiveAdd(path: string[], addAble: string = '', mdf: Date) : void {

    if (!this.search(path)) {
      this.recursiveAdd(path.slice(0, path.length - 1), path[path.length - 1], mdf);
    }

    if (addAble === '') {
      return;
    }

    const tmp = path;
    tmp.push(addAble);
    const newFile = {
      type: 'folder',
      path: tmp,
      modificationDate: mdf
    };


    this.addNewFile(newFile, this.search(path.slice(0, path.length - 1)));
  }



  addNewFile(newFile: File, to: FileNode): void {


    if (to.children.has(newFile.path[newFile.path.length - 1])) {
      throw error('File in this name already exist');
    } else {

      const newNode = new FileNode(newFile, to);


      to.children.set(newNode.name, newNode);


    }
  }

  search(path: string[], currentPosPath: string[] = ['root'], currentPosNode: FileNode = this.root, level = 1) : FileNode {

    if (path.length === currentPosPath.length) {
      for (let index = 0; index < path.length; ++index) {
        if (path[index].localeCompare(currentPosPath[index])) {
          return null;
        }
      }
      return currentPosNode;
    }

    const current = this.getFromNodeChildren(currentPosNode, path[level]);
    if (current) {
      return this.search(path, path.slice(0, level + 1), current, ++level);
    } else {

      return null;
    }
  }

  getFromNodeChildren(node: FileNode, key: string): FileNode | undefined {
    return node.children.get(key);
  }

}



