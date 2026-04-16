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
