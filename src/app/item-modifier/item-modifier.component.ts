import { Component, ViewChild } from '@angular/core';
import { Item } from '../common/Item';
import { ItemListComponent } from '../item-list/item-list.component';
import { LocalDataSource } from 'ng2-smart-table';
import { saveAs } from 'file-saver';
import { Local } from 'protractor/built/driverProviders';
import { filter } from 'minimatch';
import { ItemTableCellComponent } from '../item-table-cell/item-table-cell.component';

const mapFields = {
  23: {
    price: 8,
    weight: 10,
    toFill: 11,
    headDef: 12,
    bodyDef: 13,
    legDef: 14,
    prerequisite: 15,
    durability: 16,
    weaponSpeed: 17,
    speed: 18,
    area: 40,
    damage: 21
  },
  25: {
    specialModelName: 6,
    itemType: 8,
    availability: 9,
    price: 10,
    weight: 12,
    toFill: 13,
    prerequisite: 17,
    weaponSpeed: 19,
    area: 21,
    damage: 23,
    damage2: 24
  },
  27: {
    specialModelName: 6,
    weight: 14,
    toFill: 15,
    amount: 24,
    damage: 25
  },
  0: {
  }
}

@Component({
  selector: 'app-item-modifier',
  templateUrl: './item-modifier.component.html',
  styleUrls: ['./item-modifier.component.css'],
})

export class ItemModifierComponent {

  items: Item[];
  itemKeys: string[];
  itemNames: {} = {};
  tableConfigs = [];
  tableConfigOrders: string[];

  itemDataContent: string = '';
  itemDataFileName: string = 'item_kinds1.txt';
  itemDataBtnText: string = 'export item data';

  itemNameContent: string = '';
  itemNameFileName: string = 'item_kind.csv';
  itemNameBtnText: string = 'export item name';

  activeColumnName: number = -1;
  activeClassName = 'active';

  style;

  constructor() {
    this.tableConfigOrders = [ '23', '25', '27', '0' ];
    this.tableConfigOrders.forEach((value, index) => {
      let tableConfig = {}
      tableConfig['id'] = `${value}-tabcontent`;
      let count = 2;
      let settings = {
        hideSubHeader: true,
        actions: {
          delete: false,
        },
        pager: {
          display: true,
          perPage: 100
        },
        columns: {
          id: {
            title: 'id',
            filter: true,
            editable: false,
          },
          name: {
            title: 'name',
            editable: false,
          },
          mappedName: {
            title: 'mappedName',
          },
        },
      };
      
      for (let field of Object.keys(mapFields[value])) {
        settings.columns[field] = {
          title: field,
        }
      }
      for (let key in settings.columns) {
        let column = settings.columns[key];
        column.type = 'custom';
        column.renderComponent = ItemTableCellComponent;
        column.onComponentInitFunction = (instance: any) => {
          instance.mouseover.subscribe(this.handleCellMouseover);
        };
        column.valuePrepareFunction = (value) => {
          return {
            value: value,
            name: key
          }
        };
      }
      tableConfig['settings'] = settings;
      this.tableConfigs.push(tableConfig)
    });
  }

  handleCellMouseover = (event) => {
    // TODO add active class?
    this.activeColumnName = event.target.dataset.columnName;
    if (this.style)
      document.head.removeChild(this.style);
    document.querySelectorAll(`.tabcontent.active tr td [data-column-name="${this.activeColumnName}"]`).forEach((value) => {
      value.classList.add(this.activeClassName);
    });
  }

  itemDatafrCompolete(str: string) {
    const regexp = /^ ([a-z][a-z_0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*[0-9]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)/gm;
    let lines = str.split(/\r?\n/);
    this.items = [];
    let count = 0;
    let item: Item;
    let fileCount: number = parseInt(lines[1]);
    this.itemKeys = [];
    for (let line of lines) {
      if (regexp.test(line)) {
        this.addItem(item);
        item = this.buildItem(line, count++);
      } else {
        if (!item)
          continue;
        item.additionalLines += line + '\n';
      }
    }
    this.addItem(item);
    if (fileCount != count) {
      // TODO throw error to UI?
      console.error(`file count not match, file count: ${fileCount}, read count: ${count}`);
    }
    this.mapItems();
  }

  addItem(item: Item) {
    if (!item)
      return;
    this.items.push(item);
  }

  buildItem(line: string, id: number): Item {
    let item = new Item();
    let fields = line.substring(1).split(/[ ]{1,}/g);
    let key = fields.length;
    item.id = id;
    item.name = fields[0];
    item.originalFields = fields;
    if (key in mapFields) {
      let map = mapFields[key];
      for (let k in map)
        item[k] = fields[map[k]];
    }
    return item;
  }

  itemNamefrCompolete(str: string) {
    let lines: string[] = str.split('\r\n');
    this.itemNames = {};
    for (let line of lines) {
      let names = line.split("|");
      this.itemNames[names[0]] = names[1];
    }
    this.mapItems();
  }

  mapItems() {
    if (!this.items || this.items.length <= 0)
      return;
    let handledFieldLengths = this.tableConfigOrders.slice(0, this.tableConfigOrders.length - 1);
    let len = handledFieldLengths.length;
    let filterItems = [];
    for (let i = 0; i < len + 1; i++)
      filterItems.push([]);
    for (let item of this.items) {
      item.mappedName = this.itemNames[item.name];
      let indexOf = handledFieldLengths.indexOf(item.originalFields.length + '');
      if (indexOf < 0)
        filterItems[len].push(item);
      else
        filterItems[indexOf].push(item);
    }
    filterItems.forEach((value, index) => {
      this.tableConfigs[index]['dataSource'] = value;
    });
    let ele = document.getElementsByClassName('tablinks')[0] as HTMLElement;
    ele.click();
  }

  originalFieldsLenEqualsTo(ele, index, array) {
      
  }

  downloadItems() {
    this.download(new Blob([ this.itemsString(this.items) ], { type: 'text/plain;charset=utf-8' }), this.itemDataFileName);
  }

  downloadItemNames() {
    // TODO
  }

  download(data: Blob, fileName: string) {
    saveAs(data, fileName);
  }

  itemsString(items: Item[]): string {
    const lineBreak: string = '\n';
    let result: string =  'itemsfile version 3' + lineBreak;
    result += items.length + lineBreak;
    let handledFieldLengths = this.tableConfigOrders.slice(0, this.tableConfigOrders.length - 1);
    let len = handledFieldLengths.length;
    for (let item of items) {
      if (len in mapFields)
        for (let key in mapFields[len])
          item.originalFields[mapFields[len][key]] = item[key];
      result += ' ' + item.originalFields.join(' ') + lineBreak + item.additionalLines;
    }
    return result;
  }

  openTab(event, targetId: string) {
    var i, tabcontent, tablinks;
    const activeCLassName = 'active';

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(targetId).classList.add(activeCLassName);
    event.currentTarget.classList.add(activeCLassName);
  }

}