import {File} from './file-model';

export class FileNode {

  name: string;
  parentNode: FileNode;
  data: File;
  children = new Map<string, FileNode>();
  selected: boolean;


  constructor(fileData: File, parent: FileNode) {

    this.data = fileData;
    this.parentNode = parent;
    this.name = this.data.path[this.data.path.length - 1];
    this.selected = false;
  }


}
