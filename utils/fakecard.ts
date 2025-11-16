import { faker } from '@faker-js/faker';

export interface PaymentData {
    cardname: string;
    cardnumber: string;
    cvv: string;
    expirymonth: string;
    expiryyear: string;
}

export class PaymentDataBuilder {

    private data: Partial<PaymentData> = {};

    constructor () {
        this.data.cardname = faker.person.fullName();
        this.data.cardnumber = faker.finance.creditCardNumber();
        this.data.cvv = faker.finance.creditCardCVV();
        this.data.expirymonth = faker.date.future().getMonth().toString();
        this.data.expiryyear = faker.date.future().getFullYear().toString();
    }

    // With methods
    public withCardName(cardName: string): this {
        this.data.cardname = cardName;
        return this;
    }

    public withCardNumber(cardNumber: string): this {
        this.data.cardnumber = cardNumber;
        return this;
    }

    public withCVV(cardCVV: string): this {
        this.data.cvv = cardCVV;
        return this;
    }

    public withExpiryMonth(expiryMonth: number): this {
        this.data.expirymonth = expiryMonth.toString();
        return this;
    }

    public withExpiryYear(expiryYear: number): this {
        this.data.expiryyear= expiryYear.toString();
        return this;
    }

    //Without metods
    public withoutCardName(): this {
        delete this.data.cardname;
        return this;
    }

    public withoutCardNumber(): this {
        delete this.data.cardnumber;
        return this;
    }

    public withoutCVV(): this {
        delete this.data.cvv;
        return this;
    }

    public withoutExpiryMonth(): this {
        delete this.data.expirymonth;
        return this;
    }

    public withoutExpiryYear(): this {
        delete this.data.expiryyear;
        return this;
    }

    public build(): Partial<PaymentData> {
        return { ...this.data };
    }
}