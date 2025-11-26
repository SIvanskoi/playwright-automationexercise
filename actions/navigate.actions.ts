import { type Page } from '@playwright/test';
import { step } from '../utils/step';
import { type Pages, createPages } from '../pages/pages';


export default class NavigateActions {

    private pages: Pages;

    constructor(page: Page) {
        this.pages = createPages(page);
    }

    @step('Navigate to Home page')
    public async toHomePage(): Promise<void> {
        await this.pages.navigationBar.homeButton.click();
    }

    @step('Open Home page')
    public async openHomePage(): Promise<void> {
        await this.pages.homePage.open();
    }

    @step('Navigate to Products page')
    public async toProductsPage(): Promise<void> {
        await this.pages.navigationBar.productsButton.click();
    }

    @step('Navigate to Contact Us page')
    public async toContactUsPage(): Promise<void> {
        await this.pages.navigationBar.contactUsButton.click();
    }

    @step('Navigate to Cart page')
    public async toCartPage(): Promise<void> {
        await this.pages.navigationBar.cartButton.click();
    }

    @step('Navigate to Signup / Login page')
    public async toSignupLoginPage(): Promise<void> {
        await this.pages.navigationBar.signupLoginButton.click();
    }

    @step('Navigate to Test Cases page')
    public async toTestCasesPage(): Promise<void> {
        await this.pages.navigationBar.testCasesButton.click();
    }
}