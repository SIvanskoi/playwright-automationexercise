import { test, expect } from '../fixtures/fixtures';
import { RegistrationFormData, RegistrationFormDataBuilder} from '../utils/fakeuser';
import { verifyResponse } from '../api/api.client'
import apiendpoints from '../utils/apiendpoints';
import apimessages from '../utils/apimessages'

/**
 *  A list of temporary users to delete them after tests are finished.
 */
const tempUsers: Partial<RegistrationFormData>[] = []; 


test.afterAll('Delete all temp users', async ({apiClient}) => {
    if (tempUsers.length > 0) {
        for(const user of tempUsers) {
            const response = await apiClient.delete(apiendpoints.account.delete, user);
            expect(response.ok()).toBeTruthy();
        }
    }
});


test('@api - Test Case 1: Get All Products List', async ({apiClient}) => {
    const response = await apiClient.get(apiendpoints.products.list);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body['products'].length).toEqual(34)
});


test('@api - Test Case 2: POST to All Products List', async ({apiClient}) => {
    const response = await apiClient.post(apiendpoints.products.list, {});
    expect(response.ok()).toBeTruthy();
    await verifyResponse(response, 405, apimessages.http.error.method);
});


test('@api - Test Case 3: Get All Brands List', async ({apiClient}) => {
    const response = await apiClient.get(apiendpoints.brands.list)
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body['brands'].length).toBe(34);
});


test('@api - Test Case 4: PUT to All Brands', async ({apiClient}) => {
    const response = await apiClient.put(apiendpoints.brands.list, {});
    expect(response.ok()).toBeTruthy();
    await verifyResponse(response, 405, apimessages.http.error.method);
});


test('@api - Test Case 5: Search Product - tshirts', async ({apiClient}) => {
    const response = await apiClient.post(apiendpoints.products.search, {
        'search_product' : 'tshirt',
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body['products'].length).toBe(6);
});


test('@api - Test Case 6: POST To Search Product without search_product parameter', async ({apiClient}) => {
    const response = await apiClient.post(apiendpoints.products.search, {});
    expect(response.ok()).toBeTruthy();
    await verifyResponse(response, 400, apimessages.search.error.parameter_missing);
});


test('@api - Test Case 7: POST To Verify Login with valid details', async ({apiClient}) => {
    
    const registrationFormData = new RegistrationFormDataBuilder()
        .build();
    tempUsers.push(registrationFormData);

    await test.step('Arrange', async () => {
        const response = await apiClient.post(apiendpoints.account.create, registrationFormData);
        await verifyResponse(response, 201, apimessages.account.created);
    });

    const response = await apiClient.post(apiendpoints.account.verify, registrationFormData)
    expect(response.ok()).toBeTruthy();
    await verifyResponse(response, 200, apimessages.account.exists);
});


test('@api - Test Case 8: POST To Verify Login without email parameter', async ({apiClient}) => {
    const invalidRegistrationFormData = new RegistrationFormDataBuilder()
        .withoutEmail()
        .build();

    const response = await apiClient.post(apiendpoints.account.verify, invalidRegistrationFormData);
    expect(response.ok()).toBeTruthy();
    await verifyResponse(response, 400, apimessages.account.error.parameter_missing);
});


test('@api - Test Case 9: DELETE To Verify Login', async ({apiClient}) => {
    const response = await apiClient.delete(apiendpoints.account.verify, {});
    expect(response.ok()).toBeTruthy();
    await verifyResponse(response, 405, apimessages.http.error.method);
});

test('@api - Test Case 10: POST To Verify Login with invalid details', async ({apiClient}) => {
    const registrationFormData = new RegistrationFormDataBuilder()
        .build();

    const response = await apiClient.post(apiendpoints.account.verify, registrationFormData)
    expect(response.ok()).toBeTruthy();
    await verifyResponse(response, 404, apimessages.account.notfound);
});


test('@api - Test Case 11: POST To Create/Register User Account', async ({apiClient}) => {

    const registrationFormData = new RegistrationFormDataBuilder()
        .build();
    tempUsers.push(registrationFormData);

    const response = await apiClient.post(apiendpoints.account.create, registrationFormData);
    await verifyResponse(response, 201, apimessages.account.created);

});


test('@api - Test Case 12: DELETE To Delete User Account', async ({apiClient}) => {
    
    const registrationFormData = new RegistrationFormDataBuilder()
        .build();
    tempUsers.push(registrationFormData);

    await test.step('Arrange', async () => {
        const response = await apiClient.post(apiendpoints.account.create, registrationFormData);
        await verifyResponse(response, 201, apimessages.account.created);
    });

    const response = await apiClient.delete(apiendpoints.account.delete, registrationFormData);
    expect(response.ok()).toBeTruthy();
    await verifyResponse(response, 200, apimessages.account.deleted);
});


test('@api - Test Case 13: PUT method To Update User Account', async ({apiClient}) => {
    const registrationFormData = new RegistrationFormDataBuilder()
        .build();
    tempUsers.push(registrationFormData);

    await test.step('Arrange', async () => {
        const response = await apiClient.post(apiendpoints.account.create, registrationFormData);
        await verifyResponse(response, 201, apimessages.account.created);
    });

    const updatedRegistrationFormData = new RegistrationFormDataBuilder()
        .withEmail(registrationFormData.email!)
        .withPassword(registrationFormData.password!)
        .build();
    const response = await apiClient.put(apiendpoints.account.update, updatedRegistrationFormData);
    expect(response.ok()).toBeTruthy();
    await verifyResponse(response, 200, apimessages.account.updated);
});


test('@api - Test Case 14: GET user account detail by email', async ({apiClient}) => {
    const registrationFormData = new RegistrationFormDataBuilder()
        .build();
    tempUsers.push(registrationFormData);

    await test.step('Arrange', async () => {
        const response = await apiClient.post(apiendpoints.account.create, registrationFormData);
        await verifyResponse(response, 201, apimessages.account.created);
    });

    const response = await apiClient.get(apiendpoints.account.get, registrationFormData);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.user.id).toBeGreaterThan(0)
    expect(body.user.email).toEqual(registrationFormData.email)
});
