import { Game } from './../game';
import { User } from './../user';
import { Component } from '@angular/core';

import * as firebase from '../../../node_modules/firebase/app';
import 'firebase/auth';
import 'firebase/database';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})

export class ClientComponent{

  public currentState = 'GUEST';
  public name: string = '';
  public users: { [id: string] : User; } = {};
  public buzzSound;
  public winSound;
  public failSound;

  constructor() {
      this.buzzSound = new Audio('assets/sound/play.mp3');
      this.winSound = new Audio('assets/sound/win.mp3');
      this.failSound = new Audio('assets/sound/fail.mp3');

      var self = this;
      var userInGame = firebase.database().ref('/users');
      userInGame.on('child_removed', function(data) {
        delete self.users[data.key]
      });
      userInGame.on('child_added', function(data) {
        self.users[data.key] = new User(data.key, data.val().score, data.val().status, data.val().statusLibelle)
      });
  }
  public nameIsEmpty()
  {
    return this.name.length <= 0;
  }
  public user()
  {
    return this.users[this.name];
  }
  public userDisable()
  {
    return this.users[this.name].status == 'DISABLE';
  }
  public signup()
  {
    var self = this;
    firebase.database().ref('users/' + this.name).once('value', function(data) {
      if( !data.val()) //User not already exist
      {
          self.createUser();
      }
      else
      {
          self.users[self.name] = new User(data.key, data.val().score, 'STANDBY', 'Welcome Back');
          self.play();
      }
    });
  }

  public createUser()
  {
    var self = this;
    firebase.database().ref('users/' + this.name).set({
      score: 0,
      status: 'STANDBY',
      statusLibelle: 'Welcome !',
    }).then(function(snapshot) {
      self.users[self.name] = new User(self.name, 0, 'STANDBY', 'Welcome !');
      self.play();
    });
  }

  public buzz()
  {
    this.buzzSound.play();
    var self = this;
    let keyArr: any[] = Object.keys(this.users),
    dataArr = [];
    keyArr.forEach((key: any) => {
      //console.log("for:"+key+ "score is"+self.users[key].score);
      firebase.database().ref('users/' + key).update({
        status: (key == self.name)?"BUZZ":"DISABLE",
        statusLibelle: (key == self.name)?"Buzz!!!":"Patientez...",
      })
    });
  }

  public play()
  {
    this.currentState = 'INGAME';

    var self = this;
    var userInGame = firebase.database().ref('/users/'+this.name);
    userInGame.on('value', function(data) {
      self.users[self.name].score = data.val().score;
      self.users[self.name].status = data.val().status;
      self.users[self.name].statusLibelle = data.val().statusLibelle;
      if(self.users[self.name].status == 'FAIL')
      {
        self.failSound.play();
      }
      else if(self.users[self.name].status == 'WIN')
      {
        self.winSound.play();
      }
    });
  }
}
