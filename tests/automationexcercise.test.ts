import { test, expect } from '../fixtures/fixtures';
import { RegistrationFormDataBuilder } from '../utils/fakeuser';


const validRegistrationData = new RegistrationFormDataBuilder()
    .withEmail(process.env.EMAIL!)
    .withPassword(process.env.PASSWORD!)
    .build()


test.describe('Automation Exercise - E2E - Signup / Login', () => {
    
    // Try to delete account after each test
    test.afterEach(async ({ apiClient }) => {
        await apiClient.deleteAccount(validRegistrationData);        
    });

    test.beforeEach(async ({homePage}) => {
        await homePage.open();
    });

    test('Test Case 1: Register User', {
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
            const json = await response.json()
            expect(json.responseCode).toBe(404)
        });
    });


    test('Test Case 2: Login User with correct email and password', {
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
            const json = await response.json()
            expect(json.responseCode).toBe(201)
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
            const json = await response.json()
            expect(json.responseCode).toBe(404)
        });
    });

});

/*
type User = {
    username: string;
    password: string;
};
*/
/*
 1. In an array print the second smallest and second largest element 
 
 4. Given an array {1,3,3,4,5,6,6,7,8,9,9} when user enters a search element, 
    the program should display the index number where the element is found. 
    If the element is repeated it should display all those indices. 
    If it is not present in the given array program should display "element not found"

*/
/*
test("JavaScript - Tutorial", () => {
    const formData = new RegistrationFormDataBuilder()
           .withFirstName('John')
           .withLastName('Doe')
           .withEmail(process.env.EMAIL!)
           .withPhoneNumber('555-0123')
           .withCity('New York')
           .withState('NY')
           .withPassword(process.env.PASSWORD!)
           .build();
    /*
    let user: User = { username: "user", password: "123456", }
    passwordCheck(user)
    
    let i = 0;
    
});
*/
/*
test("toJSON", () => {
   const formData = new RegistrationFormDataBuilder()
           .withFirstName('John')
           .withLastName('Doe')
           .withEmail('auto1.mindmanager@gmail.com')
           .withPhoneNumber('555-0123')
           .withCity('New York')
           .withState('NY')
           .withPassword('z3a!qrUD')
           .toJSON();
    let i = 0;
});

function passwordCheck(user: User) {
    if (user.password = "123456"){
        let randomPassword = Math.random().toString(36).slice(-16)
        user.password = randomPassword
    }
}

function createUser(username: string, password: string): User {
    const user: User = { username, password }
    return user
}
*/