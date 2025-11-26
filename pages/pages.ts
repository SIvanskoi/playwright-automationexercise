import { type Page } from '@playwright/test';
import { LoginPage }  from '../pages/login.page';
import { SignupPage } from '../pages/signup.page';
import { HomePage } from '../pages/home.page';
import { ContactUsPage } from '../pages/contactus.page';
import { TestCasesPage } from '../pages/testcases.page';
import { ProductsPage, ProductDetailsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { NavigationBarBlock } from '../blocks/navbar.block';


export type Pages = {
    
    homePage: HomePage;
    loginPage: LoginPage;
    signupPage: SignupPage;
    contactUsPage: ContactUsPage;
    testcasesPage: TestCasesPage;
    productsPage: ProductsPage;
    productDetailsPage: ProductDetailsPage;
    cartPage: CartPage;
    navigationBar: NavigationBarBlock;
};


export function createPages(page: Page): Pages {
  return {
    loginPage: new LoginPage(page),
    signupPage: new SignupPage(page),
    homePage: new HomePage(page),
    contactUsPage: new ContactUsPage(page),
    testcasesPage: new TestCasesPage(page),
    productsPage: new ProductsPage(page),
    productDetailsPage: new ProductDetailsPage(page),
    cartPage: new CartPage(page),
    navigationBar: new NavigationBarBlock(page),
  };
}
