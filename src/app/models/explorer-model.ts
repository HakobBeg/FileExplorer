import {BTree} from './b-tree';
import {Turing} from './turing-machine-model';
import {File} from './file-model';
import {Observable} from 'rxjs';
import {FileNode} from './file-node-model';


export class FileExplorer {

  data: File[];
  dataStruct: BTree;
  currentPath: string[];
  currentLocation: FileNode;
  tableState: FileNode[];
  displayTableColumns = ['name', 'date', 'type', 'size'];
  locationMemory: Turing<FileNode>;
  arrowSates = {left: false, right: false, up: false};
  searchabarTest = '';
  searchResShow = false;
  searchBar$: Observable<Event>;
  searchResult: FileNode[] = [];
  loading = true;


  constructor(initialData: File[]) {
    this.resetDataStruct(initialData);

  }

  moveIn(): void {
    this.currentLocation.children.forEach((file) => {
      if (file.selected) {
        file.selected = false;
        this.changecurrentLocation(file.data.path);
        return;
      }
    });
  }

  searchFileFrom(name: string, location: FileNode): void {

    if (location.children.size === 0) {
      return;
    }

    for (const key of location.children.keys()) {
      if (key.startsWith(name)) {
        this.searchResult.push(location.children.get(key));
      }
    }


    for (const value of location.children.values()) {
      this.searchFileFrom(name, value);
    }

  }

  unselect(): void {
    for (const value of this.currentLocation.children.values()) {
      value.selected = false;
    }
  }

  stepDownSelected(): void {

    let flag = false;
    const arr = Array.from(this.currentLocation.children);
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i][1].selected) {
        if (arr[i + 1]) {
          arr[i][1].selected = false;
          arr[i + 1][1].selected = true;
        }
        flag = true;
        break;
      }
    }

    if (!flag) {
      arr[0][1].selected = true;
    }
  }

  stepUpSelected(): void {
    const arr = Array.from(this.currentLocation.children);
    if (arr[0][1].selected) {
      return;
    }

    for (let i = 0; i < arr.length; ++i) {
      if (arr[i][1].selected) {
        arr[i][1].selected = false;
        arr[i - 1][1].selected = true;
        break;
      }
    }

  }


  stepBack(): void {
    this.currentLocation = this.locationMemory.backward();
    this.currentPath = this.currentLocation.data.path;
    this.updateArrowStates();
    this.updateTable();
  }

  stepForward(): void {

    this.currentLocation = this.locationMemory.forward();
    this.currentPath = this.currentLocation.data.path;
    this.updateArrowStates();
    this.updateTable();
  }


  resetDataStruct(data: File[]): void {
    this.data = data;
    this.dataStruct = new BTree(this.data);
    this.currentPath = ['root'];
    this.currentLocation = this.dataStruct.root;
    this.tableState = Array.from(this.currentLocation.children.values());
    this.locationMemory = new Turing<FileNode>([this.dataStruct.root], 0);
    this.updateArrowStates();
  }

  updateTable(): void {
    this.tableState = Array.from(this.currentLocation.children.values());
    this.updateArrowStates();
  }

  updateArrowStates(): void {
    this.arrowSates.up = (this.currentLocation.parentNode !== null);
    this.arrowSates.left = (this.locationMemory.index > 0);
    this.arrowSates.right = (this.locationMemory.index < this.locationMemory.data.length - 1);
  }

  changecurrentLocation(path: string[]): void {
    this.currentLocation = this.dataStruct.search(path);
    this.currentPath = path;
    this.locationMemory.addElement(this.currentLocation);
    this.updateTable();
  }

  changeCurrentLocation(newLocation: FileNode): void {
    this.currentLocation = newLocation;
    this.currentPath = newLocation.data.path;
    this.updateArrowStates();
    this.updateTable();
  }

  navigateToUp(): void {
    if (this.currentLocation.parentNode) {
      this.currentPath = this.currentLocation.parentNode.data.path;
      this.currentLocation = this.currentLocation.parentNode;
      this.locationMemory.addElement(this.currentLocation);
      this.updateTable();

    }
  }

  sortTableStateBy(comp: any): void {
    this.tableState = Array.from(this.currentLocation.children.values()).sort(comp);
  }


}
