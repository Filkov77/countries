import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, inject, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { environment } from 'environments/environment';

import { CountryService } from './country.service';

const getCountriesValidResponse = [
    { 'flag': 'https://restcountries.eu/data/afg.svg', 'name': 'Afghanistan', 'population': 27657145 },
    { 'flag': 'https://restcountries.eu/data/ala.svg', 'name': 'Åland Islands', 'population': 28875 },
    { 'flag': 'https://restcountries.eu/data/alb.svg', 'name': 'Albania', 'population': 2886026 },
    { 'flag': 'https://restcountries.eu/data/dza.svg', 'name': 'Algeria', 'population': 40400000 },
    { 'flag': 'https://restcountries.eu/data/asm.svg', 'name': 'American Samoa', 'population': 57100 },
    { 'flag': 'https://restcountries.eu/data/and.svg', 'name': 'Andorra', 'population': 78014 },
    { 'flag': 'https://restcountries.eu/data/ago.svg', 'name': 'Angola', 'population': 25868000 },
    { 'flag': 'https://restcountries.eu/data/aia.svg', 'name': 'Anguilla', 'population': 13452 }];

describe('Service: GetCountries', () => {
    let injector: TestBed;
    let httpMock: HttpTestingController;
    let service: CountryService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CountryService]
        });
        injector = getTestBed();
        httpMock = injector.get(HttpTestingController);
        service = injector.get(CountryService);
    });

    describe('getCountries', () => {

        fit('should return mocked countries', (done) => {
            service.getCountries().subscribe(response => {
                expect(response).toEqual(getCountriesValidResponse);
                done();
            });
            const expectedUri = `${environment.backendLocation}all?fields=name;population;flag`;
            const req = httpMock.expectOne(expectedUri);
            expect(req.request.method).toBe('GET');
            req.flush(getCountriesValidResponse);
        });
    });
});
