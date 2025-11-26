import { type Page, expect } from '@playwright/test';
import { step } from '../utils/step';
import { type Pages, createPages } from '../pages/pages';
import { PaymentData } from '../utils/fakecard';


class CartActions {
    private pages: Pages;

    constructor(page: Page) {
        this.pages = createPages(page);
    }

    /**
     * Deletes a product in cart table.
     * @param index Index of a row in cart table where the product is located 
     */
    @step('Delete product from cart by row index')
    public async deleteProductByIndex(rowIndex: number): Promise<void> {
        await this.pages.cartPage.tableRow.nth(rowIndex).locator('.cart_quantity_delete').click();
    }

    @step('Fill payment data and confirm order')
    public async confirmOrder(paymentData: Partial<PaymentData>): Promise<void> {
        await this.pages.cartPage.placeOrderLink.click();
        if (paymentData.cardname) await this.pages.cartPage.cardNameInput.fill(paymentData.cardname);
        if (paymentData.cardnumber) await this.pages.cartPage.cardNumberInput.fill(paymentData.cardnumber);
        if (paymentData.cvv) await this.pages.cartPage.cardCVVInput.fill(paymentData.cvv);
        if (paymentData.expirymonth) await this.pages.cartPage.expiryMonthInput.fill(paymentData.expirymonth.toString());
        if (paymentData.expiryyear) await this.pages.cartPage.expiryYearInput.fill(paymentData.expiryyear.toString());
        await this.pages.cartPage.orderConfirmButton.click();
    }


}