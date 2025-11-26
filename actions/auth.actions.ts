import { type Page, expect } from '@playwright/test';
import { step } from '../utils/step';
import { type Pages, createPages } from '../pages/pages';
import { RegistrationFormData } from '../utils/fakeuser'


export default class AuthActions {

    private pages: Pages;

    constructor(page: Page) {
        this.pages = createPages(page);
    }

    @step('Login via UI')
    public async login(formData: Partial<RegistrationFormData>): Promise<void> {
        if (formData.email) {
            await this.pages.loginPage.loginEmailInput.fill(formData.email);
        }
        if (formData.password) {
            await this.pages.loginPage.loginPasswordInput.fill(formData.password);
        }
        await this.pages.loginPage.loginButton.click();
    }

    @step('Signup via UI')
    public async signup(formData: Partial<RegistrationFormData>): Promise<void> {
        if (formData.name) {
            await this.pages.loginPage.signupNameInput.fill(formData.name);
        }
        if (formData.email) {
            await this.pages.loginPage.signupEmailInput.fill(formData.email);
        }
        await this.pages.loginPage.signupButton.click();
    }

    @step('Create account via UI')
    public async createAccount(formData: Partial<RegistrationFormData>, 
                        subscribeOffers: boolean = false, 
                        subscribeNews: boolean = false): Promise<void> {
        
        await this.signup(formData);
        await expect.soft(this.pages.signupPage.enterAccountInfoHeader).toBeVisible();
        
        if (formData.name) {
            await this.pages.signupPage.nameInput.fill(formData.name);
        }
        if (formData.password) {
            await this.pages.signupPage.passwordInput.fill(formData.password);
        }
        if (formData.birth_date) {
            await this.pages.signupPage.dayDropdown.selectOption(formData.birth_date)
        }
        if (formData.birth_month) {
            await this.pages.signupPage.monthDropdown.selectOption(formData.birth_month)
        }
        if (formData.birth_year) {
            await this.pages.signupPage.yearDropdown.selectOption(formData.birth_year)
        }
        if (formData.firstname) {
            await this.pages.signupPage.firstNameInput.fill(formData.firstname)
        }
        if (formData.lastname) {
            await this.pages.signupPage.lastNameInput.fill(formData.lastname)
        }
        if (formData.company) {
            await this.pages.signupPage.companyInput.fill(formData.company)
        }
        if (formData.address1) {
            await this.pages.signupPage.address1Input.fill(formData.address1)
        }
        if (formData.country) {
            await this.pages.signupPage.countryDropdown.selectOption(formData.country)
        }
        if (formData.state) {
            await this.pages.signupPage.stateInput.fill(formData.state)
        }
        if (formData.city) {
            await this.pages.signupPage.cityInput.fill(formData.city)
        }
        if (formData.zipcode) {
            await this.pages.signupPage.zipcodeInput.fill(formData.zipcode)
        }
        if (formData.mobile_number) {
            await this.pages.signupPage.mobileNumberInput.fill(formData.mobile_number)
        }
        if (subscribeNews) {
            await this.pages.signupPage.newsletterCheckbox.check();
        }
        if (subscribeOffers) {
            await this.pages.signupPage.offersCheckbox.check();
        }
        await this.pages.signupPage.createAccountButton.click();
        
        await expect.soft(this.pages.signupPage.accountCreatedHeader).toBeVisible();
        await this.pages.signupPage.continueButton.click();
    }

    @step('Logout via UI')
    public async logout(): Promise<void> {
        await this.pages.homePage.navBar.logoutButton.click();
    }

    @step('Delete Account')
    public async deleteAccount(): Promise<void> {
        await this.pages.navigationBar.deleteAccountButton.click();
        await expect.soft(this.pages.signupPage.accountDeletedHeader).toBeVisible();
        await this.pages.signupPage.continueButton.click();
    }
} 