import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { environment } from 'environments/environment';

import { CountryListElement } from './country-list-element.i';

@Injectable({
    providedIn: 'root'
})
export class CountryService {

    constructor(private http: HttpClient) { }

    public getCountries(): Observable<CountryListElement[]> {
        const countryListElementProperties: Array<(keyof CountryListElement)> = ['name', 'population', 'flag'];
        const filter = countryListElementProperties.join(';');
        const fetchUri = `${environment.backendLocation}all?fields=${filter}`;
        return this.http.get<CountryListElement[]>(fetchUri);
    }

    public getCountryDetails() {

    }

}
