import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { iif, Observable, of } from 'rxjs';
import { finalize, map, mergeMap, tap } from 'rxjs/operators';

import { CountryService } from 'app/backend-api/country.service';
import { CountryDetails } from 'app/backend-api/models/country-details.i';
import { NamedCountry } from 'app/backend-api/models/named-country.i';
import { ActivityService, Destroyable } from 'app/shared';

import { CountryDetailsViewModel } from './country-details-view-model.i';

@Component({
    selector: '[app-country-details]',
    templateUrl: './country-details.component.html'
})
export class CountryDetailsComponent extends Destroyable implements OnChanges {

    @Output()
    selectCountry: EventEmitter<string> = new EventEmitter();

    @Input()
    selectedCountryName: string | undefined;

    countryDetailsViewModel: CountryDetailsViewModel | undefined;

    loaded = false;
    showOverlay = false;

    showFaultyDataPanel = false;

    constructor(private countryService: CountryService, private activityService: ActivityService) {
        super();
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.selectedCountryName) {

            if (this.selectedCountryName) {
                this.subscriptions.push(
                    this.activityService.trackFinalization('country details pending operation',
                        this.countryService.getCountryDetails(changes.selectedCountryName.currentValue as string).pipe(
                            mergeMap((countryDetails) => {
                                return this.initCountyDetailsViewModel(countryDetails[0]);
                            }),
                            tap(countryDetailsViewModel => {
                                this.countryDetailsViewModel = countryDetailsViewModel;
                                this.loaded = true;

                            }))).subscribe(),
                    this.activityService.activeCount('country details pending operation').pipe(
                        tap(activeProcessCount => {
                            this.showOverlay = activeProcessCount > 0;
                        })).subscribe()
                );
            } else {
                this.selectedCountryName = undefined;
            }
        }
    }

    public setActiveCountry(activeCountry: string) {
        // @TODO consider using model binding
        this.selectCountry.emit(activeCountry);
    }

    public setActiveCountryByCode(borderCountryCode: string) {
        this.subscriptions.push(
            this.getCountriesByCode([borderCountryCode]).
                subscribe(countryName => {
                    this.selectCountry.emit(countryName[0].name);
                })
        );
    }

    public toggleFaultyDataPanel() {
        this.showFaultyDataPanel = !this.showFaultyDataPanel;
    }

    private initCountyDetailsViewModel(countryDetails: CountryDetails): Observable<CountryDetailsViewModel> {

        if (countryDetails.borders.length > 0) {
            return this.getCountriesByCode(countryDetails.borders).pipe(
                map(borderCountries => {
                    return this.setCountryDetails(countryDetails, borderCountries);
                })
            );
        }
        else {
            return of(this.setCountryDetails(countryDetails, []));
        }
    }

    private setCountryDetails(countryDetails: CountryDetails, borderCountries: NamedCountry[]) {
        return {
            languages: countryDetails.languages.map(lang => lang.name),
            currencies: countryDetails.currencies.map(currency => currency.name),
            timezones: countryDetails.timezones,
            borders: borderCountries.map(country => country.name),
            countryCode: countryDetails.alpha2Code
        };
    }

    private getCountriesByCode(countryCodes: string[]) {
        return this.countryService.getCountryDetailsByCode(countryCodes);
    }

}
