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
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  public  question:String;
  public  questionIndex:String;
  public answers:Array<Answer>;
  //
  public dataBase = firebase.database();
  public game: Game;
  public gameInstance: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location : Location
  ) {
    const self = this;
    this.gameInstance = this.dataBase.ref('game/question');
    this.gameInstance.on('value', (snap) => {
      console.log(snap);
      //location.go('/questions/'+snap.val().toString());
      this.showQuestion(snap.val().toString());
    });
  }

  ngOnInit() {
    //this.showQuestion(this.route.snapshot.params['id']);
  }

  public showQuestion(questionIndex)
  {
    var self = this;
    console.log(this.route.params);
    return firebase.database().ref('/questions/' + questionIndex).once('value').then(function(snapshot) {
      self.questionIndex = questionIndex;
      self.question = snapshot.val().title;
      self.answers = [];
      snapshot.val().answers.forEach((item)=>{
          self.answers.push(new Answer(item));
      })
    });
  }





}
