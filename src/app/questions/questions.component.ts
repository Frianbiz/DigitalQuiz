import { User } from './../user';
import { Component, OnInit } from '@angular/core';
import * as firebase from '../../../node_modules/firebase/app';
import 'firebase/database';
import { Answer } from './../answer';
import { Game } from './../game';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-questions',
  templateUrl: './dash.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent {

  public question: String;
  public img: String;
  public questionIndex: String;
  public answers: Array<Answer>;
  public users: { [id: string] : User; } = {};
  public game: Game;
  public currentState = 'OPEN';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {

    var self = this;
    var newQuestion = firebase.database().ref('game/question');
    newQuestion.on('value', (snap) => {
      this.retrieveQuestion(snap.val().toString());
    });

    var userInGame = firebase.database().ref('/users');
    userInGame.on('child_changed', function(data) {
      var user = self.users[data.key];
      user.score =  data.val().score;
      user.status = data.val().status;
      user.statusLibelle = data.val().statusLibelle;
      self.usersToArray();
    });
    userInGame.on('child_removed', function(data) {
      delete self.users[data.key]
    });
    userInGame.on('child_added', function(data) {
      self.users[data.key] = new User(data.key, data.val().score, data.val().status, data.val().statusLibelle)
    });
  }

  public usersToArray()
  {
    let keyArr: any[] = Object.keys(this.users),
    dataArr = [];
    // loop through the object,
    // pushing values to the return array
    keyArr.forEach((key: any) => {
        dataArr.push(this.users[key]);
    });
    // return the resulting array
    return dataArr;
  }


  public retrieveQuestion(questionIndex){
    var self = this;
    return firebase.database().ref('/questions/' + questionIndex).once('value').then(function (snapshot) {
      self.showQuestion(snapshot.val().title, snapshot.val().answers, snapshot.val().img);
    });
  }

  public showQuestion(question, answers, img)
  {
    this.currentState = 'OPEN';
    this.img= img;
    this.question = question;
    this.answers = [];
    answers.forEach((item) => {
      this.answers.push(new Answer(item));
    });
  }
}
