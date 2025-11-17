import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { RegistrationFormData } from '../utils/fakeuser'

export class LoginPage extends BasePage {

    // Login Form Elements
    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly loginButton: Locator;
    readonly loginYourAccountHeader: Locator;
    readonly loginIncorrectCredentials: Locator;

    // Signup Form Elements
    readonly signupHeader: Locator;
    readonly signupNameInput: Locator;
    readonly signupEmailInput: Locator;
    readonly signupButton: Locator;
    readonly signupExistingCredentials: Locator;

    constructor(page: Page) {
        super(page);
    
        this.url = '/login'

        // Login form locators
        this.loginEmailInput = this.page.getByTestId('login-email');
        this.loginPasswordInput = this.page.getByTestId('login-password');
        this.loginButton = this.page.getByTestId('login-button');
        this.loginYourAccountHeader = this.page.getByRole('heading', { name: 'Login to your account', exact: true })
        this.loginIncorrectCredentials = this.page.getByText('Your email or password is incorrect!', { exact: true })

        // Signup form locators
        this.signupHeader = this.page.getByRole('heading', { name: 'New User Signup!', exact: true })
        this.signupNameInput = this.page.getByTestId('signup-name');
        this.signupEmailInput = this.page.getByTestId('signup-email');
        this.signupButton = this.page.getByTestId('signup-button');
        this.signupExistingCredentials = this.page.getByText('Email Address already exist!')

        this.title = /Signup \/ Login/
        
    }

    public async login(formData: Partial<RegistrationFormData>): Promise<void> {
        if (formData.email) {
            await this.loginEmailInput.fill(formData.email);
        }
        if (formData.password) {
            await this.loginPasswordInput.fill(formData.password);
        }
        await this.loginButton.click();
    }

    public async signup(formData: Partial<RegistrationFormData>): Promise<void> {
        if (formData.name) {
            await this.signupNameInput.fill(formData.name);
        }
        if (formData.email) {
            await this.signupEmailInput.fill(formData.email);
        }
        await this.signupButton.click();
    }
}