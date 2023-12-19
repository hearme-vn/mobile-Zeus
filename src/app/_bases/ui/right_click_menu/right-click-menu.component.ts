import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'right-click-menu',
  templateUrl: './right-click-menu.component.html',
  styleUrls: ['./right-click-menu.component.css']
})
export class RightClickMenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  @Input() x=0;
  @Input() y=0;
  @Input() items: any;
  @Output('eventClick') eventClick = new EventEmitter<string>();

  returnEmit(itemId) {
    this.eventClick.emit(itemId);
  }
}
