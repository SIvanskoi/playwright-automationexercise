import { test as base } from '@playwright/test';
import { LoginPage }  from '../pages/login.page';
import { SignupPage } from '../pages/signup.page';
import { HomePage } from '../pages/home.page';
import { ApiClient } from '../api/api.client';
import { ContactUsPage } from '../pages/contactus.page';
import { TestCasesPage } from '../pages/testcases.page';
import { ProductsPage, ProductDetailsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';

type Fixtures = {
    apiClient: ApiClient;
    homePage: HomePage;
    loginPage: LoginPage;
    signupPage: SignupPage;
    contactUsPage: ContactUsPage;
    testcasesPage: TestCasesPage;
    productsPage: ProductsPage;
    productDetailsPage: ProductDetailsPage;
    cartPage: CartPage;
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

    signupPage: async ({page}, use) => {
        await use(new SignupPage(page));        
    },

    testcasesPage: async ({ page }, use) => {
        await use(new TestCasesPage(page));
    },

    productsPage: async ({page}, use) => {
        await use(new ProductsPage(page));
    },

    productDetailsPage: async ({page}, use) => {
        await use(new ProductDetailsPage(page));
    },

    cartPage: async ({page}, use) => {
        await use(new CartPage(page));
    }, 

});

export { expect } from '@playwright/test';