import { test as base} from '@playwright/test';
import { Pages } from '../pages/pages';
import { LoginPage }  from '../pages/login.page';
import { SignupPage } from '../pages/signup.page';
import { HomePage } from '../pages/home.page';
import { ApiClient } from '../api/api.client';
import { ContactUsPage } from '../pages/contactus.page';
import { TestCasesPage } from '../pages/testcases.page';
import { ProductsPage, ProductDetailsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { ConsoleErrorReader } from '../utils/consolereader';
import { Action, createActions } from '../actions/actions';

type API = {
    apiClient: ApiClient;
};

// Experimental: Fixture-option for logging console errors
type ConsoleErrorLogger = { 
    consoleErrorReader: ConsoleErrorReader;
};

export type ConsoleErrorLoggerOptions = {
    failTestOnConsoleError: boolean;
};

export const test = base.extend<Pages & ConsoleErrorLogger & ConsoleErrorLoggerOptions & API & Action>({

    failTestOnConsoleError: [true, { option: true }],

    apiClient: async ({ request }, use) => {
        await use(new ApiClient(request));
    },

    homePage: async ({page}, use) => {
        const homePage = new HomePage(page)
        await homePage.open();
        await use(homePage);
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

    
    action: async ({ page }, use) => {
        await use(createActions(page));
    },

    consoleErrorReader: [async ({ page, failTestOnConsoleError}, use, testInfo) => {
            const reader = new ConsoleErrorReader(page, testInfo, failTestOnConsoleError);
            await use(reader);
            reader.postErrors();
        }, 
        { scope: 'test', auto: true }
    ],

    /*
    consoleErrorReader: [
        async ({page}, use, testInfo) => {
            const consoleErrors: string[] = [];
            page.on("console", (msg) => {
                if (msg.type() === "error") {
                    const errorText = msg.text();
                    consoleErrors.push(errorText);
                    //console.error(`Caught console error ${errorText}`); Logs messages in Attachments ->stderr section. Not needed.
                }
            });
            await use(); // Run the test
            // After test
            // Attach errors to the report if any
            if (consoleErrors.length > 0) {
                await testInfo.attach('Console Errors', {
                    body: consoleErrors.join('\n'),
                    contentType: 'text/plain',
                });
            }
            testInfo.fail(consoleErrors.length !== 0, 'Found errors in console');
            //expect(consoleErrors.length, `Found errors in console ${consoleErrors.join()}`).toBe(0)
        },
        {scope: "test", auto: true}
    ],
    */

});

export { expect } from '@playwright/test';