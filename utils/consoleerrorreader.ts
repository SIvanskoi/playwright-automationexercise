import { type TestInfo, type Page, expect } from '@playwright/test';


export class ConsoleErrorReader {

    private consoleErrors: string[];

    constructor(
        private page: Page,
        private testInfo: TestInfo) {

        this.consoleErrors = [];
        this.page.on("console", (consoleMessage) => {
            if (consoleMessage.type() === "error") {
                const errorText = consoleMessage.text();
                this.consoleErrors.push(errorText);
                }
            });
    }

    public getErrors(): string[] {
        return [...this.consoleErrors];
    }

    public hasErrors(): boolean {
        return this.consoleErrors.length > 0;
    }

    public getErrorCount(): number {
        return this.consoleErrors.length;
    }

    public async postErrors(failTestOnErrors: boolean): Promise<void> {
        if (this.consoleErrors.length > 0) {
            await this.testInfo.attach('Console Errors', 
            {
                body: this.consoleErrors.join('\n\n'),
                contentType: 'text/plain',
            });
        }
        if (failTestOnErrors) {
            expect(this.consoleErrors.length, `Found ${this.consoleErrors.length} errors in console`).toEqual(0);
        }
    }

}