import {Component, Injector, ViewChild} from '@angular/core';
import {TablePageComponent} from '@app/_bases';
import {Label, Thanks} from '@app/_models';
// import {APPCONSTS, Utils} from '@app/_services';

@Component({
  selector: 'thanks-list',
  templateUrl: 'thanks.component.html'
})
export class ThanksComponent extends TablePageComponent {

  @ViewChild('createObjectDialog') creating_Dialog;

  object_type = Thanks;
  selectedLang = null;
  
  THANK_TYPE_LIST = [0, 1, 3, 4];

  /** Selected language for add/edit image */
  current_lang_code = null;
  selected_lang = null;

  constructor(
    public injector: Injector,
  ) {
    super(injector);
  }

  /**
   * Change language for image
   **/
  changeLanguage(lang) {
    // console.log("Selected language: ", lang);
    this.object.data.lang_id = lang.id;
  }

}
