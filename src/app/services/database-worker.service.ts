import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class DatabaseWorkerService {

  constructor(private db: AngularFireDatabase) {
  }

  getFiles(): Promise<any> {

    return this.db.database.ref('filesData').once('value');
  }

}
