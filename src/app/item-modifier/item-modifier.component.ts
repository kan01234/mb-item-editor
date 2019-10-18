import { Component } from '@angular/core';
import { Item } from '../common/Item';

@Component({
  selector: 'app-item-modifier',
  templateUrl: './item-modifier.component.html',
  styleUrls: ['./item-modifier.component.css'],
})

export class ItemModifierComponent {

  items: Item[];
  itemFields: string[] = [
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

  frCompolete(str: string) {
    let lines = str.match(/^ ([a-z][a-z_0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)[ ]*([A-Z_a-z0-9\.]*)/gm);
    let items: Item[] = [];
    let count = 0;
    for (let line of lines) {
        let fields = line.substring(1).split(/[ ]{1,}/g);
        let item: Item = new Item();
        item.id = count++;
        for (let i in this.itemFields)
            item[this.itemFields[i]] = fields[i];
        items.push(item);
    }
    this.items = items;
  }

}