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
    const regexp = /^ ([a-z][a-z_0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)/gm;
    let lines = str.split(/\r?\n/);
    this.items = [];
    let count = 0;
    let item: Item;
    for (let line of lines) {
      if (regexp.test(line)) {
        if (item)
          this.items.push(item);
        item = new Item();
        let fields = line.substring(1).split(/[ ]{1,}/g);
        item.id = count++;
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
    console.log('refresh');
    this.dataSource = new LocalDataSource(this.items);
  }

  download(data: Blob, fileName: string) {
    saveAs(data, fileName);
  }

  itemsToBlob(items: Item[]): string {
    const lineBreak: string = '\n';
    let result: string =  'itemsfile version 3' + lineBreak;
    result += items.length + lineBreak;
    for (let item of items) {

    }
    return result;
  }

}