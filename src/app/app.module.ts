import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ExplorerComponent} from './explorer/explorer.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {MatTableModule} from '@angular/material/table';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    ExplorerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTableModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    DragDropModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
