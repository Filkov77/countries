import { Component, OnInit } from '@angular/core';

import { Destroyable } from 'app/shared';

import { CountryListElement } from './../backend-api/country-list-element.i';
import { CountryService } from './../backend-api/country.service';

interface SortOptions {
    field: (keyof CountryListElement);
    direction: SortDirection;
}

interface DropDownEvent extends Event {
    value: SortOptions;
}

enum SortDirection {
    Ascending = 1,
    Descending = -1
}

@Component({
    selector: '[app-country-list]',
    templateUrl: './country-list.component.html'
})
export class CountryListComponent extends Destroyable implements OnInit {

    countries: CountryListElement[] = [];
    sortOptions: { label: string, value: SortOptions }[] = [];

    sortField: (keyof CountryListElement) = 'name';

    sortOrder = 1;

    constructor(private countryService: CountryService) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(
            this.countryService.getCountries().subscribe(response => { this.countries = response; })
        );

        this.sortOptions = [
            { label: 'Ascending', value: { field: 'name', direction: SortDirection.Ascending } },
            { label: 'Descending', value: { field: 'name', direction: SortDirection.Descending } },
            { label: 'Most Population', value: { field: 'population', direction: SortDirection.Descending } },
            { label: 'Least Population', value: { field: 'population', direction: SortDirection.Ascending } }
        ];
    }

    public showCountryDetails(country: CountryListElement) {
        alert(country);
    }

    onSortChange(event: DropDownEvent) {
        const value = event.value;
        this.sortField = value.field;
        this.sortOrder = value.direction;
    }

}
