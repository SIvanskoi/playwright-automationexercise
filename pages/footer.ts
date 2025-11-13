import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class Footer extends BasePage {

    readonly footer: Locator;

    readonly emailInput: Locator;
    readonly submitButton: Locator;
    readonly subscriptionHeading: Locator;
    readonly subscibeSuccess: Locator;

    constructor(page: Page) {
        super(page)

        this.footer = this.page.locator('//footer[@id="footer"]')
        this.emailInput = this.footer.locator('//input[@type="email"]')
        this.submitButton = this.footer.locator('//button[@type="submit"]')
        this.subscibeSuccess = this.footer.filter({hasText : 'You have been successfully subscribed!'})
        this.subscriptionHeading = this.footer.filter({hasText : 'Subscription'})
    }
}