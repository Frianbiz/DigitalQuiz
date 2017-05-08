import { Game } from './../game';
import { User } from './../user';
import { Component } from '@angular/core';

import * as firebase from '../../../node_modules/firebase/app';
import 'firebase/auth';
import 'firebase/database';

@Component({
  selector: 'app-game-master',
  templateUrl: './game-master.component.html',
  styleUrls: ['./game-master.component.css']
})
export class GameMasterComponent {

  public currentPlayer: User;
  public users: { [id: string] : User; } = {};
  public totalQuestion: Number;
  public game: Game;

  constructor() {

  var self = this;
  self.game = new Game('OPEN','0',0);

  firebase.database().ref('game').on('value', (snap) => {
    self.game = new Game(snap.val().state, snap.val().user, snap.val().question);
  });
  firebase.database().ref('questions').on('value', (snap) => {
    this.totalQuestion = snap.numChildren();
  });

  var userInGame = firebase.database().ref('/users');
  userInGame.on('child_changed', function(data) {
    var user = self.users[data.key];
    user.score =  data.val().score;
    user.status = data.val().status;
    user.statusLibelle = data.val().statusLibelle;

    if(data.val().status == 'BUZZ')
    {
      self.currentPlayer = user;
    }
    self.usersToArray();
  });
  userInGame.on('child_removed', function(data) {
    delete self.users[data.key]
  });
  userInGame.on('child_added', function(data) {
    self.users[data.key] = new User(data.key, data.val().score, data.val().status, data.val().statusLibelle)
    if(data.val().status == 'BUZZ')
    {
      self.currentPlayer = self.users[data.key];
    }
  });
  }

  public goodAnswer()
  {
      var audio = new Audio('assets/sound/win.mp3');
      audio.play();
      var self = this;
      var newScore = Number(self.users[this.currentPlayer.name].score)+1;
      firebase.database().ref('users/'+self.currentPlayer.name).set({
        score: newScore,
        status: 'WIN',
        statusLibelle: 'Bravo!',
    });
  }

  public badAnswer() {
    var audio = new Audio('assets/sound/fail.mp3');
    audio.play();


    var self = this;
    firebase.database().ref('/users/'+self.currentPlayer.name+'/score').once('value').then(function (snapshot) {

      firebase.database().ref('users/'+self.currentPlayer.name).set({
        score: self.currentPlayer.score,
        status: 'FAIL',
        statusLibelle: ':(',
      })
    });
  }

  public nextQuestion() {
    var self = this;
    let keyArr: any[] = Object.keys(this.users),
    dataArr = [];
    keyArr.forEach((key: any) => {
      firebase.database().ref('users/' + key).set({
        score: self.users[key].score,
        status: "STANDBY",
        statusLibelle: "À vous de jouer",
      })
    });

  var nextQuestionIndex = (this.game.questionIndex == this.totalQuestion)?1:this.game.questionIndex+1;
    firebase.database().ref('game').set({
      question: nextQuestionIndex,
      state: 'OPEN',
      user:'',
      answer_ts:Date.now()
    });
  }

  public remove(user)
  {
    if(user.length > 0)
    {
      firebase.database().ref('users/' + user).remove();
    }
  }

  public usersToArray()
  {
    let keyArr: any[] = Object.keys(this.users),
    dataArr = [];
    keyArr.forEach((key: any) => {
        dataArr.push(this.users[key]);
    });
    return dataArr;
  }
}
