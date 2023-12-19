import {Component, EventEmitter, forwardRef, Injector, Input, Output} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseComponent } from '@app/_bases';

@Component({
  selector: 'devicelanguage-select',
  templateUrl: 'devicelanguage_select.component.html',
  // styleUrls: ['survey_select.component.css']
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DeviceLanguageSelectComponent),
    multi: true
  }]  
})
export class DeviceLanguageSelectComponent extends BaseComponent implements ControlValueAccessor {
  /**
   * array of main objects for this page
  */
  @Input('langs') langs: [any];

  // emit event of changing survey, and transfer survey object
  @Output('change') change = new EventEmitter();

  selcetedLanguage = null;
  isDisabled = false;

  private _onChange = (_: any) => { };
  private _onTouched = () => { };

  constructor (public injector: Injector) {
    super(injector);
  }

  public get ngModel(): number { return this.selcetedLanguage.id }
  public set ngModel(v: number) {
    if (!this.device_langs || !this.device_langs.length)  return;

    if ((!this.selcetedLanguage) || (v !== this.selcetedLanguage.id)) {
      for (let lang of this.device_langs) {
        if (lang.id==v)  this.selcetedLanguage = lang;
      }
      this._onChange(v);
    }
  }  

  writeValue(value: number): void {    
    this.ngModel = value;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  /**
   * Load object  data into page
  */
  loadMainPageObjects() {
    this.getDeviceLanguages(function(device_default_language, device_langs) {
        // console.log("Languages: ", this.device_langs);
        if (!this.selcetedLanguage)  this.selcetedLanguage = device_default_language;
        this.change.emit(this.selcetedLanguage);
      }.bind(this)
    );
  }

  /**
   * hanlde event on change survey selection
  */
  changeSelectedObject($event) {
    // console.log("Input - Change selected survey model: ", this.selcetedLanguage);
    // console.log("Input - selected survey event: ", $event);
    this.change.emit(this.selcetedLanguage);
  }

}
