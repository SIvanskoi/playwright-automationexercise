import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { RegistrationFormData } from '../utils/fakeuser'

export class SignupPage extends BasePage {

    // Account Information Locators
    readonly continueButton: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    //readonly genderRadio: Locator;
    readonly passwordInput: Locator;
    readonly dayDropdown: Locator;
    readonly monthDropdown: Locator;
    readonly yearDropdown: Locator;
    readonly newsletterCheckbox: Locator;
    readonly offersCheckbox: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly companyInput: Locator;
    readonly address1Input: Locator;
    readonly address2Input: Locator;
    readonly countryDropdown: Locator;
    readonly stateInput: Locator;
    readonly cityInput: Locator;
    readonly zipcodeInput: Locator;
    readonly mobileNumberInput: Locator;
    readonly createAccountButton: Locator;
    readonly enterAccountInfoHeader: Locator;
    readonly accountDeletedHeader: Locator;
    readonly accountCreatedHeader: Locator;

    constructor(page: Page) {
        super(page);

        this.url = '/signup'
        
        this.continueButton = this.page.getByRole('link', { name: 'Continue' })
        this.nameInput = this.page.getByTestId('name');
        this.emailInput = this.page.getByTestId('email');
        this.passwordInput = this.page.getByTestId('password');
        this.dayDropdown = this.page.getByTestId('days');
        this.monthDropdown = this.page.getByTestId('months');
        this.yearDropdown = this.page.getByTestId('years');
        this.newsletterCheckbox = this.page.locator('//label[@for="newsletter"]');
        this.offersCheckbox = this.page.locator('//label[@for="optin"]');
        this.firstNameInput = this.page.getByTestId('first_name');
        this.lastNameInput = this.page.getByTestId('last_name');
        this.companyInput = this.page.getByTestId('company');
        this.address1Input = this.page.getByTestId('address');
        this.address2Input = this.page.getByTestId('address2');
        this.countryDropdown = this.page.getByTestId('country');
        this.stateInput = this.page.getByTestId('state');
        this.cityInput = this.page.getByTestId('city');
        this.zipcodeInput = this.page.getByTestId('zipcode');
        this.mobileNumberInput = this.page.getByTestId('mobile_number');
        this.createAccountButton = this.page.getByTestId('create-account');
        this.enterAccountInfoHeader = this.page.getByText('Enter Account Information');
        this.accountDeletedHeader = this.page.getByText('Account Deleted!');
        this.accountCreatedHeader = this.page.getByText('Account Created!');
    }

    public async createAccount(formData: Partial<RegistrationFormData>): Promise<void> {
        if (formData.name) {
            await this.nameInput.fill(formData.name);
        }
        if (formData.password) {
            await this.passwordInput.fill(formData.password);
        }
        if (formData.birth_date) {
            await this.dayDropdown.selectOption(formData.birth_date)
        }
        if (formData.birth_month) {
            await this.monthDropdown.selectOption(formData.birth_month)
        }
        if (formData.birth_year) {
            await this.yearDropdown.selectOption(formData.birth_year)
        }
        if (formData.firstname) {
            await this.firstNameInput.fill(formData.firstname)
        }
        if (formData.lastname) {
            await this.lastNameInput.fill(formData.lastname)
        }
        if (formData.company) {
            await this.companyInput.fill(formData.company)
        }
        if (formData.address1) {
            await this.address1Input.fill(formData.address1)
        }
        if (formData.country) {
            await this.countryDropdown.selectOption(formData.country)
        }
        if (formData.state) {
            await this.stateInput.fill(formData.state)
        }
        if (formData.city) {
            await this.cityInput.fill(formData.city)
        }
        if (formData.zipcode) {
            await this.zipcodeInput.fill(formData.zipcode)
        }
        if (formData.mobile_number) {
            await this.mobileNumberInput.fill(formData.mobile_number)
        }
        await this.createAccountButton.click();
    }

}