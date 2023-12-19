import {Component, EventEmitter, forwardRef, Injector, Input, Output} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ListUI } from '../list_ui.component';
import { Device } from '@app/_models';

@Component({
  selector: 'device-select',
  templateUrl: 'device_select.component.html',
  // styleUrls: ['survey_select.component.css']
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DeviceSelectComponent),
    multi: true
  }]  
})
export class DeviceSelectComponent extends ListUI implements ControlValueAccessor {

  @Input('pre_objects') pre_objects: [];
  @Input('form_data') form_data: any;       // data used for filtering object list - used by get list API

  // emit event of changing survey, and transfer survey object
  @Output('change') change = new EventEmitter();

  /** For loading surveys */
  object_type = Device;


  
  constructor (public injector: Injector) {
    super(injector);
  }



}
