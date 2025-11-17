import { Locator, Page } from '@playwright/test';


export class ProductCard {

    readonly page: Page;
    readonly name: Locator;
    readonly price: Locator;
    readonly viewProductLink: Locator;
    readonly addToCartButton: Locator;
    readonly productInfo: Locator;
    readonly productOverlay: Locator;
    
    private readonly addToCartText: string = 'Add to cart';

    constructor(/*readonly page: Page, */readonly root: Locator) {

        this.page = root.page();
        this.productInfo = this.root.locator('//div[contains(@class, "productinfo")]');
        this.name = this.productInfo.locator('p');
        this.price = this.productInfo.locator('h2');
        this.addToCartButton = this.productInfo.getByText(this.addToCartText);
        this.viewProductLink = this.root.getByText('View Product');
        this.productOverlay = this.root.locator('.product-overlay').first()
    }

    public async addToCart(): Promise<void> {
        await this.addToCartButton.click();
    }

    public async addToCartFromOverlay(): Promise<void> {
        const box = await this.root.boundingBox();
        await this.page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
        await this.productOverlay.waitFor( {state: "visible"} );
        await this.productOverlay.getByText(this.addToCartText).click();
    }

    public async getName(): Promise<string | null> {
        return await this.name.textContent();
    }

    public async getPrice(): Promise<string | null> {
        return await this.price.textContent();
    }
    
    public async viewProduct(): Promise<void> {
        await this.viewProductLink.click();
    }


}