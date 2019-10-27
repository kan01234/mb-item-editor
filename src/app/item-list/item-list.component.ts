import { Component, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})

export class ItemListComponent {

  @Input() dataSource: LocalDataSource;

  @Input() settings: {};

}
