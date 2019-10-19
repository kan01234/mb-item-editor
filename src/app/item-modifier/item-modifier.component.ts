import { Component, ViewChild } from '@angular/core';
import { Item } from '../common/Item';
import { ItemListComponent } from '../item-list/item-list.component';
import { LocalDataSource } from 'ng2-smart-table';

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

  itemDatafrCompolete(str: string) {
    let lines = str.match(/^ ([a-z][a-z_0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)/gm);
    let items: Item[] = [];
    let count = 0;
    for (let line of lines) {
        let fields = line.substring(1).split(/[ ]{1,}/g);
        let item: Item = new Item();
        item.id = count++;
        for (let i in itemFields)
            item[itemFields[i]] = fields[i];
        items.push(item);
    }
    this.items = items;
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

}