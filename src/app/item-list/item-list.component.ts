import { Component, Input } from '@angular/core';
import { Item } from '../common/Item';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})

export class ItemListComponent {

  settings = {
    pager: {
      display: true,
      perPage: 100
    },
    columns: {
      id: {
        title: 'id'
      },
      name: {
        title: 'name'
      },
      mappedName: {
        title: 'mappedName'
      },
      displayName: {
        title: 'displayName'
      },
      modelGroupName: {
        title: 'modelGroupName'
      },
      numOfModel: {
        title: 'numOfModel'
      },
      modelName: {
        title: 'modelName'
      },
      specialModelName: {
        title: 'specialModelName'
      },
      specialModelRules: {
        title: 'specialModelRules'
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

  @Input() dataSource: LocalDataSource;

}
