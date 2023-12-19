import { Injectable } from '@angular/core';
import { TreeviewSelection, TreeviewItem, DefaultTreeviewI18n } from '@ngx-treeview';
import { TranslateService } from '@ngx-translate/core';
@Injectable()
export class DropdownTreeviewSelectI18n extends DefaultTreeviewI18n {
  constructor( public translate: TranslateService) {
    super();
  }

  private internalSelectedItem: TreeviewItem;

  set selectedItem(value: TreeviewItem) {
    this.internalSelectedItem = value;
  }

  get selectedItem(): TreeviewItem {
    return this.internalSelectedItem;
  }

  getText(selection: TreeviewSelection): string {
    return this.internalSelectedItem ? this.internalSelectedItem.text : this.translate.instant('APP.SELECT');
  }
}
