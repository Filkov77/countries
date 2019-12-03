import { Component, OnInit } from '@angular/core';

@Component({
    selector: '[app-main-view]',
    templateUrl: './main-view.component.html'
})
export class MainViewComponent {

    selectedCountryName: string | undefined;

    setSelectedCountry(selectedCountryName: string) {
        this.selectedCountryName = selectedCountryName;
    }

}
