// Auth Endpoints
export const AUTH_LOGIN = '/v1/api/auth/login';
export const AUTH_REGISTER = '/v1/api/auth/register';
export const AUTH_LOGOUT = '/v1/api/auth/logout';
export const AUTH_FORGOT_PASSWORD = '/v1/api/auth/forgot-password';

// User Endpoints
export const USER_GET_PROFILE = '/api/user/profile';
export const USER_UPDATE_PROFILE = '/api/user/profile';
export const USER_DELETE_ACCOUNT = '/api/user/delete';

// Activity Endpoints
export const ACTIVITY_GET_ALL = '/api/activity/list';
export const ACTIVITY_CREATE = '/api/activity/create';
export const ACTIVITY_UPDATE = '/api/activity/update/:id';
export const ACTIVITY_DELETE = '/api/activity/delete/:id';

// Location Endpoints
export const LOCATION_GET_ALL = '/api/location/list';
export const LOCATION_CREATE = '/api/location/create';
export const LOCATION_UPDATE = '/api/location/update/:id';
export const LOCATION_DELETE = '/api/location/delete/:id';
export const LOCATION_GET_BY_ID = '/api/location/:id';

// Chat Endpoints
export const CHAT_GET_CONVERSATIONS = '/api/chat/conversations';
export const CHAT_GET_MESSAGES = '/api/chat/messages/:chatId';
export const CHAT_SEND_MESSAGE = '/api/chat/message/send';

// Match Endpoints
export const MATCH_GET_ALL = '/api/match/list';
export const MATCH_CREATE = '/api/match/create';
export const MATCH_GET_BY_ID = '/api/match/:id';
