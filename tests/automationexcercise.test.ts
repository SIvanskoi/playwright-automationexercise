import { test, expect } from '../fixtures/fixtures';
import { RegistrationFormDataBuilder} from '../utils/fakeuser';
import { PaymentDataBuilder } from '../utils/fakecard';
import { verifyResponse } from '../api/api.client'
import apiendpoints from '../utils/apiendpoints';
import apimessages from '../utils/apimessages'
import path from 'path';
import fs from 'fs';


const validRegistrationData = new RegistrationFormDataBuilder()
    .withEmail(process.env.AE_EMAIL!)
    .withPassword(process.env.AE_PASSWORD!)
    .build()

    
test.beforeEach(async ({homePage}) => {
        await homePage.open();
    });

test.describe('Automation Exercise - E2E - Signup / Login', () => {
    
    // Delete existing account after each test
    test.afterEach(async ({ apiClient }) => {
        await apiClient.delete(apiendpoints.account.delete, validRegistrationData);        
    });


    test('Test Case 1: Register new user', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-001",
        }
    }, async ({homePage, loginPage, signupPage, apiClient}) => {
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
            await homePage.navBar.signupLoginButton.click();
            await expect.soft(loginPage.signupHeader).toBeVisible();
            await loginPage.signup(validRegistrationData);
            await expect.soft(signupPage.enterAccountInfoHeader).toBeVisible();
            await signupPage.newsletterCheckbox.check();
            await signupPage.offersCheckbox.check();
            await signupPage.createAccount(validRegistrationData);
            await expect.soft(signupPage.accountCreatedHeader).toBeVisible();
            await signupPage.continueButton.click();
            await signupPage.navBar.verifyLoggedInAs(validRegistrationData.name!)
            await signupPage.navBar.deleteAccountButton.click();
            await expect.soft(signupPage.accountDeletedHeader).toBeVisible();
            await signupPage.continueButton.click();
        });

        await test.step('Assert', async () => {
            const response = await apiClient.get(apiendpoints.account.get, validRegistrationData)
            verifyResponse(response, 404)
        });
    });


    test('Test Case 2: Login user with correct email and password', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-002",
        }
    }, async ({homePage, loginPage, signupPage, apiClient}) => {
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
            const response = await apiClient.post(apiendpoints.account.create, validRegistrationData);
            verifyResponse(response, 201, apimessages.account.created)
        });

        await test.step('Act', async () => {
            await expect.soft(homePage.automationExcerciseHeading).toBeVisible();
            await homePage.navBar.signupLoginButton.click();
            await expect.soft(loginPage.loginYourAccountHeader).toBeVisible();
            await loginPage.login(validRegistrationData);
            await signupPage.navBar.verifyLoggedInAs(validRegistrationData.name!)
            await signupPage.navBar.deleteAccountButton.click();
            await expect.soft(signupPage.accountDeletedHeader).toBeVisible();
            await signupPage.continueButton.click();
        });

        await test.step('Assert', async () => {
            const response = await apiClient.get(apiendpoints.account.get, validRegistrationData)
            verifyResponse(response, 404)
        });
    });

    test('Test Case 3: Login user with incorrect email and password', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-003",
        }
    }, async ({homePage, loginPage}) => {
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
        await homePage.navBar.signupLoginButton.click();
        await expect.soft(loginPage.loginYourAccountHeader).toBeVisible();
        await loginPage.login(invalidRegistrationData);
        await expect(loginPage.loginIncorrectCredentials).toBeVisible();
    });


    test('Test Case 4: Logout user', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-004",
        }
    }, async ({homePage, loginPage, apiClient}) => {
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
            const response = await apiClient.post(apiendpoints.account.create, validRegistrationData);
            verifyResponse(response, 201, apimessages.account.created)
        });

        await test.step('Act', async () => {
            await expect.soft(homePage.automationExcerciseHeading).toBeVisible();
            await homePage.navBar.signupLoginButton.click();
            await expect.soft(loginPage.loginYourAccountHeader).toBeVisible();
            await loginPage.login(validRegistrationData);
            await homePage.navBar.verifyLoggedInAs(validRegistrationData.name!)
            await homePage.navBar.logoutButton.click();
            await expect.soft(loginPage.loginYourAccountHeader).toBeVisible();
        });

        await test.step('Assert', async () => {
            const response = await apiClient.get(apiendpoints.account.get, validRegistrationData)
            verifyResponse(response, 200)
        });
    });


    test('Test Case 5: Register user with existing email', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-005",
        }
    }, async ({homePage, loginPage, apiClient}) => {
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
            const response = await apiClient.post(apiendpoints.account.create, validRegistrationData);
            verifyResponse(response, 201, apimessages.account.created)
        });

        await test.step('Act', async () => {
            await expect.soft(homePage.automationExcerciseHeading).toBeVisible();
            await homePage.navBar.signupLoginButton.click();
            await expect.soft(loginPage.signupHeader).toBeVisible();
            await loginPage.signup(validRegistrationData);
        });

        await test.step('Assert', async () => {
            await expect(loginPage.signupExistingCredentials).toBeVisible();
        });

    });

});


