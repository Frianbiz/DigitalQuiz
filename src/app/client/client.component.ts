import { Game } from './../game';
import { User } from './../user';
import { Component, OnInit } from '@angular/core';

import * as firebase from '../../../node_modules/firebase/app';
import 'firebase/auth';
import 'firebase/database';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  public dataBase = firebase.database();
  public username: String = '';
  public player: User;
  public game: Game;
  public gameInstance: any;

  constructor() { }

  ngOnInit() {
    const self = this;
    this.gameInstance = this.dataBase.ref('game');
    this.gameInstance.on('value', (snap) => {
      self.game = new Game(snap.val().state, snap.val().user, snap.val().question);
      if (snap.val().state === 'SUCCESS' && self.game.activeUser === self.player.id) {
        self.succesAnswer();
      } else {
        console.log('fail');
      }
    });
    this.dataBase.ref().child('game').once('value').then(function (snapshot) {
      self.game = new Game(snapshot.val().state, snapshot.val().user, snapshot.val().question);
    });
  }

  public isDisableButton(): boolean {
    if(this.game == undefined){
      return true;
    } else {
      return this.game.state !== 'OPEN';
    }
  }

  public onSubmit() {
    let userId = this.dataBase.ref().child('users').push().key;

    this.dataBase.ref().child('users/' + userId).set({
      name: this.username,
    });
    var self = this;
    self.player = new User(userId, this.username);
  }

  public onBuzz() {
    if (this.game.state === 'OPEN') {
      this.dataBase.ref('game').child('state').set('STANDBY');
      this.dataBase.ref('game').child('user').set(this.player.id);
    }
  }


  public succesAnswer() {
    this.dataBase.ref('game').child('state').set('OPEN');
    this.dataBase.ref('game').child('user').set(0);
  }
}
