import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';


export class NavigationBar extends BasePage {

    readonly navBar: Locator;
    readonly homeButton: Locator;
    readonly productsButton: Locator;
    readonly cartButton: Locator;
    readonly signupLoginButton: Locator;
    readonly logoutButton: Locator;
    readonly deleteAccountButton: Locator;
    readonly contactUsButton: Locator;
    readonly testCasesButton: Locator;


    constructor(page: Page) {
        super(page)

        this.navBar = this.page.locator('//ul[contains(@class, "navbar-nav")]')
        
        this.homeButton = this.navBar.getByRole('link', { name: 'Home' });
        this.productsButton = this.navBar.getByRole('link', { name: 'Products' });
        this.cartButton = this.navBar.getByRole('link', { name: 'Cart' });
        this.signupLoginButton = this.navBar.getByRole('link', { name: 'Signup / Login' });
        this.logoutButton = this.navBar.getByRole('link', { name: 'Logout' });
        this.deleteAccountButton = this.navBar.getByRole('link', { name: 'Delete Account' });
        this.contactUsButton = this.navBar.getByRole('link', { name: 'Contact us' });
        this.testCasesButton = this.navBar.getByRole('link', { name: 'Test Cases' });
        
    }

}