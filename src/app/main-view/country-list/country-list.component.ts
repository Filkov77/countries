import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Destroyable } from 'app/shared';

import { CountryService } from '../../backend-api/country.service';
import { CountryListElement } from '../../backend-api/models/country-list-element.i';

interface SortOptions {
    field: (keyof CountryListElement);
    order: SortOrder;
}

interface DropDownEvent extends Event {
    value: SortOptions;
}

enum SortOrder {
    Ascending = 1,
    Descending = -1
}

@Component({
    selector: '[app-country-list]',
    templateUrl: './country-list.component.html'
})
export class CountryListComponent extends Destroyable implements OnInit {

    @Output()
    selectCountry: EventEmitter<string> = new EventEmitter();

    countries: CountryListElement[] | undefined;
    sortOptions: { label: string, value: SortOptions }[] | undefined;

    sortField!: (keyof CountryListElement);

    sortOrder!: SortOrder;

    constructor(private countryService: CountryService) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(
            this.countryService.getCountries().subscribe(response => { this.countries = response; })
        );

        this.sortOptions = [
            { label: 'Ascending', value: { field: 'name', order: SortOrder.Ascending } },
            { label: 'Descending', value: { field: 'name', order: SortOrder.Descending } },
            { label: 'Most Population', value: { field: 'population', order: SortOrder.Descending } },
            { label: 'Least Population', value: { field: 'population', order: SortOrder.Ascending } }
        ];
    }

    public showCountryDetails(country: CountryListElement) {
        this.selectCountry.emit(country.name);
    }

    onSortChange(event: DropDownEvent) {
        const value = event.value;
        this.sortField = value.field;
        this.sortOrder = value.order;
    }

}
