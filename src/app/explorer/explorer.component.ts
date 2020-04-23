import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DatabaseWorkerService} from '../../Services/database-worker.service';
import {FileExplorer} from '../../Models/ExplorerModel';
import {FileNode} from '../../Models/BTree';
import {createUrlResolverWithoutPackagePrefix} from '@angular/compiler';
import {fromEvent, Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css']
})
export class ExplorerComponent implements OnInit, AfterViewInit {

  public explorerModel: FileExplorer;
  @ViewChild('searchbar') searchbar: ElementRef;

  constructor(private dbWorker: DatabaseWorkerService) {
  }


  navigateTo(index: number) {
    for (let i = 0; i < this.explorerModel.currentLocation.data.path.length - index - 1; ++i) {
      this.explorerModel.navigateToUp();
    }
  }


  NameComporator(a: FileNode, b: FileNode) {
    return a.name.localeCompare(b.name);
  }

  DateComporator(a: FileNode, b: FileNode) {
    if (a.data.modificationDate.getTime() < b.data.modificationDate.getTime()) {
      return -1;
    } else if (a.data.modificationDate.getTime() > b.data.modificationDate.getTime()) {
      return 1;
    } else {
      return 0;
    }
  }

  sizeComparator(a: FileNode, b: FileNode) {
    if (!b.data.size) {
      return -1;
    }
    if (a.data.size < b.data.size) {
      return -1;
    } else if (a.data.size > b.data.size) {
      return 1;
    } else {
      return 0;
    }
  }

  ngAfterViewInit(): void {
    this.explorerModel.$searchBar = fromEvent<Event>(this.searchbar.nativeElement, 'keypress');
    this.explorerModel.$searchBar.pipe(
      debounceTime(500)
    ).subscribe((event) => {
      if (this.explorerModel.searchabarTest.length) {
        this.explorerModel.searchResult.length = 0;
        this.explorerModel.searchFileFrom(this.explorerModel.searchabarTest, this.explorerModel.currentLocation);
        this.explorerModel.searchResShow = true;
      }
    });
  }

  ngOnInit(): void {
    this.explorerModel = new FileExplorer([]);


    this.dbWorker.getFiles().then((result) => {

      const resultData = result.val();

      resultData.sort((a: any, b: any) => {
        return a.path.localeCompare(b.path);
      });

      resultData.map((file) => {
        file.path = ('root/' + file.path).split('/');
        file.modificationDate = new Date(file.modificationDate);
      });

      this.explorerModel.resetDataStruct(resultData);
      this.explorerModel.loading = false;

    }).catch(() => {
      alert('Something went wrong with server!');
    });


  }

}
