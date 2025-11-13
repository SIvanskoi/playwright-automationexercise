import { test as base } from '@playwright/test';
import { LoginPage }  from '../pages/login.page';
import { SignupPage } from '../pages/signup.page';
import { NavigationBar } from '../pages/navbar'
import { HomePage } from '../pages/home.page';
import { ApiClient } from '../api/api.client';
import { ContactUsPage } from '../pages/contactus.page';

type Fixtures = {
    apiClient: ApiClient;
    homePage: HomePage;
    loginPage: LoginPage;
    navigationBar: NavigationBar;
    signupPage: SignupPage;
    contactUsPage: ContactUsPage;
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

});

export { expect } from '@playwright/test';