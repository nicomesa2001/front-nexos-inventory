import { Component, OnInit } from '@angular/core';
declare let alertify: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Nexos Inventory';

  ngOnInit() {
    alertify.set('notifier', 'position', 'top-right');
  }
}
