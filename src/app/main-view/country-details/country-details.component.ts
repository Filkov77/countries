import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

import { CountryListElement } from 'app/backend-api/models/country-list-element.i';
import { Destroyable } from 'app/shared';

import { CountryService } from './../../backend-api/country.service';
import { CountryDetails } from './../../backend-api/models/country-details.i';
import { CountryDetailsViewModel } from './country-details-view-model.i';

@Component({
    selector: '[app-country-details]',
    templateUrl: './country-details.component.html'
})
export class CountryDetailsComponent extends Destroyable implements OnChanges {

    @Input()
    selectedCountryName: string | undefined;

    @Output()
    selectCountry: EventEmitter<string> = new EventEmitter();

    countryDetailsViewModel!: CountryDetailsViewModel;

    loaded = false;

    constructor(private countryService: CountryService) {
        super();
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(0);
        if (changes.selectedCountryName) {
            if (this.selectedCountryName) {
                // @TODO add subscription
                this.countryService.getCountryDetails(changes.selectedCountryName.currentValue as string).pipe(
                    mergeMap((countryDetails) => {
                        return this.initCountyDetailsViewModel(countryDetails[0]);
                    })).subscribe(countryDetailsViewModel => {
                        this.countryDetailsViewModel = countryDetailsViewModel;
                        this.loaded = true;
                    });
            } else {
                this.selectedCountryName = undefined;
            }
        }
    }

    public setActiveCountry(borderCountry: string) {
        console.log(1);
        // @TODO refactory!!!
        // this.selectedCountryName = borderCountry;
        this.selectCountry.emit(borderCountry);
    }

    private initCountyDetailsViewModel(countryDetails: CountryDetails): Observable<CountryDetailsViewModel> {
        return this.initBoarders(countryDetails.borders).pipe(
            map(borderCountries => {
                return {
                    languages: countryDetails.languages.map(lang => lang.name),
                    currencies: countryDetails.currencies.map(currency => currency.name),
                    timezones: countryDetails.timezones,
                    borders: borderCountries.map(country => country.name)
                };
            })
        );
    }

    private initBoarders(countryCodes: string[]) {
        return this.countryService.getCountryDetailsByCode(countryCodes);
    }

}
