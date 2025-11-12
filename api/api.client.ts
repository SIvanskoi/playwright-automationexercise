import { APIRequestContext, APIResponse} from '@playwright/test';
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

}