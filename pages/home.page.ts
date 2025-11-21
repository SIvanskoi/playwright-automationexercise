import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {

    readonly automationExcerciseHeading: Locator;
    readonly recommendedItemsHeading: Locator;
    readonly homepageMarkerHeading: Locator;

    constructor(page: Page) {
        super(page);
        this.url = "/"
        this.automationExcerciseHeading = this.page.getByRole('heading', { name: 'AutomationExercise' });
        this.recommendedItemsHeading = this.page.getByRole('heading', { name: 'recommended items' });
        this.homepageMarkerHeading = this.page.getByRole('heading', { name: 'Full-Fledged practice website for Automation Engineers' });
    }

}