import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class TestCasesPage extends BasePage {

    readonly testcaseHeading: Locator;

    constructor(page: Page) {
        super(page);

        this.url = '/test_cases'

        this.testcaseHeading = this.page.locator('//u[contains(text(), "Test Case")]')
    }

}