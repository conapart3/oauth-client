import { Component } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  providers: [AppService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public loginData = {username: '', password: ''};

  constructor(private service: AppService) { }

  login() {
    console.log('Login user: ' + this.loginData.username);
    this.service.obtainAccessToken(this.loginData);
  }

}
