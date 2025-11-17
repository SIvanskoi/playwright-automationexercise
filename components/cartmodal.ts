import { type Locator, type Page } from '@playwright/test';

export class CartModal {

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
}