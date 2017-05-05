import { Game } from './../game';
import { User } from './../user';
import { Component, OnInit } from '@angular/core';

import * as firebase from '../../../node_modules/firebase/app';
import 'firebase/auth';
import 'firebase/database';

@Component({
  selector: 'app-game-master',
  templateUrl: './game-master.component.html',
  styleUrls: ['./game-master.component.css']
})
export class GameMasterComponent implements OnInit {

  public dataBase = firebase.database();
  public currentPlayer: User;
  public game: Game;
  public gameInstance: any;

  constructor() {
    const self = this;
    this.gameInstance = this.dataBase.ref('game');
    this.gameInstance.on('value', (snap) => {
      self.game = new Game(snap.val().state, snap.val().user);
      self.dataBase.ref('/users/' + self.game.activeUser).once('value').then(function (snapshot) {
        if (snapshot.val() != null) {
          self.currentPlayer = new User(self.game.activeUser, snapshot.val().name);
        }
      });
    });
  }

  ngOnInit() {
  }

}
