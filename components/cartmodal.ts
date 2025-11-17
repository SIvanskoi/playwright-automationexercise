import { Locator, Page } from '@playwright/test';

export class CartModal {

    readonly root: Locator;
    readonly continueShoppingButton: Locator;
    readonly viewCartLink: Locator;

    constructor(readonly page: Page ) {

        this.root = this.page.locator('#cartModal');
        this.continueShoppingButton = this.root.getByRole('button', { name: 'Continue Shopping' })
        this.viewCartLink = this.root.getByRole('link', { name: 'View Cart' })
    }
}