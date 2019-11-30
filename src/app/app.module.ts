import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ConnectionDropDetectionModule } from './connection-drop-detection';
import { CountryListComponent } from './country-list/country-list.component';
import { SharedModule } from './shared/shared.module';


@NgModule({
   declarations: [
      AppComponent,
      CountryListComponent
   ],
   imports: [
       // #region Required by AppComponent
        SharedModule,
        ConnectionDropDetectionModule,
        // #endregion

        // #region Required for the root AppModule
        BrowserModule,
        // #endregion
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
