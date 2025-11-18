import { type Locator, type Page, } from '@playwright/test';

export class RefineBar {

    readonly root: Locator;
    categorySelector = (productCategory : string): string => `//a[@href="#${productCategory}"]`;
    subcategorySelector = (productCategory: string, productSubcategory: string): string => `//div[@id="${productCategory}"]//a[contains(text(), "${productSubcategory}")]`;
    brandSelector = (productBrand: string): string => `//div[@class="brands_products"]//a[contains(@href, "${productBrand}")]`;

    constructor(readonly page: Page) {

        this.root = this.page.locator('//div[contains(@class, "left-sidebar")]');

    }

    public async clickCategory(productCategory: string, productSubcategory: string): Promise<void> {
        await this.root.locator(this.categorySelector(productCategory)).click();
        await this.root.locator(this.subcategorySelector(productCategory, productSubcategory)).click();
    }

    public async clickBrand(productBrand: string): Promise<void> {
        //XPATH this.root.locator(brandSelector(productBrand)).click();
        await this.root.getByRole('link', { name: productBrand }).click();
        await this.page.waitForURL(`**/brand_products/${productBrand}`);
    }
}