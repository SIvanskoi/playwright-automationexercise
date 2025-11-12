import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';


export class NavigationBar extends BasePage {

    readonly homeButton: Locator;
    readonly productsButton: Locator;
    readonly cartButton: Locator;
    readonly signupLoginButton: Locator;
    readonly logoutButton: Locator;
    readonly deleteAccountButton: Locator;

    constructor(page: Page) {
        super(page)

        this.homeButton = this.page.getByRole('link', { name: 'Home' });
        this.productsButton = this.page.getByRole('link', { name: 'Products' });
        this.cartButton = this.page.getByRole('link', { name: 'Cart' });
        this.signupLoginButton = this.page.getByRole('link', { name: 'Signup / Login' })
        this.logoutButton = this.page.getByRole('link', { name: 'Logout' })
        this.deleteAccountButton = this.page.getByRole('link', { name: 'Delete Account' })
    }

}