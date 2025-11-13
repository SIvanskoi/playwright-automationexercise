import { test, expect } from '../fixtures/fixtures';
import { RegistrationFormDataBuilder} from '../utils/fakeuser';
import { verifyResponse } from '../api/api.client'
import path from 'path';
import fs from 'fs';



const validRegistrationData = new RegistrationFormDataBuilder()
    .withEmail(process.env.AE_EMAIL!)
    .withPassword(process.env.AE_PASSWORD!)
    .build()


test.describe('Automation Exercise - E2E - Signup / Login', () => {
    
    // Delete existing account after each test
    test.afterEach(async ({ apiClient }) => {
        await apiClient.deleteAccount(validRegistrationData);        
    });

    test.beforeEach(async ({homePage}) => {
        await homePage.open();
    });

    test('Test Case 1: Register new user', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-001",
        }
    }, async ({homePage, loginPage, signupPage, navigationBar, apiClient}) => {
        /*
        Steps
        1.  Launch browser
        2.  Navigate to url {{base_url}}
        3.  Verify that home page is visible successfully
        4.  Click on 'Signup / Login' button
        5.  Verify 'New User Signup!' is visible
        6.  Enter name and email address
        7.  Click 'Signup' button
        8.  Verify that 'ENTER ACCOUNT INFORMATION' is visible
        9.  Fill details: Title, Name, Email, Password, Date of birth
        10. Select checkbox 'Sign up for our newsletter!'
        11. Select checkbox 'Receive special offers from our partners!'
        12. Fill details: First name, Last name, Company, Address, Country, State, City, Zipcode, Mobile Number
        13. Click 'Create Account button'
        14. Verify that 'ACCOUNT CREATED!' is visible
        15. Click 'Continue' button
        16. Verify that 'Logged in as {{username}}' is visible
        17. Click 'Delete Account' button
        18. Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
        */
        
        await test.step('Act', async () => {
            await expect.soft(homePage.automationExcerciseHeading).toBeVisible();
            await navigationBar.signupLoginButton.click();
            await expect.soft(loginPage.signupHeader).toBeVisible();
            await loginPage.signup(validRegistrationData);
            await expect.soft(signupPage.enterAccountInfoHeader).toBeVisible();
            await signupPage.newsletterCheckbox.check();
            await signupPage.offersCheckbox.check();
            await signupPage.createAccount(validRegistrationData);
            await expect.soft(signupPage.accountCreatedHeader).toBeVisible();
            await signupPage.continueButton.click();
            await expect.soft(navigationBar.page.getByText(`Logged in as ${validRegistrationData.name}`)).toBeVisible();
            await navigationBar.deleteAccountButton.click();
            await expect.soft(signupPage.accountDeletedHeader).toBeVisible();
            await signupPage.continueButton.click();
        });

        await test.step('Assert', async () => {
            const response = await apiClient.getUserDetails(validRegistrationData)
            verifyResponse(response, 404)
        });
    });


    test('Test Case 2: Login user with correct email and password', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-002",
        }
    }, async ({homePage, loginPage, signupPage, navigationBar, apiClient}) => {
        /*
        Steps
        1.  Launch browser
        2.  Navigate to url {{base_url}}
        3.  Verify that home page is visible successfully
        4.  Click on 'Signup / Login' button
        5.  Verify 'Login to your account' is visible
        6.  Enter correct email address and password
        7.  Click 'login' button
        8.  Verify that 'Logged in as username' is visible
        9.  Click 'Delete Account' button
        10. Verify that 'ACCOUNT DELETED!' is visible
        */
        await test.step('Arrange', async () => {
            const response = await apiClient.createAccount(validRegistrationData);
            verifyResponse(response, 201, 'User created!')
        });

        await test.step('Act', async () => {
            await expect.soft(homePage.automationExcerciseHeading).toBeVisible();
            await navigationBar.signupLoginButton.click();
            await expect.soft(loginPage.loginYourAccountHeader).toBeVisible();
            await loginPage.login(validRegistrationData);
            await expect.soft(navigationBar.page.getByText(`Logged in as ${validRegistrationData.name}`)).toBeVisible();
            await navigationBar.deleteAccountButton.click();
            await expect.soft(signupPage.accountDeletedHeader).toBeVisible();
            await signupPage.continueButton.click();
        });

        await test.step('Assert', async () => {
            const response = await apiClient.getUserDetails(validRegistrationData)
            verifyResponse(response, 404)
        });
    });

    test('Test Case 3: Login user with incorrect email and password', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-003",
        }
    }, async ({homePage, loginPage, navigationBar}) => {
        /*
        Steps
        1. Launch browser
        2. Navigate to url {{base_url}}
        3. Verify that home page is visible successfully
        4. Click on 'Signup / Login' button
        5. Verify 'Login to your account' is visible
        6. Enter incorrect email address and password
        7. Click 'login' button
        8. Verify error 'Your email or password is incorrect!' is visible
        */
        const invalidRegistrationData = new RegistrationFormDataBuilder()
            .build()
        await expect.soft(homePage.automationExcerciseHeading).toBeVisible();
        await navigationBar.signupLoginButton.click();
        await expect.soft(loginPage.loginYourAccountHeader).toBeVisible();
        await loginPage.login(invalidRegistrationData);
        await expect(loginPage.loginIncorrectCredentials).toBeVisible();
    });


    test('Test Case 4: Logout user', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-004",
        }
    }, async ({homePage, loginPage, navigationBar, apiClient}) => {
        /*
        Steps
        1.  Launch browser
        2.  Navigate to url {{base_url}}
        3.  Verify that home page is visible successfully
        4.  Click on 'Signup / Login' button
        5.  Verify 'Login to your account' is visible
        6.  Enter correct email address and password
        7.  Click 'login' button
        8.  Verify that 'Logged in as username' is visible
        9.  Click 'Logout' button
        10. Verify that user is navigated to login page
        */
        await test.step('Arrange', async () => {
            const response = await apiClient.createAccount(validRegistrationData);
            verifyResponse(response, 201, 'User created!')
        });

        await test.step('Act', async () => {
            await expect.soft(homePage.automationExcerciseHeading).toBeVisible();
            await navigationBar.signupLoginButton.click();
            await expect.soft(loginPage.loginYourAccountHeader).toBeVisible();
            await loginPage.login(validRegistrationData);
            await expect.soft(navigationBar.page.getByText(`Logged in as ${validRegistrationData.name}`)).toBeVisible();
            await navigationBar.logoutButton.click();
            await expect.soft(loginPage.loginYourAccountHeader).toBeVisible();
        });

        await test.step('Assert', async () => {
            const response = await apiClient.getUserDetails(validRegistrationData)
            verifyResponse(response, 200)
        });
    });


    test('Test Case 5: Register user with existing email', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-005",
        }
    }, async ({homePage, loginPage, navigationBar, apiClient}) => {
        /*
        Steps
        1.  Launch browser
        2.  Navigate to url {{base_url}}
        3.  Verify that home page is visible successfully
        4.  Click on 'Signup / Login' button
        5.  Verify 'New User Signup!' is visible
        6.  Enter name and already registered email address
        7.  Click 'Signup' button
        8.  Verify error 'Email Address already exist!' is visible
        */
        await test.step('Arrange', async () => {
            const response = await apiClient.createAccount(validRegistrationData);
            verifyResponse(response, 201, 'User created!')
        });

        await test.step('Act', async () => {
            await expect.soft(homePage.automationExcerciseHeading).toBeVisible();
            await navigationBar.signupLoginButton.click();
            await expect.soft(loginPage.signupHeader).toBeVisible();
            await loginPage.signup(validRegistrationData);
        });

        await test.step('Assert', async () => {
            await expect(loginPage.signupExistingCredentials).toBeVisible();
        });

    });

});


