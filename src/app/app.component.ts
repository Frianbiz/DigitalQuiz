import { Component, OnInit } from '@angular/core';

import * as firebase from '../../node_modules/firebase/app';
import 'firebase/auth';
import 'firebase/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  public isDisplayBuzzer: Boolean

  constructor() {
    var config: any = {
      apiKey: "AIzaSyBU0lKPQSgLlZJy8A95YPy3UvNjg43oNAE",
      authDomain: "digitalquizz.firebaseapp.com",
      databaseURL: "https://digitalquizz.firebaseio.com",
      projectId: "digitalquizz",
      storageBucket: "digitalquizz.appspot.com",
      messagingSenderId: "415634368849"
    };
    firebase.initializeApp(config);
  }
}
