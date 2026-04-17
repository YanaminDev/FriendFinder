// ============ AUTH ENDPOINTS ============
export const AUTH_LOGIN = '/v1/api/auth/login';
export const AUTH_REGISTER = '/v1/api/auth/register';
export const AUTH_LOGOUT = '/v1/api/auth/logout';
export const AUTH_FORGOT_PASSWORD = '/v1/api/auth/forgot-password';
export const ADMIN_VERIFY = '/v1/api/admin/verify';
export const USER_SET_OFFLINE = '/v1/api/auth/set-offline';

// ============ ACTIVITY ENDPOINTS ============
export const ACTIVITY_GET_ALL = '/v1/activity/activity';
export const ACTIVITY_ADMIN_GET_ALL = '/v1/activity/admin/activity';
export const ACTIVITY_GET_BY_ID = (id: string) => `/v1/activity/activity/${id}`;
export const ACTIVITY_CREATE = '/v1/activity/create/activity';
export const ACTIVITY_UPDATE = '/v1/activity/update/activity';
export const ACTIVITY_DELETE = '/v1/activity/delete/activity';

// ============ LOCATION ENDPOINTS ============
export const LOCATION_GET_ALL = '/v1/location/get';
export const LOCATION_GET_BY_ID = (id: string) => `/v1/location/get/${id}`;
export const LOCATION_CREATE = '/v1/location/create';
export const LOCATION_UPDATE = (id: string) => `/v1/location/update/${id}`;
export const LOCATION_DELETE = (id: string) => `/v1/location/delete/${id}`;
export const LOCATION_GET_BY_POSITION = (positionId: string) => `/v1/location/get-by-position/${positionId}`;
export const LOCATION_GET_BY_POSITION_WITH_IMAGES = (positionId: string) => `/v1/location/get-by-position-with-images/${positionId}`;

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
export const POSITION_UPLOAD_IMAGES = (id: string) => `/v1/position/upload-image/${id}`;

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

// ============ MATCH ENDPOINTS ============
export const MATCH_ADMIN_ALL_REVIEWS = '/v1/match/admin/all-reviews';

// ============ LOOKUP TABLE ENDPOINTS ============
// Looking For
export const LOOKING_FOR_GET_ALL = '/v1/life-style/looking-for/get';
export const LOOKING_FOR_CREATE = '/v1/life-style/looking-for/create';
export const LOOKING_FOR_UPDATE = '/v1/life-style/looking-for/update';
export const LOOKING_FOR_DELETE = '/v1/life-style/looking-for/delete';

// Drinking
export const DRINKING_GET_ALL = '/v1/life-style/drinking/get';
export const DRINKING_CREATE = '/v1/life-style/drinking/create';
export const DRINKING_UPDATE = '/v1/life-style/drinking/update';
export const DRINKING_DELETE = '/v1/life-style/drinking/delete';

// Smoke
export const SMOKE_GET_ALL = '/v1/life-style/smoke/get';
export const SMOKE_CREATE = '/v1/life-style/smoke/create';
export const SMOKE_UPDATE = '/v1/life-style/smoke/update';
export const SMOKE_DELETE = '/v1/life-style/smoke/delete';

// Workout
export const WORKOUT_GET_ALL = '/v1/life-style/workout/get';
export const WORKOUT_CREATE = '/v1/life-style/workout/create';
export const WORKOUT_UPDATE = '/v1/life-style/workout/update';
export const WORKOUT_DELETE = '/v1/life-style/workout/delete';

// Pet
export const PET_GET_ALL = '/v1/life-style/pet/get';
export const PET_CREATE = '/v1/life-style/pet/create';
export const PET_UPDATE = '/v1/life-style/pet/update';
export const PET_DELETE = '/v1/life-style/pet/delete';

// Education
export const EDUCATION_GET_ALL = '/v1/education/education';
export const EDUCATION_CREATE = '/v1/education/create/education';
export const EDUCATION_UPDATE = '/v1/education/update/education';
export const EDUCATION_DELETE = '/v1/education/delete/education';

// Language
export const LANGUAGE_GET_ALL = '/v1/language/language';
export const LANGUAGE_CREATE = '/v1/language/create/language';
export const LANGUAGE_UPDATE = '/v1/language/update/language';
export const LANGUAGE_DELETE = '/v1/language/delete/language';

// ============ USER INFORMATION ENDPOINTS ============
export const USER_INFORMATION_GET = (userId: string) => `/v1/user-information/get/${userId}`;

// ============ USER LIFE STYLE ENDPOINTS ============
export const USER_LIFE_STYLE_GET = (userId: string) => `/v1/user-life-style/get/${userId}`;


// Chat Endpoints
export const CHAT_GET_CONVERSATIONS = '/api/chat/conversations';
export const CHAT_GET_MESSAGES = '/api/chat/messages/:chatId';
export const CHAT_SEND_MESSAGE = '/api/chat/message/send';

// Match Endpoints
export const MATCH_GET_ALL = '/api/match/list';
export const MATCH_CREATE = '/api/match/create';
export const MATCH_GET_BY_ID = '/api/match/:id';
