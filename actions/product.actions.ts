import { type Page, expect } from '@playwright/test';
import { step } from '../utils/step';
import { type Pages, createPages } from '../pages/pages';
import { PaymentData } from '../utils/fakecard';


export default class ProductActions {
    private pages: Pages;

    constructor(page: Page) {
        this.pages = createPages(page);
    }

    @step('Add product to cart from product card by index')
    public async addProductToCartFromCardByIndex(index: number): Promise<void> {
        const productCard = await this.pages.productsPage.getProductCardByIndex(index);
        await productCard.addToCartButton.click();
    }

    @step('Add product to cart from product card overlay by index')
    public async addProductToCartFromCardOverlayByIndex(index: number): Promise<void> {
        const productCard = await this.pages.productsPage.getProductCardByIndex(index);
        const box = await productCard.root.boundingBox();
        await this.pages.productsPage.page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
        await productCard.productOverlay.waitFor( {state: "visible"} );
        await productCard.productOverlay.getByText(productCard.addToCartText).click();
    }

    /**
     * 
     * @param index Product index in Products page
     * @param quantity Product quantity to be added
     */
    @step('Add product to cart from product details page')
    public async addProductToCartFromDetails(quantity?: number): Promise<void> {
        if (quantity) {
            await this.pages.productDetailsPage.quantityInput.fill(quantity.toString())
        }
        await this.pages.productDetailsPage.addToCartButton.click()
    }

    @step('Search product')
    public async searchProduct(searchString: string): Promise<void> {
        await this.pages.productsPage.searchProductInput.fill(searchString);
        await this.pages.productsPage.searchButton.click();
        await this.pages.productsPage.page.waitForURL(`**search=${searchString}**`);
        await expect.soft(this.pages.productsPage.searchProductsHeading).toBeVisible();
    }


    @step('View product details by index')
    public async viewProductByIndex(index: number): Promise<void> {
        const productCard = await this.pages.productsPage.getProductCardByIndex(index);
        await productCard.viewProductLink.click();
    }
}