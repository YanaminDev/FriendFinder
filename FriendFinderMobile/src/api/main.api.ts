const BASE_URL = __DEV__ ? "http://192.168.1.46:3000" : "https://api.friendsfinders.uk";

const getHeaders = () => {
    // Lazy load store to avoid circular dependency
    const storeModule = require('../redux/store');
    const store = storeModule.store;
    const state = store.getState();
    const accessToken = state.auth?.accessToken;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }
    return headers;
};

async function request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
    try {
        const headers = getHeaders();

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            credentials: "include",
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            const apiError = new Error(error.message ?? response.statusText) as any;
            apiError.status = response.status;
            apiError.data = error;
            throw apiError;
        }
        return response.json();
    } catch (error) {
        // ถ้าเป็น 404 หรือ error ที่คาดหวัง ก็ไม่ต้อง log
        const status = (error as any)?.status;
        if (status !== 404 && !endpoint.includes('active')) {
            console.error(`API Error [${method} ${BASE_URL}${endpoint}]:`, error);
        }
        throw error;
    }
}

async function upload<T>(endpoint: string, formData: FormData, method: "POST" | "PUT" = "POST"): Promise<T> {
    // Lazy load store to avoid circular dependency
    const storeModule = require('../redux/store');
    const store = storeModule.store;
    const state = store.getState();
    const accessToken = state.auth?.accessToken;

    const headers: Record<string, string> = {};
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        credentials: "include",
        headers,
        body: formData,
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message ?? response.statusText);
    }
    return response.json();
}

const mainApi = {
    get: <T>(endpoint: string) => request<T>("GET", endpoint),
    post: <T>(endpoint: string, body?: unknown) => request<T>("POST", endpoint, body),
    put: <T>(endpoint: string, body?: unknown) => request<T>("PUT", endpoint, body),
    delete: <T>(endpoint: string, body?: unknown) => request<T>("DELETE", endpoint, body),
    upload: <T>(endpoint: string, formData: FormData, method?: "POST" | "PUT") => upload<T>(endpoint, formData, method),
};

export default mainApi;
