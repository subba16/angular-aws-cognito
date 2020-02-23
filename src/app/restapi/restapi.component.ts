import { Component, OnInit } from '@angular/core';
import { AuthorizationService} from "../authorization.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-restapi',
  templateUrl: './restapi.component.html',
  styleUrls: ['./restapi.component.css'] 
})
export class RestapiComponent implements OnInit {

  _data : any;

  constructor(private http: HttpClient, private auth: AuthorizationService) { }

  ngOnInit() {
    var authenticatedUser = this.auth.getAuthenticatedUser();
    if (authenticatedUser == null) {
      return;
    }
    authenticatedUser.getSession( (err, session) => {
      if (err) {
        console.log(err);
        return;
      }
      const token = session.getIdToken().getJwtToken();      
      const headers = new HttpHeaders();
      headers.append('Authorization', token);      
      var that = this;
      this.auth.getAuthenticatedUser().getSession((err, session) => {
        if (err) {
          console.log(err);
          return;
        }
        const token = session.getIdToken().getJwtToken();        
        const headers = new HttpHeaders();
        headers.append('Authorization', token);        
        this.http.get('https://hxk2pjx0e5.execute-api.us-east-1.amazonaws.com/myFirstlambda', { headers: headers })
          .subscribe(
          response => {           
            that._data = response
          },
          error => {
            console.log(error);
          }
        );
      });
    });
  }
}
