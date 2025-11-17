import { type Locator, type Page, } from '@playwright/test';

export class RefineBar {

    readonly root: Locator;

    constructor(readonly page: Page) {

        this.root = this.page.locator('//div[contains(@class, "left-sidebar")]');

    }

    public async clickCategory(productCategory: string | RegExp, productSubcategory?: string | RegExp): Promise<void> {
        //const categoryProducts: Locator = this.root.locator('//div[contains(@class, "category-products")]');
        await this.root.getByRole('link', { name: productCategory }).click();
        if (productSubcategory) await this.root.getByRole('listitem').filter({ hasText: productSubcategory }).click();
    }

    public async clickBrand(productBrand: string | RegExp): Promise<void> {
        this.root.getByRole('link', { name: productBrand });
    }
}