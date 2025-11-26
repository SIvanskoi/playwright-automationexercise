import { type Page, type Locator, expect } from '@playwright/test';
import { step } from '../utils/step';
import { type Pages, createPages } from '../pages/pages';
import { RegistrationFormData } from '../utils/fakeuser'


export default class Verify {
    
    private pages: Pages;
    
    constructor(page: Page) {
        
        this.pages = createPages(page);
    }

    private async verifyList(listLocator: Locator, registrationFormData: Partial<RegistrationFormData>): Promise<void> {
        await expect.soft(listLocator.locator('//li[contains(@class, "address_firstname")]')).toHaveText(`. ${registrationFormData.name}`);
        const address = listLocator.locator('//li[contains(@class, "address_address1")]');
        await expect.soft(address.nth(0)).toHaveText(`${registrationFormData.company}`);//toHaveText(`${registrationFormData.address1}`);//
        await expect.soft(address.nth(1)).toHaveText(`${registrationFormData.address1}`);//toHaveText(`${registrationFormData.company}`);//
        //await expect.soft(address.nth(2)).toHaveText(`${registrationFormData.address1}`);
        await expect.soft(listLocator.locator('//li[contains(@class, "address_city")]')).toHaveText(`${registrationFormData.city} ${registrationFormData.state} ${registrationFormData.zipcode}`);
        await expect.soft(listLocator.locator('//li[@class="address_country_name"]')).toHaveText(`${registrationFormData.country}`);
        await expect.soft(listLocator.locator('//li[@class="address_phone"]')).toHaveText(`${registrationFormData.mobile_number}`);
    }

    @step('Is user logged in?')
    public async isUserLoggedIn(userName: string): Promise<void> {
        await expect.soft( this.pages.navigationBar.root.getByText(`Logged in as ${userName}`) ).toBeVisible();
    }

    @step('Is on Contact Us page?')
    public async isOnContactUsPage(): Promise<void> {
        await expect.soft(this.pages.contactUsPage.getInTouchHeading).toBeVisible();
    }

    @step('Is on Home page?')
    public async isOnHomePage(): Promise<void> {
        await expect.soft(this.pages.homePage.homepageMarkerHeading).toBeVisible();
    }

    @step('Is on Login page?')
    public async isOnLoginPage(): Promise<void> {
        await expect.soft(this.pages.loginPage.loginYourAccountHeader).toBeVisible();
        await expect.soft(this.pages.loginPage.signupHeader).toBeVisible();
    }

    @step('Is on Products page?')
    public async isOnProductsPage(): Promise<void> {
        await expect.soft(this.pages.productsPage.allProductsHeading).toBeVisible();
    }

    @step('Is invalid credentials provided?')
    public async isInvalidCredentialsProvided(): Promise<void> {
        await expect.soft( this.pages.navigationBar.root.getByText(/Logged in as\s+.+/) ).not.toBeVisible();
        await expect(this.pages.loginPage.loginIncorrectCredentials).toBeVisible();    
    }

    @step('Is existing credentials provided?')
    public async isExistingCredentialsProvided(): Promise<void> {
        await expect.soft( this.pages.navigationBar.root.getByText(/Logged in as\s+.+/) ).not.toBeVisible();
        await expect(this.pages.loginPage.signupExistingCredentials).toBeVisible();   
    }

    @step('Is product details are correct?')
    public async isProductDetailsAreCorrect(availability: string, brand: string, category: string, name: string, price: number): Promise<void> {
        await expect.soft(this.pages.productDetailsPage.productAvailability).toContainText(availability);
        await expect.soft(this.pages.productDetailsPage.productBrand).toContainText(brand);
        await expect.soft(this.pages.productDetailsPage.productCategory).toContainText(category);
        await expect.soft(this.pages.productDetailsPage.productName).toContainText(name);
        await expect.soft(this.pages.productDetailsPage.productPrice).toContainText(`Rs. ${price}`);
    }

    /**
     * 
     * @param expectedCart is a 2D array of strings representing cart table.
     * For instance, cart table contains 2 products
     * _________________________________________________________
     * |   Item   | Description |  Price  | Quantity | Total   |
     * |----------+-------------+---------+----------+---------+
     * | {image}  |  Blue Top   | Rs. 500 |     2    |Rs. 1000 |
     * | {image}  |  Red Dress  | Rs. 800 |     1    |Rs. 800  |
     * +----------+-------------+---------+----------+---------+
     * 
     * so to verify cart above you will need to define cartTable as follows
     * 
     *    const expectedCart = [
     *           ['Blue Top', 'Rs. 500', '2', 'Rs. 1000'],
     *           ['Red Dress', 'Rs. 800', '1', 'Rs. 800']
     *       ];
     */
    @step('Is cart contents are correct?')
    public async isCartContentsAreCorrect(expectedCart: string[][]): Promise<void> {
        await expect(this.pages.cartPage.tableRow).toHaveCount(expectedCart.length);
        for (let i = 0; i < expectedCart.length; i++) {
                const cell = this.pages.cartPage.tableRow.nth(i).getByRole('cell');
            for(let j = 0; j < expectedCart[i].length; j++) {
                await expect.soft(cell.nth(j + 1), { message: `Row ${i + 1}, Column ${j + 1} should be "${expectedCart[i][j]}"`}).toContainText(expectedCart[i][j]);
            }
        }
    }

    @step('Is delivery address correct?')
    public async isDeliveryAddressCorrect(registrationFormData: Partial<RegistrationFormData>): Promise<void> {
        await this.verifyList(this.pages.cartPage.deliveryAddressList, registrationFormData);
    }

    @step('Is billing address correct?')
    public async isBillingAddressCorrect(registrationFormData: Partial<RegistrationFormData>): Promise<void> {
        await this.verifyList(this.pages.cartPage.invoiceAddressList, registrationFormData);
    }

    @step('Is order placed successfully?')
    public async isOrderPlacedSuccessfully(): Promise<void> {
        await expect.soft(this.pages.cartPage.orderSuccessfulText).toBeVisible();
    }


}