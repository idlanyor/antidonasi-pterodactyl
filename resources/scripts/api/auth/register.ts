import http from '@/api/http';

export interface RegisterResponse {
    success: boolean;
    intended?: string;
}

export interface RegisterData {
    username: string;
    email: string;
    name_first: string;
    name_last: string;
    password: string;
    password_confirmation: string;
    recaptchaData?: string | null;
}

export default (data: RegisterData): Promise<RegisterResponse> => {
    return new Promise((resolve, reject) => {
        http.get('/sanctum/csrf-cookie')
            .then(() =>
                http.post('/auth/register', {
                    ...data,
                    'g-recaptcha-response': data.recaptchaData,
                })
            )
            .then((response) => {
                return resolve({
                    success: response.data.success,
                    intended: response.data.data.intended || undefined,
                });
            })
            .catch(reject);
    });
};
