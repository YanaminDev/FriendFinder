const BASE_URL = __DEV__ ? "http://192.168.1.169:3000" : "https://api.friendsfinders.uk";

const getHeaders = () => {
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

async function refreshAccessToken(): Promise<string | null> {
    try {
        const storeModule = require('../redux/store');
        const { store } = storeModule;
        const state = store.getState();
        const refreshToken = state.auth?.refreshToken;

        if (!refreshToken) return null;

        const response = await fetch(`${BASE_URL}/v1/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: refreshToken }),
        });

        if (!response.ok) return null;

        const data = await response.json();
        if (data.accessToken) {
            const { setAccessToken } = require('../redux/authSlice');
            store.dispatch(setAccessToken(data.accessToken));
            const { saveAccessToken } = require('../utils/tokenStorage');
            await saveAccessToken(data.accessToken);
            return data.accessToken;
        }
        return null;
    } catch (error) {
        console.error('Token refresh failed:', error);
        return null;
    }
}

async function request<T>(method: string, endpoint: string, body?: unknown, isRetry: boolean = false): Promise<T> {
    try {
        const headers = getHeaders();

        let response = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            credentials: "include",
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });

        if (response.status === 401 && !isRetry && endpoint !== '/v1/api/auth/refresh') {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                const newHeaders = { ...headers, Authorization: `Bearer ${newAccessToken}` };
                response = await fetch(`${BASE_URL}${endpoint}`, {
                    method,
                    credentials: "include",
                    headers: newHeaders,
                    body: body !== undefined ? JSON.stringify(body) : undefined,
                });
            }
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            const apiError = new Error(error.message ?? error.error ?? response.statusText) as any;
            apiError.status = response.status;
            apiError.data = error;
            throw apiError;
        }
        return response.json();
    } catch (error) {
        const status = (error as any)?.status;
        if (status !== 404 && !endpoint.includes('active')) {
            console.error(`API Error [${method} ${BASE_URL}${endpoint}]:`, error);
        }
        throw error;
    }
}

async function upload<T>(endpoint: string, formData: FormData, method: "POST" | "PUT" = "POST", isRetry: boolean = false): Promise<T> {
    const storeModule = require('../redux/store');
    const store = storeModule.store;
    const state = store.getState();
    const accessToken = state.auth?.accessToken;

    const headers: Record<string, string> = {};
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    let response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        credentials: "include",
        headers,
        body: formData,
    });

    if (response.status === 401 && !isRetry) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
            const newHeaders = { Authorization: `Bearer ${newAccessToken}` };
            response = await fetch(`${BASE_URL}${endpoint}`, {
                method,
                credentials: "include",
                headers: newHeaders,
                body: formData,
            });
        }
    }

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
