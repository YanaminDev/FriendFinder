const BASE_URL = "http://192.168.1.100:3000";

const headers = { "Content-Type": "application/json" };

async function request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            credentials: "include",
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(error.message ?? response.statusText);
        }
        return response.json();
    } catch (error) {
        console.error(`API Error [${method} ${BASE_URL}${endpoint}]:`, error);
        throw error;
    }
}

async function upload<T>(endpoint: string, formData: FormData, method: "POST" | "PUT" = "POST"): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        credentials: "include",
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
