import {Component, Injector, ViewChild} from '@angular/core';
import {TablePageComponent} from '@app/_bases';
import {Collection} from '@app/_models/collection.model';

/**
 * @license hearme
 * @copyright 2017-2022 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 02 Nov 2022
 * @purpose for managing collections
 */
@Component({
  templateUrl: 'collection.component.html'
})
export class CollectionComponent extends TablePageComponent {
  @ViewChild('createObjectDialog') creating_Dialog;

  object_type = Collection;

  constructor(
    public injector: Injector,
    ) {
    super(injector);
  }

  openImagePage(id) {
    const uri = '/collection/images?id=' + id;
    this.router.navigateByUrl(uri);
  }
}
