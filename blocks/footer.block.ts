import { Locator, Page } from '@playwright/test';

export class FooterBlock {

    readonly root: Locator;

    readonly emailInput: Locator;
    readonly submitButton: Locator;
    readonly subscriptionHeading: Locator;
    readonly subscibeSuccess: Locator;

    constructor(readonly page: Page) {

        this.root = this.page.locator('//footer[@id="footer"]')
        this.emailInput = this.root.locator('//input[@type="email"]')
        this.submitButton = this.root.locator('//button[@type="submit"]')
        this.subscibeSuccess = this.root.filter({hasText : 'You have been successfully subscribed!'})
        this.subscriptionHeading = this.root.filter({hasText : 'Subscription'})
    }
}