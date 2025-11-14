import { faker } from '@faker-js/faker';


export interface RegistrationFormData {
    firstname: string;
    lastname: string;
    birth_date: string;
    birth_month: string;
    birth_year: string;
    email: string;
    mobile_number: string;
    zipcode: string;
    state: string;
    city: string;
    address1: string;
    country: string;
    company: string;
    name: string;
    password: string;
}

class CountryProvider {
    private countries = [
        'India',
        'United States',
        'Canada',
        'Australia',
        'Israel',
        'New Zealand',
        'Singapore',
    ];

    getCountry(): string {
        const index = Math.floor(Math.random() * this.countries.length);
        return this.countries[index];
    }
}

export class RegistrationFormDataBuilder {

    private data: Partial<RegistrationFormData> = {};

    private countryProvider = new CountryProvider();

    constructor() {

        this.data.firstname = faker.person.firstName();
        this.data.lastname = faker.person.lastName();
        this.data.birth_date = faker.number.int({ min: 1, max: 30 }).toString();
        this.data.birth_month = faker.number.int({ min: 1, max: 12 }).toString();
        this.data.birth_year = faker.number.int({ min: 1900, max: 2021 }).toString();
        this.data.email = faker.internet.email();
        this.data.mobile_number = faker.phone.number();
        this.data.zipcode = faker.location.zipCode();
        this.data.state = faker.location.state();
        this.data.city = faker.location.city();
        this.data.address1 = faker.location.streetAddress();
        this.data.country = this.countryProvider.getCountry();
        this.data.company = faker.company.name();
        this.data.password = faker.string.alphanumeric(12);
        this.data.name = `${this.data.firstname} ${this.data.lastname}`.trim()
    }

    withFirstName(firstName: string): this {
        this.data.firstname = firstName;
        return this;
    }

    withLastName(lastName: string): this {
        this.data.lastname = lastName;
        return this;
    }

    withDay(day: string): this {
        this.data.birth_date = day;
        return this;
    }

    withMonth(month: string): this {
        this.data.birth_month = month;
        return this;
    }

    withYear(year: string): this {
        this.data.birth_year = year;
        return this;
    }

    withEmail(email: string): this {
        this.data.email = email;
        return this;
    }

    withPhoneNumber(phoneNumber: string): this {
        this.data.mobile_number = phoneNumber;
        return this;
    }

    withZipcode(zipcode: string): this {
        this.data.zipcode = zipcode;
        return this;
    }

    withState(state: string): this {
        this.data.state = state;
        return this;
    }

    withCity(city: string): this {
        this.data.city = city;
        return this;
    }

    withAddress(address: string): this {
        this.data.address1 = address;
        return this;
    }

    withCountry(country: string): this {
        this.data.country = country;
        return this;
    }

    withCompany(company: string): this {
        this.data.company = company;
        return this;
    }

    withName(name: string): this {
        this.data.name = name;
        return this;
    }

    withPassword(password: string): this {
        this.data.password = password;
        return this
    }

    // Without methods
    withoutFirstName(): this {
        delete this.data.firstname;
        return this;
    }

    withoutLastName(): this {
        delete this.data.lastname;
        return this;
    }

    withoutDay(): this {
        delete this.data.birth_date;
        return this;
    }

    withoutMonth(): this {
        delete this.data.birth_month;
        return this;
    }

    withoutYear(): this {
        delete this.data.birth_year;
        return this;
    }

    withoutEmail(): this {
        delete this.data.email;
        return this;
    }

    withoutPhoneNumber(): this {
        delete this.data.mobile_number;
        return this;
    }

    withoutZipcode(): this {
        delete this.data.zipcode;
        return this;
    }

    withoutState(): this {
        delete this.data.state;
        return this;
    }

    withoutCity(): this {
        delete this.data.city;
        return this;
    }

    withoutAddress(): this {
        delete this.data.address1;
        return this;
    }

    withoutCountry(): this {
        delete this.data.country;
        return this;
    }

    withoutCompany(): this {
        delete this.data.company;
        return this;
    }

    withoutName(): this {
        delete this.data.name;
        return this;
    }

    build(): Partial<RegistrationFormData> {
        return { ...this.data };
    }

    toJSON(): string {
        return JSON.stringify(this.data)
    }
}