test.describe('Automation Exercise - E2E - Pages', () => {

    test.beforeEach(async ({homePage}) => {
        await homePage.open();
    });

    test('Test Case 6: Contact Us Form', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-006",
        }
    }, async ({homePage, navigationBar, contactUsPage}) => {
        /*
        Steps
        1.  Launch browser
        2.  Navigate to url {{base_url}}
        3.  Verify that home page is visible successfully
        4.  Click on 'Contact Us' button
        5.  Verify 'GET IN TOUCH' is visible
        6.  Enter name, email, subject and message
        7.  Upload file
        8.  Click 'Submit' button
        9.  Click OK button
        10. Verify success message 'Success! Your details have been submitted successfully.' is visible
        11. Click 'Home' button and verify that landed to home page successfully
        */

        const filePath = path.join(__dirname, 'output.tmp');
        const message = 'Hello from TypeScript!';

        await test.step('Arrange', async () => {    
            fs.writeFileSync(filePath, message, 'utf8');
        });

        await test.step('Act', async () => {
            await expect.soft(homePage.automationExcerciseHeading).toBeVisible();
            await navigationBar.contactUsButton.click();
            await expect(contactUsPage.getInTouchHeading).toBeVisible();
            await contactUsPage.submitContactUsForm(validRegistrationData, message, message, filePath)
            await expect.soft(contactUsPage.submitStatus).toBeVisible()
            await contactUsPage.homeButton.click()
        });

        await test.step('Assert', async () => {
            await expect(homePage.automationExcerciseHeading).toBeVisible();
        });

    });


});




