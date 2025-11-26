import { type Page } from "@playwright/test";
import AuthActions from "./auth.actions";
import NavigateActions from "./navigate.actions";
import Verify from "../questions/questions";
import ProductActions from "./product.actions";
import CartActions from "./cart.actions";


type Actions = {
    authenticate: AuthActions;
    navigate: NavigateActions;
    verify: Verify;
    product: ProductActions;
    cart: CartActions;
};


export type Action = {
    action: Actions;
};


export function createActions(page: Page): Actions {
    return {
        authenticate: new AuthActions(page),
        navigate: new NavigateActions(page),
        verify: new Verify(page),
        product: new ProductActions(page),
        cart: new CartActions(page),
    };
}
