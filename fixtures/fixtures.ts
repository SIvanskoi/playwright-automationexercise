import { test as base} from '@playwright/test';
import { LoginPage }  from '../pages/login.page';
import { SignupPage } from '../pages/signup.page';
import { HomePage } from '../pages/home.page';
import { ApiClient } from '../api/api.client';
import { ContactUsPage } from '../pages/contactus.page';
import { TestCasesPage } from '../pages/testcases.page';
import { ProductsPage, ProductDetailsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';


type API = {
    apiClient: ApiClient;
};


type Pages = {
    
    homePage: HomePage;
    loginPage: LoginPage;
    signupPage: SignupPage;
    contactUsPage: ContactUsPage;
    testcasesPage: TestCasesPage;
    productsPage: ProductsPage;
    productDetailsPage: ProductDetailsPage;
    cartPage: CartPage;
    consoleErrorReader: void;
};

export const test = base.extend<Pages & API>({

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

    consoleErrorReader: [
        async ({page}, use, testInfo) => {
            const consoleErrors: string[] = [];
            page.on("console", (msg) => {
                if (msg.type() === "error") {
                    const errorText = msg.text();
                    consoleErrors.push(errorText);
                    console.error(`Caught console error ${errorText}`);
                }
            });
            await use();
            // After test
            // Attach errors to the report if any
            if (consoleErrors.length > 0) {
                await testInfo.attach('Console Errors', {
                    body: consoleErrors.join('\n'),
                    contentType: 'text/plain',
                });
            }
            testInfo.fail(consoleErrors.length !== 0, `Found errors in console ${consoleErrors.join()}`);
            //expect(consoleErrors.length, `Found errors in console ${consoleErrors.join()}`).toBe(0)
        },
        {scope: "test", auto: true}
    ],

});

export { expect } from '@playwright/test';