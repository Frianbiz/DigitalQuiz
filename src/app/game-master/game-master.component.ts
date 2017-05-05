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
  public totalQuestion: Number;

  constructor() {
    const self = this;
    this.gameInstance = this.dataBase.ref('game');
    this.gameInstance.on('value', (snap) => {
      self.game = new Game(snap.val().state, snap.val().user, snap.val().question);
      self.dataBase.ref('users/' + self.game.activeUser).once('value').then(function (snapshot) {
        if (snapshot.val() != null) {
          self.currentPlayer = new User(self.game.activeUser, snapshot.val().name);
        } else {
          self.currentPlayer = undefined;
        }
      });
    });
    this.dataBase.ref('questions').on('value', (snap) => {
      this.totalQuestion = snap.numChildren();
    });
  }

  ngOnInit() {
  }

  public isDisableButton(): boolean {
    if (this.game !== undefined) {
      return this.game.state !== 'STANDBY';
    } else {
      return true;
    }
  }

  public goodAnswer() {
    this.dataBase.ref('game').child('state').set('SUCCESS');
    this.dataBase.ref('game').child('user').set('0');
  }

  public badAnswer() {
    this.dataBase.ref('game').child('state').set('OPEN');
    this.dataBase.ref('game').child('user').set('0');
  }

  public nextQuestion() {
    let number = this.game.question + 1;
    if (number <= this.totalQuestion) {
      this.dataBase.ref('game').child('question').set(number);
    } else {
      this.dataBase.ref('game').child('question').set(1);
    }
    this.dataBase.ref('game').child('user').set("0");
  }

}
