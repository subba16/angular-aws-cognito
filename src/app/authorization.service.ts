import { Injectable } from '@angular/core';
import {AuthenticationDetails, CognitoUser,CognitoUserAttribute, CognitoUserPool} from 'amazon-cognito-identity-js';
import {Observable } from 'rxjs';

const poolData = {
  UserPoolId: 'us-east-1_Lwbryx78a', // Your user pool id here
  ClientId: '4dqj9v48ch5k4b77k4tk540ah1' // Your client id here  
};

const userPool = new CognitoUserPool(poolData);


@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  cognitoUser: any;

    constructor() { }

    register(email, password) {

      const attributeList = [];
      attributeList.push(new CognitoUserAttribute({
        Name: 'email',
        Value: email
    }));
      
      console.log("email"+ email);
      console.log("password"+ password);
      return Observable.create(observer => {
        userPool.signUp(email, password, attributeList, null, (err, result) => {
          if (err) {
            console.log("signUp error", err);
            observer.error(err);
          }
  
          this.cognitoUser = result.user;
          console.log("signUp success", result);
          observer.next(result);
          observer.complete();
        });
      });
  
    }
    confirmAuthCode(code) {
      const user = {
        Username : this.cognitoUser.username,
        Pool : userPool
      };
      return Observable.create(observer => {
        const cognitoUser = new CognitoUser(user);
        cognitoUser.confirmRegistration(code, true, function(err, result) {
          if (err) {
            console.log(err);
            observer.error(err);
          }
          console.log("confirmAuthCode() success", result);
          observer.next(result);
          observer.complete();
        });
      });
    }
  
    signIn(email, password) { 
  
      const authenticationData = {
        Username : email,
        Password : password,
      };
      const authenticationDetails = new AuthenticationDetails(authenticationData);
  
      const userData = {
        Username : email,
        Pool : userPool
      };
      const cognitoUser = new CognitoUser(userData);
      
      return Observable.create(observer => {
  
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: function (result) {
            
            //console.log(result);
            observer.next(result);
            observer.complete();
          },
          onFailure: function(err) {
            console.log(err);
            observer.error(err);
          },
        });
      });
    }
  
    isLoggedIn() {    
      return userPool.getCurrentUser() != null;
    }
  
    getAuthenticatedUser() {
      // gets the current user from the local storage
      return userPool.getCurrentUser();
    }
  
    logOut() {
      this.getAuthenticatedUser().signOut();
      this.cognitoUser = null;
    }  
}
