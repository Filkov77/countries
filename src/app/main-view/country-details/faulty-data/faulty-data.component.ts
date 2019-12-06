import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { defer, EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, map, mergeMap, tap } from 'rxjs/operators';

import { CountryService } from 'app/backend-api/country.service';
import { NamedCountry } from 'app/backend-api/models/named-country.i';
import { FlashMessageUiClass, FlashService } from 'app/shared/services/flash.service';

import { CountryNotFound } from './../../../backend-api/models/country-not-found';

@Component({
    selector: '[app-faulty-data]',
    templateUrl: './faulty-data.component.html'
})
export class FaultyDataComponent {

    @Input()
    countryNames!: Array<string>;

    constructor(private countryService: CountryService, private flashService: FlashService) { }

    public validateTag = (tag: string): Observable<string> => {
        return this.countryService.getCountryNameByPartialName(tag).pipe(
            catchError(() => {
                const notFound = { status: 404, message: 'Not found' };
                return of(notFound as CountryNotFound);
            }),
            map((response) => {
                let result = '';
                if (!(response as CountryNotFound).message) {
                    const countryNameResponse = (response as NamedCountry[]);
                    if (countryNameResponse.length === 1) {
                        result = countryNameResponse[0].name;
                    }
                    else {
                        const taggedCountry = countryNameResponse.find((country) => country.name.toLowerCase() === tag.toLowerCase());
                        if (taggedCountry) {
                            return taggedCountry.name;
                        }
                        else {
                            const similarCountries = countryNameResponse.filter(
                                (country) => country.name.toLowerCase().includes(tag.toLowerCase()));
                            if (similarCountries.length === 1) {
                                result = similarCountries[0].name;
                            }
                        }
                    }
                }
                return result;
            }),
            tap((res) => {
                if (!res) {
                    this.flashService.next({
                        value: `Country not recognizable`,
                        uiClass: FlashMessageUiClass.warning,
                        timeout: 3000
                    });
                }
            })
        );
    }

}
