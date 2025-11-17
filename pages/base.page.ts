import { Page } from '@playwright/test';
import { NavigationBar } from '../components/navbar'
import { Footer } from '../components/footer';
import { CartModal } from '../components/cartmodal';

export class BasePage {

    readonly page: Page;
    readonly navBar: NavigationBar;
    readonly footer: Footer;
    readonly cartModal: CartModal;
    url: string;

    constructor(page: Page) {
        this.page = page;
        this.url = "";

        this.navBar = new NavigationBar(this.page);
        this.footer = new Footer(this.page);
        this.cartModal = new CartModal(this.page);
    }

    async open() {
        await this.page.goto(this.url);
        await this.page.waitForURL(new RegExp(this.url), { waitUntil: "load" });

        // Disable animation once a page is loaded
        await this.page.emulateMedia( { reducedMotion: "reduce" } )
    }
}
