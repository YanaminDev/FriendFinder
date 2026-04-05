// ============ AUTH ENDPOINTS ============
export const AUTH_LOGIN = '/v1/api/auth/login';
export const AUTH_REGISTER = '/v1/api/auth/register';
export const AUTH_LOGOUT = '/v1/api/auth/logout';
export const AUTH_FORGOT_PASSWORD = '/v1/api/auth/forgot-password';

// ============ ACTIVITY ENDPOINTS ============
export const ACTIVITY_GET_ALL = '/v1/activity/activity';
export const ACTIVITY_GET_BY_ID = (id: string) => `/v1/activity/activity/${id}`;
export const ACTIVITY_CREATE = '/v1/activity/create/activity';
export const ACTIVITY_UPDATE = (id: string) => `/v1/activity/update/activity/${id}`;
export const ACTIVITY_DELETE = '/v1/activity/delete/activity';

// ============ LOCATION ENDPOINTS ============
export const LOCATION_GET_ALL = '/v1/location/get';
export const LOCATION_GET_BY_ID = (id: string) => `/v1/location/get/${id}`;
export const LOCATION_CREATE = '/v1/location/create';
export const LOCATION_UPDATE = (id: string) => `/v1/location/update/${id}`;
export const LOCATION_DELETE = '/v1/location/delete';
export const LOCATION_GET_BY_POSITION = (positionId: string) => `/v1/location/get/${positionId}`;

// ============ USER ENDPOINTS ============
export const USER_GET_PROFILE = '/v1/user/profile';
export const USER_UPDATE_PROFILE = '/v1/user/update';
export const USER_DELETE = '/v1/user/delete';

// ============ MAP ENDPOINTS ============
export const MAP_GET_TOKEN = '/v1/map/token';
