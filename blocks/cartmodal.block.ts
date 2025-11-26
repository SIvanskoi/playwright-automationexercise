import { type Locator, type Page } from '@playwright/test';
import { step } from '../utils/step';

export class CartModalBlock {

    readonly root: Locator;
    readonly continueShoppingButton: Locator;
    readonly viewCartLink: Locator;
    readonly registerLoginLink: Locator;

    constructor(readonly page: Page ) {

        this.root = this.page.locator('#cartModal').or(this.page.locator('#checkoutModal'));
        this.continueShoppingButton = this.root.getByRole('button', { name: 'Continue Shopping' });
        this.viewCartLink = this.root.getByRole('link', { name: 'View Cart' });
        this.registerLoginLink = this.root.getByRole('link', { name: 'Register / Login' });
    }

    @step('Close cart modal by continuing shopping')
    public async continueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
    }

    @step('Close cart modal by viewing cart')
    public async viewCart(): Promise<void> {
        await this.viewCartLink.click();
    }

    @step('Close cart modal by registering or logging in')
    public async registerOrLogin(): Promise<void> {
        await this.registerLoginLink.click();
    }
}