import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-item-table-cell',
  templateUrl: './item-table-cell.component.html',
  styleUrls: ['./item-table-cell.component.css'],
})

export class ItemTableCellComponent implements ViewCell, OnInit {

    renderValue: string;
    name;

    @Input() value: string | number;
    @Input() rowData: any;

    @Output() mouseover: EventEmitter<any> = new EventEmitter();
  
    ngOnInit() {
      let value = this.value['value'];
      this.renderValue = (value == undefined || value == '') ? '&nbsp;' : value;
      this.name = this.value['name'];
    }

}
