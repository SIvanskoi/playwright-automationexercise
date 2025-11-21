import { type Page, type Locator, expect } from '@playwright/test';
import { NavigationBarBlock } from '../blocks/navbar.block';
import { FooterBlock } from '../blocks/footer.block';
import { CartModalBlock } from '../blocks/cartmodal.block';
import { SideBarBlock } from '../blocks/sidebar.block';

export class BasePage {

    readonly page: Page;
    readonly navBar: NavigationBarBlock;
    readonly footer: FooterBlock;
    readonly cartModal: CartModalBlock;
    readonly leftSideBar: SideBarBlock; 
    readonly scrollUpButton: Locator;
    url: string;
    title: string | RegExp;

    constructor(page: Page) {
        this.page = page;
        this.url = "";
        this.title = "";

        this.navBar = new NavigationBarBlock(this.page);
        this.footer = new FooterBlock(this.page);
        this.cartModal = new CartModalBlock(this.page);
        this.leftSideBar = new SideBarBlock(this.page);
        this.scrollUpButton = this.page.locator('//a[@id="scrollUp"]');

        //this.page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
    }

    public async open() {
        await this.page.goto(this.url);
        await this.page.waitForURL(new RegExp(this.url), { waitUntil: "load" });

        // Disable animation once a page is loaded
        await this.page.emulateMedia( { reducedMotion: "reduce" } )
    }

    public async verifyTitle(): Promise<void> {
        if (!this.title) throw new Error("Expected page title is empty!");
        await expect.soft(this.page).toHaveTitle(this.title);
    }

    public async getHeight(): Promise<number> {
        const pageHeight = await this.page.evaluate(() => {
        // This will return the height of the entire content, including overflow
        return document.body.scrollHeight; 
        });
        return pageHeight;
    }
}
