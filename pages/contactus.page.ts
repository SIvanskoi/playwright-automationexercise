import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { RegistrationFormData } from '../utils/fakeuser'

export class ContactUsPage extends BasePage {

    readonly getInTouchHeading: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly messageInput: Locator;
    readonly fileInput: Locator;
    readonly submitButton: Locator;
    readonly subjectInput: Locator;
    readonly submitStatus: Locator;
    readonly homeButton: Locator;

    constructor(page: Page) {
        super(page);
        this.url = "/contact_us"

        this.getInTouchHeading = this.page.getByRole('heading', { name: 'Get In Touch' });
        this.nameInput = this.page.getByTestId('name');
        this.emailInput = this.page.getByTestId('email');
        this.messageInput = this.page.getByTestId('message');
        this.fileInput = this.page.locator('//input[@type="file"]');
        this.submitButton = this.page.getByTestId('submit-button');
        this.subjectInput = this.page.getByTestId('subject');
        this.submitStatus = this.page.locator('#contact-page').getByText('Success! Your details have been submitted successfully.');
        this.homeButton = this.page.locator('#form-section').getByRole('link', { name: 'Home' });

        this.page.on('dialog', dialog => dialog.accept());
    }

    async submitContactUsForm(formData: Partial<RegistrationFormData>, subject: string, message: string, filePath: string): Promise<void> {
        await this.nameInput.fill(formData.name!);
        await this.emailInput.fill(formData.email!);
        await this.subjectInput.fill(subject);
        await this.messageInput.fill(message);
        await this.fileInput.setInputFiles(filePath);
        await this.submitButton.click();
    }
}