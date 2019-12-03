import { Currency } from './currency';
import { Language } from './language';

export interface CountryDetails {
    languages: Language[];
    currencies: Currency[];
    timezones: string[];
    borders: string[];
}
