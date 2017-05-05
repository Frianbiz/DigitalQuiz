import { GameMasterComponent } from './game-master/game-master.component';
import { ClientComponent } from './client/client.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BuzzerComponent } from './buzzer/buzzer.component';

import { Routes, RouterModule } from '@angular/router';
import { QuestionsComponent } from './questions/questions.component';



@NgModule({
  declarations: [
    AppComponent,
    BuzzerComponent,
    GameMasterComponent,
    ClientComponent,
    QuestionsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: 'gamemaster',
        component: GameMasterComponent
      },
      {
        path: 'client',
        component: ClientComponent
      },
      {
        path: 'questions/:id',
        component: QuestionsComponent
      },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
