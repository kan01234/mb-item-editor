import { Component, ViewChild } from '@angular/core';
import { Item } from '../common/Item';
import { ItemListComponent } from '../item-list/item-list.component';
import { LocalDataSource } from 'ng2-smart-table';
import { saveAs } from 'file-saver';
import { Local } from 'protractor/built/driverProviders';

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

  items: {};
  itemKeys: string[];
  itemNames: {} = {};
  tableConfigs;
  tableConfigOrders: string[];

  itemDataContent: string = '';
  itemDataFileName: string = 'item_kinds1.txt';
  itemDataBtnText: string = 'export item data';

  itemNameContent: string = '';
  itemNameFileName: string = 'item_kind.csv';
  itemNameBtnText: string = 'export item name';

  constructor() {
    this.tableConfigOrders = [ '23', '25', '27', '0' ];
    this.tableConfigs = [ {}, {}, {}, {} ];
    
  }

  itemDatafrCompolete(str: string) {
    const regexp = /^ ([a-z][a-z_0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*[0-9]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)/gm;
    let lines = str.split(/\r?\n/);
    this.items = this.initItemsMap();
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
    console.log(this.items);
    if (fileCount != count) {
      // TODO throw error to UI?
      console.error(`file count not match, file count: ${fileCount}, read count: ${count}`);
    }
    this.mapItems();
  }

  addItem(item: Item) {
    if (!item)
      return;
    let len = item.originalFields.length;
    let k = (len in mapFields ? len : 0) + '';
    this.items[k].push(item);
    this.itemKeys.push(item.name);
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
    // if (this.items.length <= 0 || Object.entries(this.itemNames).length <= 0)
    //   return;
    // for(let item of this.items)
    //   item.mappedName = this.itemNames[item.name];
    // this.dataSource = new LocalDataSource(this.items);
    // this.dataSources = {};
    for (let k in this.tableConfigOrders)
      this.tableConfigs[k]['dataSource'] = new LocalDataSource(this.items[this.tableConfigOrders[k]]);
  }

  downloadItems() {
    // this.download(new Blob([ this.itemsString(this.items) ], { type: 'text/plain;charset=utf-8' }), this.itemDataFileName);
  }

  downloadItemNames() {
    // TODO
  }

  download(data: Blob, fileName: string) {
    saveAs(data, fileName);
  }

  itemsString(items: Item[]): string {
    // const lineBreak: string = '\n';
    // let result: string =  'itemsfile version 3' + lineBreak;
    // result += items.length + lineBreak;
    // for (let item of items) {
    //   let itemStrs = [];
    //   for (let field of itemFields)
    //     itemStrs.push(item[field]);
    //   result += itemStrs.join(' ') + lineBreak;
    //   result += item.additionalLines;
    // }
    // return result;
    return '';
  }

  initItemsMap(): {} {
    let items = {};
    for (let k in mapFields)
      items[k] = [];
    return items;
  }

}