test.describe('Automation Exercise - E2E - Pages', () => {

    test('Test Case 6: Contact Us Form', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-006",
        }
    }, async ({homePage, contactUsPage}) => {
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
            await homePage.navBar.contactUsButton.click();
            await expect(contactUsPage.getInTouchHeading).toBeVisible();
            await contactUsPage.submitContactUsForm(validRegistrationData, message, message, filePath);
            await expect.soft(contactUsPage.submitStatus).toBeVisible();
            await contactUsPage.homeButton.click();
        });

        await test.step('Assert', async () => {
            await expect(homePage.automationExcerciseHeading).toBeVisible();
        });

    });


    test('Test Case 7: Verify Test Cases Page', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-007",
        }
    }, async ({homePage, testcasesPage}) => {
        /*
        Steps
        1. Launch browser
        2. Navigate to url {{base_url}}
        3. Verify that home page is visible successfully
        4. Click on 'Test Cases' button
        5. Verify user is navigated to test cases page successfully
        */
        await expect.soft(homePage.automationExcerciseHeading).toBeVisible();
        await homePage.navBar.testCasesButton.click();
        const count = await testcasesPage.testcaseHeading.count();
        expect(count).toBe(26);
    });


    test('Test Case 10: Verify Subscription in Home page', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-010",
        }
    }, async ({homePage}) => {
        /*
        Steps
        1. Launch browser
        2. Navigate to url {{base_url}}
        3. Verify that home page is visible successfully
        4. Scroll down to footer
        5. Verify text 'SUBSCRIPTION'
        6. Enter email address in input and click arrow button
        7. Verify success message 'You have been successfully subscribed!' is visible
        */
        await expect.soft(homePage.automationExcerciseHeading).toBeVisible();
        await expect.soft(homePage.footer.subscriptionHeading).toBeVisible();
        await homePage.footer.emailInput.fill(validRegistrationData.email!);
        await homePage.footer.submitButton.click();
        await expect(homePage.footer.subscibeSuccess).toBeVisible();
    });

    test('Test Case 11: Verify Subscription in Cart page', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-011",
        }
    }, async ({homePage}) => {
        /*
        Steps
        1. Launch browser
        2. Navigate to url {{base_url}}
        3. Verify that home page is visible successfully
        4. Click 'Cart' button
        5. Scroll down to footer
        6. Verify text 'SUBSCRIPTION'
        7. Enter email address in input and click arrow button
        8. Verify success message 'You have been successfully subscribed!' is visible
        */
        await expect.soft(homePage.automationExcerciseHeading).toBeVisible();
        await homePage.navBar.cartButton.click();
        await expect.soft(homePage.footer.subscriptionHeading).toBeVisible();
        await homePage.footer.emailInput.fill(validRegistrationData.email!);
        await homePage.footer.submitButton.click()
        await expect(homePage.footer.subscibeSuccess).toBeVisible();
    });

});

