import api from './api';

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    type?: string;
    expiresIn?: number;
}

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        // Note: the auth controller in IAM might not have the /v1/finance prefix,
        // so we need to hit the root auth endpoint. Providing the full path overrides the baseURL if necessary, 
        // or we can just rely on the proxy if it routes everything.
        // The backend AuthController typically sits at /api/v1/iam/auth/login or similar.
        // Let's assume /auth/login based on common Spring Boot setups.
        const response = await api.post<LoginResponse>('/auth/login', {
            email,
            password
        });
        return response.data;
    }
};
