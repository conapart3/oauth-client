import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-home',
  providers: [ AppService ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor( private service: AppService ) {
  }

  ngOnInit() {
    console.log('Home component initialized');
    this.service.checkCredentials();
  }

  logout() {
    this.service.logout();
  }

}