test.describe('Automation Exercise - E2E - Product', () => {

    // Delete existing account after each test
    test.afterEach(async ({ apiClient }) => {
        await apiClient.delete(apiendpoints.account.delete, validRegistrationData);        
    });

    test('Test Case 8: Verify All Products and product details page', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-008",
        }
    }, async ({homePage, productsPage, productDetailsPage}) => {
        /*
        Steps
        1. Launch browser
        2. Navigate to url {{base_url}}
        3. Verify that home page is visible successfully
        4. Click on 'Products' button
        5. Verify user is navigated to ALL PRODUCTS page successfully
        6. The products list is visible
        7. Click on 'View Product' of first product
        8. User is landed to product detail page
        9. Verify that detail detail is visible: product name, category, price, availability, condition, brand
        */
        await test.step('Act', async () => {
            await expect.soft(homePage.automationExcerciseHeading).toBeVisible();
            await homePage.navBar.productsButton.click();
            await expect.soft(productsPage.allProductsHeading).toBeVisible();
        });
        
        await test.step('Assert', async () => {
            const productCard = await productsPage.getProductCardByIndex(0)
            await productCard.viewProduct()

            expect.soft(productDetailsPage.productAvailability).toContainText('In Stock');
            expect.soft(productDetailsPage.productBrand).toContainText('Polo');
            expect.soft(productDetailsPage.productCategory).toContainText('Women > Tops');
            expect.soft(productDetailsPage.productName).toContainText('Blue Top');
            expect.soft(productDetailsPage.productPrice).toContainText('Rs. 500');
        });
    });

    test('Test Case 9: Search Product', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-009",
        }
    }, async ({homePage, productsPage}) => {
        /*
        Steps
        1. Launch browser
        2. Navigate to url {{base_url}}
        3. Verify that home page is visible successfully
        4. Click on 'Products' button
        5. Verify user is navigated to ALL PRODUCTS page successfully
        6. Enter product name in search input and click search button
        7. Verify 'SEARCHED PRODUCTS' is visible
        8. Verify all the products related to search are visible
        */
        await test.step('Act', async () => {
            await expect.soft(homePage.automationExcerciseHeading).toBeVisible();
            await homePage.navBar.productsButton.click();
            await expect.soft(productsPage.allProductsHeading).toBeVisible();
            await productsPage.searchProduct('dress')
        });

        await test.step('Assert', async () => {
            const cardCollection = await productsPage.getAllProductCards();
            expect.soft(cardCollection.length).toBe(9);
            for (const card of cardCollection) {
                await expect.soft(card.productInfo, `Product ${card.getName()} is not visible`).toBeVisible();
            } 
        });
    });


    test('Test Case 12: Add Products to Cart', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-012",
        }
    }, async ({homePage, productsPage, cartPage}) => {
        /*
        Steps
        1.  Launch browser
        2.  Navigate to url {{base_url}}
        3.  Verify that home page is visible successfully
        4.  Click on 'Products' button
        5.  Hover over first product and click 'Add to cart'
        6.  Click 'Continue Shopping' button
        7.  Hover over second product and click 'Add to cart'
        8.  Click 'View Cart' button
        9.  Verify both products are added to Cart
        10. Verify their prices, quantity and total price
        */
        await test.step('Add products in cart', async () => {
            await expect.soft(homePage.automationExcerciseHeading).toBeVisible();
            await homePage.navBar.productsButton.click();
            await expect.soft(productsPage.allProductsHeading).toBeVisible();
            const card0 = await productsPage.getProductCardByIndex(0);
            await card0.addToCartFromOverlay();
            await productsPage.cartModal.continueShoppingButton.click()
            const card1 = await productsPage.getProductCardByIndex(1);
            await card1.addToCartFromOverlay();
            await productsPage.cartModal.viewCartLink.click();
        });

        await test.step('Verify cart', async () => {
            const expectedCart = [
                ['Blue Top', 'Rs. 500', '1', 'Rs. 500'],
                ['Men Tshirt', 'Rs. 400', '1', 'Rs. 400']
            ];
            await cartPage.verifyCart(expectedCart);
        });
    });

    test('Test Case 13: Verify Product quantity in Cart', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-012",
        }
    }, async ({homePage, productsPage, productDetailsPage, cartPage}) => {
        /*
        Steps
        1. Launch browser
        2. Navigate to url {{base_url}}
        3. Verify that home page is visible successfully
        4. Click 'View Product' for any product on home page
        5. Verify product detail is opened
        6. Increase quantity to 4
        7. Click 'Add to cart' button
        8. Click 'View Cart' button
        9. Verify that product is displayed in cart page with exact quantity
        */
        await test.step('Add products to cart', async () => {
            await expect.soft(homePage.automationExcerciseHeading).toBeVisible();
            (await productsPage.getProductCardByIndex(0)).viewProduct()
            await productDetailsPage.addToCart('4');
            await productsPage.cartModal.viewCartLink.click();
        });

        await test.step('Verify cart', async () => {
            const expectedCart = [
                ['Blue Top', 'Rs. 500', '4', 'Rs. 2000']
            ];
            await cartPage.verifyCart(expectedCart);
        });

    });

    test('Test Case 14: Place Order: Register while Checkout', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-014",
        }
    }, async ({homePage, productsPage, cartPage, loginPage, signupPage}) => {
        /*
        Steps
        1.  Launch browser
        2.  Navigate to url {{base_url}}
        3.  Verify that home page is visible successfully
        4.  Add products to cart
        5.  Click 'Cart' button
        6.  Verify that cart page is displayed
        7.  Click Proceed To Checkout
        8.  Click 'Register / Login' button
        9.  Fill all details in Signup and create account
        10. Verify 'ACCOUNT CREATED!' and click 'Continue' button
        11. Verify 'Logged in as username' at top
        12. Click 'Cart' button
        13. Click 'Proceed To Checkout' button
        14. Verify Address Details and Review Your Order
        15. Enter description in comment text area and click 'Place Order'
        16. Enter payment details: Name on Card, Card Number, CVC, Expiration date
        17. Click 'Pay and Confirm Order' button
        18. Verify success message 'Your order has been placed successfully!'
        19. Click 'Delete Account' button
        20. Verify 'ACCOUNT DELETED!' and click 'Continue' button
        */
        await test.step('Add products in cart', async () => {
            await expect.soft(homePage.automationExcerciseHeading).toBeVisible();
            const card0 = await productsPage.getProductCardByIndex(0);
            await card0.addToCart();
            await productsPage.cartModal.continueShoppingButton.click();
            const card1 = await productsPage.getProductCardByIndex(1);
            await card1.addToCart();
            await productsPage.cartModal.continueShoppingButton.click();
            await homePage.navBar.cartButton.click();
            await cartPage.proceedToCheckoutButton.click()
            await cartPage.cartModal.registerLoginLink.click()
        });

        await test.step('Register and login', async () => {
            await loginPage.signup(validRegistrationData);
            await signupPage.createAccount(validRegistrationData);
            await expect.soft(signupPage.accountCreatedHeader).toBeVisible();
            await signupPage.continueButton.click();
            await signupPage.navBar.verifyLoggedInAs(validRegistrationData.name!)
        });

        await test.step('Place order', async () => {
            const paymentData = new PaymentDataBuilder()
                .withCardName(validRegistrationData.name!)
                .build();

            await cartPage.navBar.cartButton.click();
            await cartPage.proceedToCheckoutButton.click();
            //await cartPage.verifyBillingAddress(validRegistrationData);
            await cartPage.verifyDeliveryAddress(validRegistrationData);
            await cartPage.commentInput.fill('new comment');
            await cartPage.placeOrderLink.click();
            await cartPage.fillPaymentDataAndConfitmOrder(paymentData);
            await expect.soft(cartPage.orderSuccessfulText).toBeVisible();
        });

        await test.step('Delete account', async () => {
            await signupPage.navBar.deleteAccountButton.click();
            await expect.soft(signupPage.accountDeletedHeader).toBeVisible();
            await signupPage.continueButton.click();
        });

    });

    test('Test Case 15: Place Order: Register before Checkout', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-015",
        }
    }, async ({productsPage, cartPage, loginPage, signupPage}) => {
        /*
        Steps
        1.  Launch browser
        2.  Navigate to url {{base_url}}
        3.  Verify that home page is visible successfully
        4.  Click 'Signup / Login' button
        5.  Fill all details in Signup and create account
        6.  Verify 'ACCOUNT CREATED!' and click 'Continue' button
        7.  Verify ' Logged in as username' at top
        8.  Add products to cart
        9.  Click 'Cart' button
        10. Verify that cart page is displayed
        11. Click Proceed To Checkout
        12. Verify Address Details and Review Your Order
        13. Enter description in comment text area and click 'Place Order'
        14. Enter payment details: Name on Card, Card Number, CVC, Expiration date
        15. Click 'Pay and Confirm Order' button
        16. Verify success message 'Your order has been placed successfully!'
        17. Click 'Delete Account' button
        18. Verify 'ACCOUNT DELETED!' and click 'Continue' button
        */
        await test.step('Register new user', async () => {
            await loginPage.navBar.signupLoginButton.click()
            await loginPage.signup(validRegistrationData);
            await signupPage.createAccount(validRegistrationData);
            await signupPage.continueButton.click();
            await signupPage.navBar.verifyLoggedInAs(validRegistrationData.name!)
        });

        await test.step('Add products to cart', async () => {
            const card0 = await productsPage.getProductCardByIndex(0);
            await card0.addToCart();
            await productsPage.cartModal.continueShoppingButton.click();
            const card1 = await productsPage.getProductCardByIndex(1);
            await card1.addToCart();
            await productsPage.cartModal.continueShoppingButton.click();
            await productsPage.navBar.cartButton.click();
            await cartPage.proceedToCheckoutButton.click()
        });

        await test.step('Place order', async () => {
            const paymentData = new PaymentDataBuilder()
                .withCardName(validRegistrationData.name!)
                .build();

            await cartPage.navBar.cartButton.click();
            await cartPage.proceedToCheckoutButton.click();
            //await cartPage.verifyBillingAddress(validRegistrationData);
            await cartPage.verifyDeliveryAddress(validRegistrationData);
            await cartPage.commentInput.fill('new comment');
            await cartPage.placeOrderLink.click();
            await cartPage.fillPaymentDataAndConfitmOrder(paymentData);
            await expect.soft(cartPage.orderSuccessfulText).toBeVisible();
        });

        await test.step('Delete account', async () => {
            await signupPage.navBar.deleteAccountButton.click();
            await expect.soft(signupPage.accountDeletedHeader).toBeVisible();
            await signupPage.continueButton.click();
        });

    });


    test('Test Case 16: Place Order: Login before Checkout', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-016",
        }
    }, async ({homePage, cartPage, loginPage, signupPage, productsPage, apiClient}) => {
        /*
        Steps
        1.  Launch browser
        2.  Navigate to url {{base_url}}
        3.  Verify that home page is visible successfully
        4.  Click 'Signup / Login' button
        5.  Fill email, password and click 'Login' button
        6.  Verify 'Logged in as username' at top
        7. Add products to cart
        8. Click 'Cart' button
        9. Verify that cart page is displayed
        10. Click Proceed To Checkout
        11. Verify Address Details and Review Your Order
        12. Enter description in comment text area and click 'Place Order'
        13. Enter payment details: Name on Card, Card Number, CVC, Expiration date
        14. Click 'Pay and Confirm Order' button
        15. Verify success message 'Your order has been placed successfully!'
        16. Click 'Delete Account' button
        17. Verify 'ACCOUNT DELETED!' and click 'Continue' button
        */
        await test.step('Arrange', async () => {
            const response = await apiClient.post(apiendpoints.account.create, validRegistrationData);
            verifyResponse(response, 201, apimessages.account.created)
        });

        await test.step('Login', async () => {
            await expect.soft(homePage.automationExcerciseHeading).toBeVisible();
            await homePage.navBar.signupLoginButton.click();
            await loginPage.login(validRegistrationData);
            await signupPage.navBar.verifyLoggedInAs(validRegistrationData.name!)
        });

        await test.step('Add products to cart', async () => {
            const card0 = await productsPage.getProductCardByIndex(0);
            await card0.addToCart();
            await productsPage.cartModal.continueShoppingButton.click();
            const card1 = await productsPage.getProductCardByIndex(1);
            await card1.addToCart();
            await productsPage.cartModal.continueShoppingButton.click();
            await productsPage.navBar.cartButton.click();
            await cartPage.proceedToCheckoutButton.click()
        });

        await test.step('Place order', async () => {
            const paymentData = new PaymentDataBuilder()
                .withCardName(validRegistrationData.name!)
                .build();

            await cartPage.navBar.cartButton.click();
            await cartPage.proceedToCheckoutButton.click();
            //await cartPage.verifyBillingAddress(validRegistrationData);
            await cartPage.verifyDeliveryAddress(validRegistrationData);
            await cartPage.commentInput.fill('new comment');
            await cartPage.placeOrderLink.click();
            await cartPage.fillPaymentDataAndConfitmOrder(paymentData);
            await expect.soft(cartPage.orderSuccessfulText).toBeVisible();
        });

        await test.step('Delete account', async () => {
            await signupPage.navBar.deleteAccountButton.click();
            await expect.soft(signupPage.accountDeletedHeader).toBeVisible();
            await signupPage.continueButton.click();
        });

    });

    test('Test Case 17: Remove Products From Cart', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-017",
        }
    }, async ({homePage, productsPage, cartPage}) => {
        /*
        Steps
        1. Launch browser
        2. Navigate to url {{base_url}}
        3. Verify that home page is visible successfully
        4. Add products to cart
        5. Click 'Cart' button
        6. Verify that cart page is displayed
        7. Click 'X' button corresponding to particular product
        8. Verify that product is removed from the cart
        */
        await test.step('Add products in cart', async () => {
            await expect.soft(homePage.automationExcerciseHeading).toBeVisible();
            const card0 = await productsPage.getProductCardByIndex(0);
            await card0.addToCart();
            await productsPage.cartModal.continueShoppingButton.click();
            const card1 = await productsPage.getProductCardByIndex(1);
            await card1.addToCart();
            await productsPage.cartModal.continueShoppingButton.click();
        });

        await test.step('Remove particular product from cart', async () => {
            await cartPage.navBar.cartButton.click();
            await cartPage.deleteProductByIndex(1);
        });

        await test.step('Verify cart', async () => {
            const expectedCart = [
                ['Blue Top', 'Rs. 500', '1', 'Rs. 500']
            ];
            await cartPage.verifyCart(expectedCart);
        });
    });


    test('Test Case 18: View Category Products', {
        annotation: {
            type: "userstory",
            description: "https://link.in.jira.net/browse/AE-018",
        }
    }, async ({homePage, productsPage}) => {
        /*
        Steps
        1. Launch browser
        2. Navigate to url {{base_url}}
        3. Verify that categories are visible on left side bar
        4. Click on 'Women' category
        5. Click on any category link under 'Women' category, for example: Dress
        6. Verify that category page is displayed and confirm text 'WOMEN - TOPS PRODUCTS'
        7. On left side bar, click on any sub-category link of 'Men' category
        8. Verify that user is navigated to that category page
        */
        await homePage.leftSideBar.clickCategory(/\bWomen\b/, 'Dress');
        await productsPage.verifyCategoryHeading('Women - Dress Products');
        await productsPage.leftSideBar.clickCategory(/\bMen\b/, 'Jeans');
        await productsPage.verifyCategoryHeading('Men - Tshirts Products');
    });



});




