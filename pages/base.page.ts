import { Page, expect } from '@playwright/test';

export class BasePage {

    readonly page: Page;
    url: string;

    constructor(page: Page) {
        this.page = page;
        this.url = "";
    }

    async open() {
        await this.page.goto(this.url);
        await this.page.waitForURL(new RegExp(this.url), { waitUntil: "load" });
        // Disable animation once a page is loaded
        await this.page.emulateMedia( { reducedMotion: "reduce" } )
    }
}
