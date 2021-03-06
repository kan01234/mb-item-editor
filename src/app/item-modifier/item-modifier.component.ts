import { Component, ViewChild } from '@angular/core';
import { Item } from '../common/Item';
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
        edit: {
          confirmSave: true,
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
          instance.mouseout.subscribe(this.handleCellMouseout);
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
    this.activeColumnName = event.target.dataset.columnName;
    document.querySelectorAll(`.tabcontent.active tr td [data-column-name="${this.activeColumnName}"]`).forEach((value) => {
      value.classList.add(this.activeClassName);
    });
  }

  handleCellMouseout = (event) => {
    this.activeColumnName = event.target.dataset.columnName;
    document.querySelectorAll(`.tabcontent.active tr td [data-column-name="${this.activeColumnName}"]`).forEach((value) => {
      value.classList.remove(this.activeClassName);
    });
  }

  handleEditConfirm = (event) => {
    let newItem = event.newData;
    let len = newItem.originalFields.length;
    let map = mapFields[len];
    for (let key in map)
      newItem.originalFields[map[key]] = newItem[key];
    // TODO split for chinese?
    this.items[newItem.id] = newItem;
    event.confirm.resolve();
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

  downloadItems() {
    this.download(new Blob([ this.buildItemsString(this.items) ], { type: 'text/plain;charset=utf-8' }), this.itemDataFileName);
  }

  downloadItemNames() {
    const lineBreak: string = '\n';
    let result: string = '' + lineBreak;
    this.items.forEach(item => {
      if (item.mappedName == undefined)
        return;
      result += `${item.name}|${item.mappedName}${lineBreak}`;
    });
    this.download(new Blob ([ result ], { type: 'text/plain; charset=utf-8' }), this.itemNameFileName);
  }

  download(data: Blob, fileName: string) {
    saveAs(data, fileName);
  }

  buildItemsString(items: Item[]): string {
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
    // remove all active class
    document.querySelectorAll('.tablinks').forEach((value) => {
      value.classList.remove(this.activeClassName);
    });

    document.querySelectorAll('.tabcontent').forEach((value) => {
      value.classList.remove(this.activeClassName);
    });

    // add active class
    document.getElementById(targetId).classList.add(this.activeClassName);
    event.currentTarget.classList.add(this.activeClassName);
  }

}