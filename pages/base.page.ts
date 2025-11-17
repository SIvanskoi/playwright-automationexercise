import { type Page, expect } from '@playwright/test';
import { NavigationBar } from '../components/navbar'
import { Footer } from '../components/footer';
import { CartModal } from '../components/cartmodal';
import { RefineBar } from '../components/refinebar';

export class BasePage {

    readonly page: Page;
    readonly navBar: NavigationBar;
    readonly footer: Footer;
    readonly cartModal: CartModal;
    readonly leftSideBar: RefineBar; 
    url: string;
    title: string | RegExp;

    constructor(page: Page) {
        this.page = page;
        this.url = "";
        this.title = "";

        this.navBar = new NavigationBar(this.page);
        this.footer = new Footer(this.page);
        this.cartModal = new CartModal(this.page);
        this.leftSideBar = new RefineBar(this.page);
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
}
