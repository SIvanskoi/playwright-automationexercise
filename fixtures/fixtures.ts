import { test as base } from '@playwright/test';
import { LoginPage }  from '../pages/login.page';
import { SignupPage } from '../pages/signup.page';
import { NavigationBar } from '../pages/navbar'
import { HomePage } from '../pages/home.page';
import { ApiClient } from '../api/api.client';
import { ContactUsPage } from '../pages/contactus.page';
import { TestCasesPage } from '../pages/testcases.page';
import { Footer } from '../pages/footer';
import { ProductsPage } from '../pages/products.page';

type Fixtures = {
    apiClient: ApiClient;
    homePage: HomePage;
    loginPage: LoginPage;
    navigationBar: NavigationBar;
    signupPage: SignupPage;
    contactUsPage: ContactUsPage;
    testcasesPage: TestCasesPage;
    footer: Footer;
    productsPage: ProductsPage;
};

export const test = base.extend<Fixtures>({

    apiClient: async ({ request }, use) => {
        await use(new ApiClient(request));
    },

    homePage: async ({page}, use) => {
        await use(new HomePage(page));
    },    

    contactUsPage: async ({page}, use) => {
        await use(new ContactUsPage(page));
    },

    loginPage: async ( {page}, use) => {
        await use(new LoginPage(page));
    },

    navigationBar: async ({page}, use) => {
        await use(new NavigationBar(page));
    },

    signupPage: async ({page}, use) => {
        await use(new SignupPage(page));        
    },

    testcasesPage: async ({ page }, use) => {
        await use(new TestCasesPage(page));
    },

    footer: async ({ page }, use) => {
        await use(new Footer(page));
    },

    productsPage: async ({page}, use) => {
        await use(new ProductsPage(page));
    },   

});

export { expect } from '@playwright/test';