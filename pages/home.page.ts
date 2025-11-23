import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {

    readonly recommendedItemsHeading: Locator;
    readonly homepageMarkerHeading: Locator;

    constructor(page: Page) {
        super(page);
        this.url = "/"
        this.recommendedItemsHeading = this.page.getByRole('heading', { name: 'recommended items' });
        this.homepageMarkerHeading = this.page.getByRole('heading', { name: 'Full-Fledged practice website for Automation Engineers' });
    }

}