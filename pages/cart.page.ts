import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {

    private readonly tableRow: Locator;

    constructor(page: Page) {
        super(page);
        this.url = "/view_cart"

        this.tableRow = this.page.locator('//tbody').getByRole('row')
    }

    /**
     * 
     * @param cartTable is a 2D array of strings representing cart table.
     * For instance, cart table contains 2 products
     * _________________________________________________________
     * |   Item   | Description |  Price  | Quantity | Total   |
     * |----------+-------------+---------+----------+---------+
     * | {image}  |  Blue Top   | Rs. 500 |     2    |Rs. 1000 |
     * | {image}  |  Red Dress  | Rs. 800 |     1    |Rs. 800  |
     * +----------+-------------+---------+----------+---------+
     * 
     * so to verify cart above you would need define cartTable as follows
     * 
     *    const expectedData = [
     *           ['Blue Top', 'Rs. 500', '2', 'Rs. 1000'],
     *           ['Red Dress', 'Rs. 800', '1', 'Rs. 800']
     *       ];
     */
    public async verifyCart(cartTable: string[][]): Promise<void> {
        
        await expect(this.tableRow).toHaveCount(cartTable.length);
        for (let i = 0; i < cartTable.length; i++) {
                const cell = this.tableRow.nth(i).getByRole('cell');
            for(let j = 0; j < cartTable[i].length; j++) {
                await expect.soft(cell.nth(j+1), { message: `Row ${i + 1}, Column ${j + 1} should be "${cartTable[i][j]}"`}).toContainText(cartTable[i][j]);
            }
        }
    }
}