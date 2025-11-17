import { test, expect } from '../fixtures/fixtures';
import { RegistrationFormData, RegistrationFormDataBuilder} from '../utils/fakeuser';
import { verifyResponse } from '../api/api.client'

/**
 *  A list of temporary users to delete them after tests are finished.
 */
const tempUsers: Partial<RegistrationFormData>[] = []; 


test.afterAll('Delete all temp users', async ({apiClient}) => {
    if (tempUsers.length > 0) {
        for(const user of tempUsers) {
            const response = await apiClient.deleteAccount(user);
            expect(response.ok()).toBeTruthy();
        }
    }
});


test('@api - Test Case 1: Get All Products List', async ({apiClient}) => {
    const response = await apiClient.getProductsList();
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body['products'].length).toEqual(34);
});


test('@api - Test Case 2: POST to All Products List', async ({apiClient}) => {
    const response = await apiClient.post(apiClient.endpointProductsList, {});
    expect(response.ok()).toBeTruthy();
    await verifyResponse(response, 405, 'This request method is not supported.');
});


test('@api - Test Case 3: Get All Brands List', async ({apiClient}) => {
    const response = await apiClient.getBrandsList();
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body['brands'].length).toEqual(34);
});


test('@api - Test Case 4: PUT to All Brands', async ({apiClient}) => {
    const response = await apiClient.put(apiClient.endpointBrandsList, {});
    expect(response.ok()).toBeTruthy();
    await verifyResponse(response, 405, 'This request method is not supported.');
});


test('@api - Test Case 5: Search Product - tshirts', async ({apiClient}) => {
    const response = await apiClient.searchProduct({
        'search_product' : 'tshirt',
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body['products'].length).toEqual(6);
});


test('@api - Test Case 6: POST To Search Product without search_product parameter', async ({apiClient}) => {
    const response = await apiClient.post(apiClient.endpointSearchProduct, {});
    expect(response.ok()).toBeTruthy();
    await verifyResponse(response, 400, 'Bad request, search_product parameter is missing in POST request.');
});


test('@api - Test Case 7: POST To Verify Login with valid details', async ({apiClient}) => {
    
    const registrationFormData = new RegistrationFormDataBuilder()
        .build();
    tempUsers.push(registrationFormData);

    await test.step('Arrange', async () => {
        const response = await apiClient.createAccount(registrationFormData);
        await verifyResponse(response, 201, 'User created!');
    });

    const response = await apiClient.verifyAccount(registrationFormData)
    expect(response.ok()).toBeTruthy();
    await verifyResponse(response, 200, 'User exists!');
});


test('@api - Test Case 8: POST To Verify Login without email parameter', async ({apiClient}) => {
    const invalidRegistrationFormData = new RegistrationFormDataBuilder()
        .withoutEmail()
        .build();

    const response = await apiClient.verifyAccount(invalidRegistrationFormData);
    expect(response.ok()).toBeTruthy();
    await verifyResponse(response, 400, 'Bad request, email or password parameter is missing in POST request.');
});


test('@api - Test Case 9: DELETE To Verify Login', async ({apiClient}) => {
    const response = await apiClient.delete(apiClient.endpointVerifyLogin, {});
    expect(response.ok()).toBeTruthy();
    await verifyResponse(response, 405, 'This request method is not supported.');
});

test('@api - Test Case 10: POST To Verify Login with invalid details', async ({apiClient}) => {
    const registrationFormData = new RegistrationFormDataBuilder()
        .build();

    const response = await apiClient.verifyAccount(registrationFormData)
    expect(response.ok()).toBeTruthy();
    await verifyResponse(response, 404, 'User not found!');
});


test('@api - Test Case 11: POST To Create/Register User Account', async ({apiClient}) => {

    const registrationFormData = new RegistrationFormDataBuilder()
        .build();
    tempUsers.push(registrationFormData);

    const response = await apiClient.createAccount(registrationFormData);
    await verifyResponse(response, 201, 'User created!');

});


test('@api - Test Case 12: DELETE To Delete User Account', async ({apiClient}) => {
    
    const registrationFormData = new RegistrationFormDataBuilder()
        .build();
    tempUsers.push(registrationFormData);

    await test.step('Arrange', async () => {
        const response = await apiClient.createAccount(registrationFormData);
        await verifyResponse(response, 201, 'User created!');
    });

    const response = await apiClient.deleteAccount(registrationFormData);
    expect(response.ok()).toBeTruthy();
    await verifyResponse(response, 200, 'Account deleted!');
});


test('@api - Test Case 13: PUT method To Update User Account', async ({apiClient}) => {
    const registrationFormData = new RegistrationFormDataBuilder()
        .build();
    tempUsers.push(registrationFormData);

    await test.step('Arrange', async () => {
        const response = await apiClient.createAccount(registrationFormData);
        await verifyResponse(response, 201, 'User created!');
    });

    const updatedRegistrationFormData = new RegistrationFormDataBuilder()
        .withEmail(registrationFormData.email!)
        .withPassword(registrationFormData.password!)
        .build();
    const response = await apiClient.updateAccount(updatedRegistrationFormData);
    expect(response.ok()).toBeTruthy();
    await verifyResponse(response, 200, 'User updated!');
});


test('@api - Test Case 14: GET user account detail by email', async ({apiClient}) => {
    const registrationFormData = new RegistrationFormDataBuilder()
        .build();
    tempUsers.push(registrationFormData);

    await test.step('Arrange', async () => {
        const response = await apiClient.createAccount(registrationFormData);
        await verifyResponse(response, 201, 'User created!');
    });

    const response = await apiClient.getUserDetails(registrationFormData);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.user.id).toBeGreaterThan(0)
    expect(body.user.email).toEqual(registrationFormData.email)
});
