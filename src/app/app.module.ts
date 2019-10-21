import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { ItemModifierComponent } from './item-modifier/item-modifier.component';
import { ItemListComponent } from './item-list/item-list.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

// import { ProductListComponent } from './product-list/product-list.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    RouterModule.forRoot([
      { path: '', component: ItemModifierComponent }
    ])
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    UploadFileComponent,
    ItemModifierComponent,
    ItemListComponent,
        // ProductListComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/