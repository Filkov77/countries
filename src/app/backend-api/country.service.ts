import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { environment } from 'environments/environment';

import { CountryDetails } from './models/country-details.i';
import { CountryListElement } from './models/country-list-element.i';

@Injectable({
    providedIn: 'root'
})
export class CountryService {

    countryListElementProperties: Array<(keyof CountryListElement)> = ['name', 'population', 'flag'];
    countryDetailsProperties: Array<(keyof CountryDetails)> = ['languages', 'currencies', 'timezones', 'borders'];

    countryListFilter!: string;
    countryDetailsFilter!: string;
    countryNameFilter = 'name';

    constructor(private http: HttpClient) {
        this.countryListFilter = this.countryListElementProperties.join(';');
        this.countryDetailsFilter = this.countryDetailsProperties.join(';');
    }

    public getCountries(): Observable<CountryListElement[]> {
        const fetchUri = `${environment.backendLocation}all?fields=${this.countryListFilter}`;
        return this.http.get<CountryListElement[]>(fetchUri);
    }

    // @TODO think about joining both next
    public getCountryDetails(countryFullName: string): Observable<CountryDetails[]> {
        const fetchUri = `${environment.backendLocation}name/${countryFullName}?fullText=true&fields=${this.countryDetailsFilter}`;
        return this.http.get<CountryDetails[]>(fetchUri);
    }

    public getCountryDetailsByCode(countryCodes: string[]): Observable<{ 'name': string }[]> {
        const fetchCodes = countryCodes.join(';');
        const fetchUri = `${environment.backendLocation}alpha/?codes=${fetchCodes}&fields=${this.countryNameFilter}`;
        return this.http.get<{ 'name': string }[]>(fetchUri);
    }

}
