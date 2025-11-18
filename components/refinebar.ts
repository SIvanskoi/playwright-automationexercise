import { type Locator, type Page, } from '@playwright/test';

export class RefineBar {

    readonly root: Locator;

    constructor(readonly page: Page) {

        this.root = this.page.locator('//div[contains(@class, "left-sidebar")]');

    }

    public async clickCategory(productCategory: string, productSubcategory: string): Promise<void> {
        await this.root.locator(`//a[@href="#${productCategory}"]`).click();
        await this.root.locator(`//div[@id="${productCategory}"]//a[contains(text(), "${productSubcategory}")]`).click();
    }

    public async clickBrand(productBrand: string): Promise<void> {
        //XPATH this.root.locator(`//div[@class="brands_products"]//a[contains(@href, "${productBrand}")]`).click();
        await this.root.getByRole('link', { name: productBrand }).click();
        await this.page.waitForURL(`**/brand_products/${productBrand}`);
    }
}