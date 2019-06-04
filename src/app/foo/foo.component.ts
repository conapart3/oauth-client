import { Component } from '@angular/core';
import { AppService, Foo } from '../app.service';

@Component({
  selector: 'app-foo',
  providers: [ AppService ],
  templateUrl: './foo.component.html',
  styleUrls: [ './foo.component.css' ]
})
export class FooComponent {

  public foo = new Foo(1, 'sample foo');
  private foosUrl = 'http://localhost:8081/foos/';

  constructor( private service: AppService ) {
  }

  getFoo() {
    this.service.getResource(this.foosUrl + this.foo.id)
      .subscribe(data => this.foo = data,
        error => this.foo.name = 'Error');
  }

}
