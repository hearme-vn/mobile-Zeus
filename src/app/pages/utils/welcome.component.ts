/**
 * @license hearme 
 * @copyright 2017-2020 https://hearme.vn 
 * @author Thuc VX <thuc@hearme.vn>
 * @date 24 Apr 2022
 * @purpose This page appears in loading time of application. Display only logo in the middle
 */
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'welcome.component.html',
  styleUrls: ['welcome.component.css']
})
export class WelcomeComponent { 

  constructor(
      private route: ActivatedRoute,
      private router: Router,
  ) { 
  }

  ngOnInit() {
  }


}
