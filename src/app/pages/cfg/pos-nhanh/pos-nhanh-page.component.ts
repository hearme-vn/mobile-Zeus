import {Component, Injector, ViewChild} from '@angular/core';
import {BaseComponent} from '@app/_bases';

/**
 * @license hearme
 * @copyright 2017-2022 https://hearme.vn
 * @author Thuc VX <thuc@hearme.vn>
 * @date 12 Sep 2022
 * @purpose for config pos nhanh page
 */
@Component({
  templateUrl: 'pos-nhanh-page.component.html'
})
export class PosNhanhPageComponent extends BaseComponent {
  @ViewChild('cfgPosNhanh') cfgPosNhanh;

  constructor(
    public injector: Injector,
    ) {
    super(injector);
  }

  /** Save configs */
  proccess() {
    this.cfgPosNhanh.saveConfig();
  }
}
