import { Component, ViewChild } from '@angular/core';
import { Item } from '../common/Item';
import { ItemListComponent } from '../item-list/item-list.component';
import { LocalDataSource } from 'ng2-smart-table';
import { saveAs } from 'file-saver';

const itemFields: string[] = [
  'name',
  'displayName',
  'modelGroupName',
  'numOfModel',
  'modelName',
  'specialModelName',
  'specialModelRules',
  'itemType',
  'availability',
  'price',
  'allowPrefix',
  'weight',
  'toFill',
  'headDef',
  'bodyDef',
  'legDef',
  'prerequisite',
  'durability',
  'weaponSpeed',
  'speed',
  'area',
  'amount',
  'damage'
];

@Component({
  selector: 'app-item-modifier',
  templateUrl: './item-modifier.component.html',
  styleUrls: ['./item-modifier.component.css'],
})

export class ItemModifierComponent {

  items: Item[] = [];
  itemNames: {} = {};
  dataSource: LocalDataSource;

  itemDataContent: string = '';
  itemDataFileName: string = 'item_kinds1.txt';
  itemDataBtnText: string = 'export item data';

  itemNameContent: string = '';
  itemNameFileName: string = 'item_kind.csv';
  itemNameBtnText: string = 'export item name';

  itemDatafrCompolete(str: string) {
    const regexp = /^ ([a-z][a-z_0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*[0-9]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)/gm;
    let lines = str.split(/\r?\n/);
    this.items = [];
    let count = 0;
    let item: Item;
    let debug = {
      23: 0,
      25: 0,
      27: 0,
      29: 0,
    };
    for (let line of lines) {
      if (regexp.test(line)) {
        if (item)
          this.items.push(item);
        item = new Item();
        console.log(line);
        let fields = line.substring(1).split(/[ ]{1,}/g);
        debug[fields.length] += 1;
        item.id = count++;
        console.log(fields);
        for (let i in itemFields)
          item[itemFields[i]] = fields[i];
      } else {
        if (!item)
          continue;
        item.additionalLines += line + '\n';
      }
    }
    if (item)
      this.items.push(item);
    console.log(debug);
    this.mapItems();
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
    if (this.items.length <= 0 || Object.entries(this.itemNames).length <= 0)
      return;
    for(let item of this.items)
      item.mappedName = this.itemNames[item.name];
    this.dataSource = new LocalDataSource(this.items);
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
    for (let item of items) {
      let itemStrs = [];
      for (let field of itemFields)
        itemStrs.push(item[field]);
      result += itemStrs.join(' ') + lineBreak;
      result += item.additionalLines;
    }
    return result;
  }

}