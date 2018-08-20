import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Breadcrumb } from './breadcrumb';

@Component({
  selector: 'rv-breadcrumb-nav',
  templateUrl: './breadcrumb-nav.component.html',
  styleUrls: ['./breadcrumb-nav.component.scss']
})
export class BreadcrumbNavComponent {
  private _items: Breadcrumb[] = [];

  constructor(public router: Router) {
  }

  get items(): Breadcrumb[] {
    return this._items;
  }

  @Input() set items(value: Breadcrumb[]) {
    if (this._items != value) {
      this._items = value;
    }
  }
}
