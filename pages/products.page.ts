import { type Locator, type Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { ProductCardBlock } from '../blocks/productcard.block';
import uimessages from '../utils/uimessages';


export class ProductsPage extends BasePage {

    readonly allProductsHeading: Locator;
    readonly searchProductInput: Locator;
    readonly searchProductsHeading: Locator;
    readonly searchButton: Locator;

    private productCard: Locator;

    constructor(page: Page) {
        super(page);

        this.url = '/products'
        this.allProductsHeading = this.page.getByRole('heading', { name: 'All Products' });
        this.searchProductInput = this.page.locator('//input[@id="search_product"]');
        this.searchButton = this.page.locator('//button[@id="submit_search"]');
        this.productCard = this.page.locator('//div[@class="product-image-wrapper"]');
        this.searchProductsHeading = this.page.getByRole('heading', { name: 'Searched Products' });
    }

    public async getProductCardByIndex(index: number): Promise<ProductCardBlock> {
        const cardsCollection = await this.getAllProductCards();
        return cardsCollection[index];
    }

    public async searchProduct(product: string): Promise<void> {
        await this.searchProductInput.fill(product);
        await this.searchButton.click();
        await this.page.waitForURL(`**search=${product}**`);
    }
    
    public async getAllProductCards(productName?: string | RegExp ): Promise<ProductCardBlock[]> {
        const collection = await this.productCard.all();
        const cards: ProductCardBlock[] = collection.map(locator => new ProductCardBlock(locator));
        /*
        if (productName) {
            
            const filtered: ProductCard[] = [];
            for (const card in cards) {
                
                const name = (await card.getName())?.trim();
                if (!name) continue;

                if (typeof productName === 'string') {
                    if (name.includes(productName)) {
                        filtered.push(card);
                    }
                } else {
                    if (productName.test(name)) {
                        filtered.push(card);
                    }
                }
            }
        }
        */
        return cards;
    }

    public async verifyBrandHeading(brandName: string): Promise<void> {
        expect.soft(this.page.getByRole('heading', { name: `Brand - ${brandName} Products`})).toBeVisible();
    }

    public async verifyCategoryHeading(categoryHeadingText: string): Promise<void> {
        expect.soft(this.page.getByRole('heading', { name: categoryHeadingText})).toBeVisible();
    }
    

}

export class ProductDetailsPage extends BasePage {

    readonly addToCartButton: Locator;
    readonly productInfo: Locator;
    readonly productName: Locator;
    readonly productCategory: Locator;
    readonly productPrice: Locator;
    readonly productAvailability: Locator;
    readonly productCondition: Locator;
    readonly productBrand: Locator;
    readonly quantityInput: Locator;
    readonly writeReviewLink: Locator;
    readonly reviewNameInput: Locator;
    readonly reviewEmailInput: Locator
    readonly reviewTextInput: Locator;
    readonly reviewSubmitButton: Locator;
    readonly reviewSubmitMessage: Locator;
    private productDetail: Record<string, Partial<string>> = {};

    constructor(page: Page) {
        super(page)
        this.addToCartButton = this.page.getByText('Add to cart');
        this.productInfo = this.page.locator('//div[@class="product-information"]');
        this.productName = this.productInfo.locator('h2');
        this.productCategory = this.productInfo.locator('p').first()
        this.productPrice = this.productInfo.locator('//span[contains(text(), "Rs.")]');
        this.productAvailability = this.productInfo.locator('//p[b[text()[normalize-space()="Availability:"]]]');
        this.productCondition = this.productInfo.locator('//p[b[text()[normalize-space()="Condition:"]]]');
        this.productBrand = this.productInfo.locator('//p[b[text()[normalize-space()="Brand:"]]]');
        this.quantityInput = this.page.locator('#quantity')
        this.writeReviewLink = this.page.getByRole('link', { name: 'Write Your Review' });
        this.reviewNameInput = this.page.getByRole('textbox', { name: 'Your Name' });
        this.reviewEmailInput = this.page.getByRole('textbox', { name: 'Email Address', exact: true });
        this.reviewTextInput = this.page.getByRole('textbox', { name: 'Add Review Here!' })
        this.reviewSubmitButton = this.page.getByRole('button', { name: 'Submit' });
        this.reviewSubmitMessage = this.page.getByText(uimessages.review.success);
    }

    private getDetailValue(detail: string | null): string | null {
        if (detail) {
            return detail.split(':')[1]?.trim();
        }
        return null;
    }

    async addToCart(quantity?: string): Promise<void> {
        if (quantity) {
            await this.quantityInput.fill(quantity)
        }
        await this.addToCartButton.click()
    }

    async getAvailability(): Promise<string | null> {
        const availability = await this.productAvailability.textContent();
        return this.getDetailValue(availability);
    }

    async getBrand(): Promise<string | null> {
        const brand = await this.productBrand.textContent();
        return this.getDetailValue(brand);
    }

    async getCategory(): Promise<string | null> {
        const category = await this.productCategory.textContent();
        return this.getDetailValue(category);
    }

    async getCondition(): Promise<string | null> {
        const condition = await this.productCondition.textContent();
        return this.getDetailValue(condition);
    }

    async getName(): Promise<string | null> {
        return await this.productName.textContent();
    }

    async getPrice(): Promise<string | null> {
        const price = await this.productPrice.textContent();
        if (price) {
            const match = price.match(/\d+(\.\d+)?/);
            if (match)
                return match[0];
        }
        return null;
    }

    async submitReview(name: string, email: string, reviewText: string): Promise<void> {
        await this.reviewNameInput.fill(name);
        await this.reviewEmailInput.fill(email);
        await this.reviewTextInput.fill(reviewText);
        await this.reviewSubmitButton.click();
    }
}