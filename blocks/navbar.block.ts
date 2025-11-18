import { type Locator, type Page, expect } from '@playwright/test';


export class NavigationBarBlock {

    readonly root: Locator;
    readonly homeButton: Locator;
    readonly productsButton: Locator;
    readonly cartButton: Locator;
    readonly signupLoginButton: Locator;
    readonly logoutButton: Locator;
    readonly deleteAccountButton: Locator;
    readonly contactUsButton: Locator;
    readonly testCasesButton: Locator;


    constructor(readonly page: Page) {

        this.root = this.page.locator('//ul[contains(@class, "navbar-nav")]');
        
        this.homeButton = this.root.getByRole('link', { name: 'Home' });
        this.productsButton = this.root.getByRole('link', { name: 'Products' });
        this.cartButton = this.root.getByRole('link', { name: 'Cart' });
        this.signupLoginButton = this.root.getByRole('link', { name: 'Signup / Login' });
        this.logoutButton = this.root.getByRole('link', { name: 'Logout' });
        this.deleteAccountButton = this.root.getByRole('link', { name: 'Delete Account' });
        this.contactUsButton = this.root.getByRole('link', { name: 'Contact us' });
        this.testCasesButton = this.root.getByRole('link', { name: 'Test Cases' });
        
    }

    public async verifyLoggedInAs(userName: string): Promise<void> {
        await expect.soft( this.root.getByText(`Logged in as ${userName}`) ).toBeVisible();
    }

}