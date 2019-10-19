import { Component, Input } from '@angular/core';
import { Item } from '../common/Item';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})

export class ItemListComponent {

  settings = {
    columns: {
      id: {
        title: 'id'
      },
      name: {
        title: 'name'
      },
      displayName: {
        title: 'displayName'
      },
      itemType: {
        title: 'itemType'
      },
      availability: {
        title: 'availability'
      },
      price: {
        title: 'price'
      },
      allowPrefix: {
        title: 'allowPrefix'
      },
      weight: {
        title: 'weight'
      },
      toFill: {
        title: 'toFill'
      },
      headDef: {
        title: 'headDef'
      },
      bodyDef: {
        title: 'bodyDef'
      },
      legDef: {
        title: 'legDef'
      },
      prerequisite: {
        title: 'prerequisite'
      },
      durability: {
        title: 'durability'
      },
      weaponSpeed: {
        title: 'weaponSpeed'
      },
      speed: {
        title: 'speed'
      },
      area: {
        title: 'area'
      },
      amount: {
        title: 'amount'
      },
      damage: {
        title: 'damage'
      }
    }
  };

  @Input() items: Item[] = [];

}
