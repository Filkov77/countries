import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { environment } from 'environments/environment';

import { CountryDetails } from './models/country-details.i';
import { CountryListElement } from './models/country-list-element.i';
import { CountryNotFound } from './models/country-not-found';
import { NamedCountry } from './models/named-country.i';

@Injectable({
    providedIn: 'root'
})
export class CountryService {

    countryListElementProperties: Array<(keyof CountryListElement)> = ['name', 'population', 'flag'];
    countryDetailsProperties: Array<(keyof CountryDetails)> = ['languages', 'currencies', 'timezones', 'borders', 'alpha2Code'];

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

    public getCountryDetails(countryFullName: string): Observable<CountryDetails[]> {
        const fetchUri = `${environment.backendLocation}name/${countryFullName}?fullText=true&fields=${this.countryDetailsFilter}`;
        return this.http.get<CountryDetails[]>(fetchUri);
    }

    public getCountryDetailsByCode(countryCodes: string[]): Observable<NamedCountry[]> {
        const fetchCodes = countryCodes.join(';');
        const fetchUri = `${environment.backendLocation}alpha/?codes=${fetchCodes}&fields=${this.countryNameFilter}`;
        return this.http.get<NamedCountry[]>(fetchUri);
    }

    public getCountryNameByPartialName(partialName: string): Observable<NamedCountry[] | CountryNotFound> {
        const fetchUri = `${environment.backendLocation}name/${partialName}?fields=${this.countryNameFilter}`;
        return this.http.get<NamedCountry[] | CountryNotFound>(fetchUri);
    }

}
