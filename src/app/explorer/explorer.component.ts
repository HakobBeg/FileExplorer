import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DatabaseWorkerService} from '../services/database-worker.service';
import {FileExplorer} from '../models/explorer-model';
import {FileNode} from '../models/file-node-model';
import {fromEvent, merge} from 'rxjs';
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


  navigateTo(index: number): void {
    this.explorerModel.changecurrentLocation(this.explorerModel.currentLocation.data.path.slice(0, index + 1));
  }


  NameComporator(a: FileNode, b: FileNode): number {
    return a.name.localeCompare(b.name);
  }

  DateComporator(a: FileNode, b: FileNode): number {
    if (a.data.modificationDate.getTime() < b.data.modificationDate.getTime()) {
      return -1;
    } else if (a.data.modificationDate.getTime() > b.data.modificationDate.getTime()) {
      return 1;
    } else {
      return 0;
    }
  }

  sizeComparator(a: FileNode, b: FileNode): number {
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
    this.explorerModel.searchBar$ = merge(fromEvent<Event>(this.searchbar.nativeElement, 'keypress'), fromEvent<Event>(this.searchbar.nativeElement, 'focus'));
    this.explorerModel.searchBar$.pipe(
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
