import { Component, OnInit } from '@angular/core';
import * as firebase from '../../../node_modules/firebase/app';
import 'firebase/database';
import { Answer } from './../answer';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  public  question:String;
  public answers:Array<Answer> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    var self = this;
    console.log(this.route.params);
    return firebase.database().ref('/questions/' + this.route.snapshot.params['id']).once('value').then(function(snapshot) {
      self.question = snapshot.val().title;
      snapshot.val().answers.forEach((item)=>{
          self.answers.push(new Answer(item));
      })
    });
  }
}
