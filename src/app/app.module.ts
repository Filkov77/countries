import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TagInputModule } from 'ngx-chips';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';

import { AppComponent } from './app.component';
import { ConnectionDropDetectionModule } from './connection-drop-detection';
import { CountryDetailsComponent } from './main-view/country-details/country-details.component';
import { FaultyDataComponent } from './main-view/country-details/faulty-data/faulty-data.component';
import { WorldMapComponent } from './main-view/country-details/world-map/world-map.component';
import { CountryListComponent } from './main-view/country-list/country-list.component';
import { MainViewComponent } from './main-view/main-view.component';
import { SharedModule } from './shared/shared.module';


@NgModule({
    declarations: [
        AppComponent,
        CountryListComponent,
        MainViewComponent,
        CountryDetailsComponent,
        WorldMapComponent,
        FaultyDataComponent
    ],
    imports: [
        // #region Required by AppComponent
        SharedModule,
        ConnectionDropDetectionModule,
        // #endregion

        // #region Required for the root AppModule
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        // #endregion
        PanelModule,
        DropdownModule,
        DataViewModule,

        TagInputModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
