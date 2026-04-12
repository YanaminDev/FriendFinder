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
export const LOCATION_DELETE = (id: string) => `/v1/location/delete/${id}`;
export const LOCATION_GET_BY_POSITION = (positionId: string) => `/v1/location/get-by-position/${positionId}`;

// ============ USER ENDPOINTS ============
export const USER_GET_PROFILE = '/v1/user/profile';
export const USER_UPDATE_PROFILE = '/v1/user/update';
export const USER_DELETE = '/v1/user/delete';

// ============ POSITION ENDPOINTS ============
export const POSITION_GET_ALL = '/v1/position/get';
export const POSITION_GET_BY_ID = (id: string) => `/v1/position/get/${id}`;
export const POSITION_CREATE = '/v1/position/create';
export const POSITION_UPDATE = (id: string) => `/v1/position/update/${id}`;
export const POSITION_DELETE = (id: string) => `/v1/position/delete/${id}`;
export const POSITION_SEARCH_NEARBY = '/v1/position/search-nearby';
export const POSITION_UPLOAD_IMAGES = (id: string) => `/v1/position/upload-images/${id}`;

// ============ LOCATION IMAGE ENDPOINTS ============
export const LOCATION_IMAGE_UPLOAD = '/v1/location-image/upload';
export const LOCATION_IMAGE_GET_SIGNED_URL = (locationId: string) => `/v1/location-image/get-signed-url/${locationId}`;
export const LOCATION_IMAGE_DELETE = (imageId: string) => `/v1/location-image/delete/${imageId}`;

// ============ MAP ENDPOINTS ============
export const MAP_GET_TOKEN = '/v1/map/token';

// ============ ADMIN ENDPOINTS ============
export const ADMIN_GET_ALL_USERS = '/v1/api/admin/users';
export const ADMIN_UPDATE_USER_ROLE = (id: string) => `/v1/api/admin/users/${id}/role`;
export const ADMIN_BAN_USER = (id: string) => `/v1/api/admin/users/${id}/ban`;
export const ADMIN_UNBAN_USER = (id: string) => `/v1/api/admin/users/${id}/unban`;
