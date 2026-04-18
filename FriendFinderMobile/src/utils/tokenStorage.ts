import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'ff_access_token';
const REFRESH_TOKEN_KEY = 'ff_refresh_token';
const USER_ID_KEY = 'ff_user_id';

export const saveAuthData = async (accessToken: string, refreshToken: string, userId: string) => {
    await Promise.all([
        SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
        SecureStore.setItemAsync(USER_ID_KEY, userId),
    ]);
};

export const getAuthData = async () => {
    const [accessToken, refreshToken, userId] = await Promise.all([
        SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.getItemAsync(USER_ID_KEY),
    ]);
    return { accessToken, refreshToken, userId };
};

export const saveAccessToken = async (accessToken: string) => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
};

export const clearAuthData = async () => {
    await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_ID_KEY),
    ]);
};
