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
      self.game.activeUser = snap.val().user;
      self.game.state = snap.val().state;
    });
    this.dataBase.ref().child('game').once('value').then(function (snapshot) {
      self.game = new Game(snapshot.val().state, snapshot.val().user);
    });
  }

  public isDisableButton(): boolean {
    return this.game.activeUser !== '0';
  }

  public onSubmit() {
    let userId = this.dataBase.ref().child('users').push().key;
    this.dataBase.ref().child('users/' + userId).set({
      name: this.username,
    });
    var self = this;
    this.dataBase.ref().child('users/' + userId).once('value').then(function (snapshot) {
      var username = snapshot.val().name;
      var id = userId;
      self.player = new User(id, username);
    });
  }

  public onBuzz() {
    if (this.game.activeUser === '0') {
      this.dataBase.ref().child('game').set({
        state: this.game.state,
        user: this.player.id
      });
    }
  }


}
