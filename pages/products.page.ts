import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { th } from '@faker-js/faker';

export class ProductsPage extends BasePage {

    readonly allProductsHeading: Locator;
    readonly searchProductInput: Locator;
    readonly searchButton: Locator;

    private productCard: Locator;

    constructor(page: Page) {
        super(page);

        this.url = '/products'
        this.allProductsHeading = this.page.getByRole('heading', { name: 'All Products' })
        this.searchProductInput = this.page.locator('//input[@id="search_product"]')
        this.searchButton = this.page.locator('//button[@id="submit_search"]')

        this.productCard = page.locator('//div[@class="col-sm-4"]')
    }

    public getProductCardByIndex(index: number): Locator {
        return this.productCard.nth(index);
    }

    async viewProductByIndex(index: number): Promise<ProductDetails> {
        await this.page.getByRole('link', {name: 'View Product'}).nth(index).click()
        return new ProductDetails(this.page)
    }

    async searchProduct(product: string): Promise<void> {
        await this.searchProductInput.fill(product);
        await this.searchButton.click();
    }

    /*
    async getAllProducts(productName?: string | RegExp ): Promise<ProductCard[]> {
        const collection = await this.page.locator('//div[@class="col-sm-4"]').all();
        const cards: ProductCard[] = collection.map(locator => new ProductCard(locator));
        
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
        return cards;
    }
    */

}

/*
class ProductCard {
    
    readonly name: Locator;
    //readonly price: Locator;
    //readonly viewProductLink: Locator;
    //readonly addToCartButton: Locator;

    constructor(readonly root: Locator) {
        this.name = root.locator('//div[@class="overlay-content"]/p')
    }

    async getName() {
        return this.name.textContent()
    }
} 
*/

class ProductDetails extends BasePage {

    readonly addToCartButton: Locator;
    readonly productInfo: Locator;
    readonly productName: Locator;
    readonly productCategory: Locator;
    readonly productPrice: Locator;
    readonly productAvailability: Locator;
    readonly productCondition: Locator;
    readonly productBrand: Locator;
    readonly quantityInput: Locator;
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
    }

    private getDetailValue(detail: string | null): string {
        if (detail) {
            return detail.split(':')[1]?.trim();
        }
        return "";
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
        return "";
    }
}