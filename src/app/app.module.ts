import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { VoiceInputComponent } from './voice-input/voice-input.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    VoiceInputComponent,
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
