import { APIRequestContext, APIResponse, expect} from '@playwright/test';
import { RegistrationFormData } from '../utils/fakeuser'

export class ApiClient {

    private request: APIRequestContext;
    private defaultContentType: string;

    constructor(request: APIRequestContext) {
        this.request = request;
        this.defaultContentType = 'application/x-www-form-urlencoded';
    }

    /**
    * Converts object to x-www-form-urlencoded format
    */
    private toFormUrlEncoded(data: Record<string, any>): string {
        return Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&');
    }

    private async post(endpoint: string, data: Record<string, any>, options?: { headers?: Record<string, string>; }): Promise<APIResponse> {
        const payload = this.toFormUrlEncoded(data);
    
        return await this.request.post(endpoint, {
            data: payload,
            headers: {
                'Content-Type': this.defaultContentType,
                ...options?.headers
            }     
        });
    }

    private async get(endpoint: string, params?: Record<string, any>, options?: { headers?: Record<string, string>; }): Promise<APIResponse> {
        const url = params ? `${endpoint}?${this.toFormUrlEncoded(params)}` : endpoint;

        return await this.request.get(url, {
            headers: options?.headers
        });
    }

    private async put(endpoint: string, data: Record<string, any>, options?: { headers?: Record<string, string>; }): Promise<APIResponse> {
        const payload = this.toFormUrlEncoded(data);
    
        return await this.request.put(endpoint, {
            data: payload,
            headers: {
                'Content-Type': this.defaultContentType,
                ...options?.headers
            },
        });
    }

    private async delete(endpoint: string, data: Record<string, any>, options?: { headers?: Record<string, string>;  }): Promise<APIResponse> {
        const payload = this.toFormUrlEncoded(data);

        return await this.request.delete(endpoint, {
            data: payload,
            headers: {
                'Content-Type': this.defaultContentType, 
                ...options?.headers,
            }
        });
    }


    async createAccount(formData: Partial<RegistrationFormData>): Promise<APIResponse> {
        return await this.post('/api/createAccount', formData)
    }

    async deleteAccount(formData: Partial<RegistrationFormData>): Promise<APIResponse> {
        return await this.delete('/api/deleteAccount', { 'email' : formData.email, 'password' : formData.password })
    }

    async getUserDetails(formData: Partial<RegistrationFormData>): Promise<APIResponse> {
        return await this.get('/api/getUserDetailByEmail', { 'email' : formData.email })    
    }

    /* ------------------ AI generated ----------------------------------------------------
    That method is a compact and elegant way to safely access deeply nested values in an object using a dot-separated string path. 
    
    ✅ path.split('.')
        - Converts a string like "user.address.city" into an array:
        ["user", "address", "city"]

    ✅ .reduce((current, key) => current?.[key], obj)
        - Iteratively walks through the object using each key.
        - current?.[key] uses optional chaining to avoid errors if a property is missing.
        - Starts with the original object obj, and drills down step-by-step.

    🧪 Example Usage
        const data = {
            user: {
                address: {
                    city: "Kharkiv"
                }
            }
        };

        const city = getNestedValue(data, "user.address.city");
        console.log(city); // "Kharkiv"


        If any part of the path is missing (e.g., address is undefined), it safely returns undefined instead of throwing an error.
    
    /**
    * Verify response contains field
    
    async verifyJsonField(fieldPath: string, expectedValue?: any): Promise<void> {
        const json = await this.json();
        const value = this.getNestedValue(json, fieldPath);
    
        if (expectedValue !== undefined) {
            expect(value).toBe(expectedValue);
        } else {
            expect(value).toBeDefined();
        }
    }

    /**
    * Get nested value from object
   
    private getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    ------------------ AI generated ---------------------------------------------------- */

}

export async function verifyResponse(response: APIResponse, statusCode?: number, message?: string): Promise<void> {
    const json = await response.json()
    if (statusCode) {
        expect(json.responseCode).toBe(statusCode)
    }
    if (message) {
        expect(json.message).toBe(message)
    }
}