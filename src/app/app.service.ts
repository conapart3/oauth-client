// contains logic for server interactions
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export class Foo {
  constructor(
    public id: number,
    public name: string) {
  }
}

/*
Conal Says:

Note that:

To get an Access Token we send a POST to the “/oauth/token” endpoint
We’re using the client credentials and Basic Auth to hit this endpoint
We’re then sending the user credentials along with the client id and grant type parameters URL encoded
After we obtain the Access Token – we store it in a cookie.

The cookie storage is especially important here, because we’re only using the cookie for storage purposes
and not to drive the authentication process directly. This helps protect against cross-site request forgery
(CSRF) type of attacks and vulnerabilities.
 */

@Injectable()
export class AppService {
  constructor(
    private router: Router, private httpClient: HttpClient ) {
  }

  // to obtain Access token given user credentials
    // todo make sure this is in sync with what it's supposed to be!
  private AUTH_SERVER_TOKEN_ENDPOINT = 'http://localhost:8080/oauth/token';

  obtainAccessToken( loginData ) {
    console.log('Obtaining  access token.');

    const params = new URLSearchParams();
    params.append('username', loginData.username);
    params.append('password', loginData.password);
    params.append('grant_type', 'password');
    params.append('client_id', 'fooClientIdPassword');

    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization: 'Basic ' + btoa('fooClientIdPassword:secret')
    });

    console.log('POST to: ' + this.AUTH_SERVER_TOKEN_ENDPOINT);
    this.httpClient.post(this.AUTH_SERVER_TOKEN_ENDPOINT, { params, headers })
      .subscribe(
        data => this.saveToken(data),
        err => alert('Invalid Credentials'));
  }

  // to save our access token in a cookie using ng2-cookies library
  saveToken( token ) {
    const expireDate = new Date().getTime() + (1000 * token.expires_in);
    Cookie.set('access_token', token.access_token, expireDate);
    this.router.navigate([ '/' ]);
  }

  // to get a Foo object from server using its ID
  getResource( resourceUrl ): Observable<Foo> {
    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization: 'Bearer ' + Cookie.get('access_token')
    });

    return this.httpClient.get<Foo>(resourceUrl, {headers});
      // .catch(( error: any ) => Observable.throw(error.json().error || 'Server error'));
  }

  // to check if user is logged in or not
  checkCredentials() {
    console.log('Checking credentials.');
    if ( !Cookie.check('access_token') ) {
      console.log('Navigating to login.');
      this.router.navigate([ '/login' ]);
    }
  }

  // to delete access token cookie and log the user out
  logout() {
    Cookie.delete('access_token');
    this.router.navigate([ '/login' ]);
  }
}

