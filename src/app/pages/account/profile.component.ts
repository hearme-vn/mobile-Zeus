import {Component, Injector} from '@angular/core';
import {BaseComponent} from '@app/_bases';
import {User} from '@app/_models';

@Component({
  selector: 'profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent extends BaseComponent {

  object_type = User;

  constructor(
    public injector: Injector,
  ) {
    super(injector);
  }

  /**
   * Load object  data into page
   */
  loadMainPageObjects() {
    this.object = this.object_type.newObject(this.injector, this.authenticationService.currentUser);
  }

  /**
   * Load all supportive data, such as some list displayed in form
   */
  loadSupportiveData() {
    this.getBusinessFields(null);
  }

}
