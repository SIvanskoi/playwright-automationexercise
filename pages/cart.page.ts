import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { RegistrationFormData } from '../utils/fakeuser';
import { PaymentData } from '../utils/fakecard';

export class CartPage extends BasePage {

    private readonly tableRow: Locator;
    readonly proceedToCheckoutButton: Locator;
    readonly registerLoginLink: Locator;
    readonly contunueOnCartButton: Locator;
    readonly placeOrderLink: Locator;
    readonly commentInput: Locator;
    readonly deliveryAddressList: Locator;
    readonly invoiceAddressList: Locator;
    readonly cardNameInput: Locator;
    readonly cardNumberInput: Locator;
    readonly cardCVVInput: Locator;
    readonly expiryMonthInput: Locator;
    readonly expiryYearInput: Locator;
    readonly orderConfirmButton: Locator;
    readonly orderSuccessfulText: Locator;

    constructor(page: Page) {
        super(page);
        this.url = '/view_cart';

        this.tableRow = this.page.locator('//tbody').getByRole('row');
        this.proceedToCheckoutButton = this.page.getByText('Proceed To Checkout');
        this.registerLoginLink = this.page.getByRole('link', { name: 'Register / Login' });
        this.contunueOnCartButton = this.page.getByRole('button', { name: 'Continue On Cart' });
        this.placeOrderLink = this.page.getByRole('link', { name: 'Place Order' });
        this.commentInput = this.page.locator('textarea[name="message"]');
        this.deliveryAddressList = this.page.locator('//ul[@id="address_delivery"]');
        this.invoiceAddressList = this.page.locator('//ul[@id="address_invoice"]');
        this.cardNameInput = this.page.getByTestId('name-on-card');
        this.cardNumberInput = this.page.getByTestId('card-number');
        this.cardCVVInput = this.page.getByTestId('cvc')
        this.expiryMonthInput = this.page.getByTestId('expiry-month');
        this.expiryYearInput = this.page.getByTestId('expiry-year');
        this.orderConfirmButton = this.page.getByRole('button', { name: 'Pay and Confirm Order' });
        this.orderSuccessfulText = this.page.getByText('Congratulations! Your order has been confirmed!');
    }

    /**
     * Deletes a product in cart table.
     * @param index Index of a row where the product is located. 
     */
    public async deleteProductByIndex(index: number): Promise<void> {
        await this.tableRow.nth(index).locator('.cart_quantity_delete').click();
    }

    public async fillPaymentDataAndConfitmOrder(paymentData: Partial<PaymentData>): Promise<void> {
        if (paymentData.cardname) await this.cardNameInput.fill(paymentData.cardname);
        if (paymentData.cardnumber) await this.cardNumberInput.fill(paymentData.cardnumber);
        if (paymentData.cvv) await this.cardCVVInput.fill(paymentData.cvv);
        if (paymentData.expirymonth) await this.expiryMonthInput.fill(paymentData.expirymonth.toString());
        if (paymentData.expiryyear) await this.expiryYearInput.fill(paymentData.expiryyear.toString());
        await this.orderConfirmButton.click();
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

    public async verifyDeliveryAddress(registrationFormData: Partial<RegistrationFormData>): Promise<void> {
        await this.verifyList(this.deliveryAddressList, registrationFormData);
    }

    public async verifyBillingAddress(registrationFormData: Partial<RegistrationFormData>): Promise<void> {
        await this.verifyList(this.invoiceAddressList, registrationFormData);
    }

    /**
     * 
     * @param cartTable is a 2D array of strings representing cart table.
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
     *    const expectedData = [
     *           ['Blue Top', 'Rs. 500', '2', 'Rs. 1000'],
     *           ['Red Dress', 'Rs. 800', '1', 'Rs. 800']
     *       ];
     */
    public async verifyCart(cartTable: string[][]): Promise<void> {
        
        await expect(this.tableRow).toHaveCount(cartTable.length);
        for (let i = 0; i < cartTable.length; i++) {
                const cell = this.tableRow.nth(i).getByRole('cell');
            for(let j = 0; j < cartTable[i].length; j++) {
                await expect.soft(cell.nth(j + 1), { message: `Row ${i + 1}, Column ${j + 1} should be "${cartTable[i][j]}"`}).toContainText(cartTable[i][j]);
            }
        }
    }
}