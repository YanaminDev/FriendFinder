// ==================== Authentication ====================
export const CHECK_USERNAME = "/v1/api/auth/check-username";
export const REGISTER = "/v1/api/auth/register";
export const LOGIN = "/v1/api/auth/login";
export const LOGOUT = "/v1/api/auth/logout";
export const DELETE_USER = "/v1/api/auth/delete";
export const DELETE_USER_BY_ID = "/v1/api/auth/delete/:id";
export const GET_USER_PROFILE = "/v1/api/auth/profile";
export const UPDATE_USER_SHOW_NAME = "/v1/api/auth/update/name";
export const CHANGE_PASSWORD = "/v1/api/auth/change-password";
export const UPDATE_USER_INTERESTED_GENDER = "/v1/user-information/update/interested-gender";
export const CHECK_USER_ONLINE_STATUS = "/v1/api/auth/check-online-status/:user_id";

// ==================== User Image ====================
export const UPLOAD_USER_IMAGE = "/v1/user-image/upload";
export const GET_USER_IMAGE_SIGNED_URL = "/v1/user-image/get-signed-url/:userId";
export const GET_USER_IMAGE_SIGNED_URL_BY_ID = "/v1/user-image/get-signed-url/:userId/:id";
export const GET_USER_IMAGES = "/v1/user-image/get/:userId";
export const GET_PUBLIC_USER_IMAGES = "/v1/user-image/public/:userId";
export const GET_USER_IMAGE_BY_ID = "/v1/user-image/get/:userId/:id";
export const DELETE_USER_IMAGE = "/v1/user-image/delete/:imageId";
export const UPDATE_USER_IMAGE = "/v1/user-image/update/:imageId";

// ==================== Life Style - Looking For ====================
export const GET_LOOKING_FOR = "/v1/life-style/looking-for/get";
export const GET_LOOKING_FOR_BY_ID = "/v1/life-style/looking-for/get/:id";
export const CREATE_LOOKING_FOR = "/v1/life-style/looking-for/create";
export const DELETE_LOOKING_FOR = "/v1/life-style/looking-for/delete";
export const UPDATE_LOOKING_FOR = "/v1/life-style/looking-for/update";

// ==================== Life Style - Drinking ====================
export const GET_DRINKING = "/v1/life-style/drinking/get";
export const GET_DRINKING_BY_ID = "/v1/life-style/drinking/get/:id";
export const CREATE_DRINKING = "/v1/life-style/drinking/create";
export const DELETE_DRINKING = "/v1/life-style/drinking/delete";
export const UPDATE_DRINKING = "/v1/life-style/drinking/update";

// ==================== Life Style - Smoke ====================
export const GET_SMOKE = "/v1/life-style/smoke/get";
export const GET_SMOKE_BY_ID = "/v1/life-style/smoke/get/:id";
export const CREATE_SMOKE = "/v1/life-style/smoke/create";
export const DELETE_SMOKE = "/v1/life-style/smoke/delete";
export const UPDATE_SMOKE = "/v1/life-style/smoke/update";

// ==================== Life Style - Workout ====================
export const GET_WORKOUT = "/v1/life-style/workout/get";
export const GET_WORKOUT_BY_ID = "/v1/life-style/workout/get/:id";
export const CREATE_WORKOUT = "/v1/life-style/workout/create";
export const DELETE_WORKOUT = "/v1/life-style/workout/delete";
export const UPDATE_WORKOUT = "/v1/life-style/workout/update";

// ==================== Life Style - Pet ====================
export const GET_PET = "/v1/life-style/pet/get";
export const GET_PET_BY_ID = "/v1/life-style/pet/get/:id";
export const CREATE_PET = "/v1/life-style/pet/create";
export const DELETE_PET = "/v1/life-style/pet/delete";
export const UPDATE_PET = "/v1/life-style/pet/update";

// ==================== Location ====================
export const GET_LOCATION = "/v1/location/get";
export const GET_LOCATION_BY_ID = "/v1/location/get/:id";
export const GET_LOCATION_BY_POSITION = "/v1/location/get-by-position/:position_id";
export const GET_LOCATION_AI_RECOMMEND = "/v1/location/get-ai-recommend/:position_id";
export const CREATE_LOCATION = "/v1/location/create";
export const UPDATE_LOCATION = "/v1/location/update/:id";
export const DELETE_LOCATION = "/v1/location/delete/:id";

// ==================== Location Proposal ====================
export const CREATE_LOCATION_PROPOSAL = "/v1/location-proposal/create";
export const GET_LOCATION_PROPOSAL_BY_MATCH = "/v1/location-proposal/match/:match_id";
export const RESPOND_LOCATION_PROPOSAL = "/v1/location-proposal/respond";

// ==================== Location Image ====================
export const UPLOAD_LOCATION_IMAGE = "/v1/location-image/upload";
export const GET_LOCATION_IMAGE_SIGNED_URL = "/v1/location-image/get-signed-url/:locationId";
export const GET_LOCATION_IMAGE_SIGNED_URL_BY_ID = "/v1/location-image/get-signed-url/:locationId/:imageId";
export const GET_LOCATION_IMAGES = "/v1/location-image/get/:locationId";
export const GET_LOCATION_IMAGE_BY_ID = "/v1/location-image/get/:locationId/:imageId";
export const DELETE_LOCATION_IMAGE = "/v1/location-image/delete/:imageId";
export const UPDATE_LOCATION_IMAGE = "/v1/location-image/update/:imageId";

// ==================== Location Review ====================
export const GET_LOCATION_REVIEW_BY_ID = "/v1/location-review/get/:review_id";
export const GET_LOCATION_REVIEWS_BY_LOCATION = "/v1/location-review/location/:location_id";
export const GET_LOCATION_REVIEWS_BY_USER = "/v1/location-review/user/:user_id";
export const GET_LOCATION_REVIEWS_BY_MATCH = "/v1/location-review/match/:match_id";
export const CREATE_LOCATION_REVIEW = "/v1/location-review/create";
export const DELETE_LOCATION_REVIEW = "/v1/location-review/delete";

// ==================== User Review ====================
export const CREATE_USER_REVIEW = "/v1/user-review/create";
export const GET_USER_REVIEW_BY_ID = "/v1/user-review/get/:review_id";
export const GET_USER_REVIEWS_BY_REVIEWER = "/v1/user-review/reviewer/:user_id";
export const GET_USER_REVIEWS_BY_REVIEWEE = "/v1/user-review/reviewee/:user_id";
export const DELETE_USER_REVIEW = "/v1/user-review/delete";

// ==================== Select Cancel ====================
export const GET_SELECT_CANCEL = "/v1/select-cancel/select-cancel";
export const GET_SELECT_CANCEL_BY_ID = "/v1/select-cancel/select-cancel/:id";
export const CREATE_SELECT_CANCEL = "/v1/select-cancel/create/select-cancel";
export const DELETE_SELECT_CANCEL = "/v1/select-cancel/delete/select-cancel";
export const UPDATE_SELECT_CANCEL = "/v1/select-cancel/update/select-cancel";

// ==================== User Information ====================
export const CREATE_USER_INFORMATION = "/v1/user-information/create";
export const GET_USER_INFORMATION = "/v1/user-information/get/:userId";
export const UPDATE_USER_BIO = "/v1/user-information/update/bio";
export const UPDATE_USER_HEIGHT = "/v1/user-information/update/height";
export const UPDATE_USER_BLOOD_GROUP = "/v1/user-information/update/blood-group";
export const UPDATE_USER_LANGUAGE = "/v1/user-information/update/language";
export const UPDATE_USER_EDUCATION = "/v1/user-information/update/education";
export const DELETE_USER_INFORMATION = "/v1/user-information/delete";

// ==================== User Life Style ====================
export const CREATE_USER_LIFE_STYLE = "/v1/user-life-style/create";
export const GET_USER_LIFE_STYLE = "/v1/user-life-style/get/:userId";
export const UPDATE_USER_LOOKING_FOR = "/v1/user-life-style/update/looking-for";
export const UPDATE_USER_DRINKING = "/v1/user-life-style/update/drinking";
export const UPDATE_USER_PET = "/v1/user-life-style/update/pet";
export const UPDATE_USER_SMOKE = "/v1/user-life-style/update/smoke";
export const UPDATE_USER_WORKOUT = "/v1/user-life-style/update/workout";
export const DELETE_USER_LIFE_STYLE = "/v1/user-life-style/delete";

// ==================== Match ====================
export const GET_MATCH_BY_ID = "/v1/match/get/:match_id";
export const GET_ACTIVE_MATCH = "/v1/match/active/:user_id";
export const CREATE_MATCH = "/v1/match/create";
export const UPDATE_MATCH_CANCEL_STATUS = "/v1/match/update/cancel-status/:match_id";
export const UPDATE_MATCH_END = "/v1/match/update/end-match/:match_id";
export const UPDATE_MATCH_LOCATION = "/v1/match/update/location/:match_id";
export const DELETE_MATCH = "/v1/match/delete";
export const GET_ENDED_MATCHES = "/v1/match/ended/:user_id";

// ==================== Find Match ====================
export const GET_FIND_MATCH = "/v1/find-match/get/:user_id";
export const CREATE_FIND_MATCH = "/v1/find-match/create";
export const DELETE_FIND_MATCH = "/v1/find-match/delete";
export const SEARCH_FIND_MATCH = "/v1/find-match/search";
export const UPDATE_FIND_MATCH = "/v1/find-match/update";

// ==================== Chat ====================
export const CREATE_CHAT = "/v1/chat/create";
export const GET_CHAT_BY_ID = "/v1/chat/get/:chat_id";
export const GET_CHATS_BY_USER = "/v1/chat/user/:user_id";
export const DELETE_CHAT = "/v1/chat/delete/:chat_id";

// ==================== Chat Message ====================
export const SEND_MESSAGE = "/v1/chat-message/send";
export const GET_MESSAGES_BY_CHAT = "/v1/chat-message/chat/:chat_id";
export const DELETE_MESSAGE = "/v1/chat-message/delete/:message_id";
export const MARK_MESSAGES_AS_READ = "/v1/chat-message/mark-as-read/:chat_id";
export const UPLOAD_CHAT_IMAGE = "/v1/chat-message/upload-image";

// ==================== Activity ====================
export const GET_ACTIVITY = "/v1/activity/activity";
export const GET_ACTIVITY_BY_ID = "/v1/activity/activity/:id";
export const CREATE_ACTIVITY = "/v1/activity/create/activity";
export const DELETE_ACTIVITY = "/v1/activity/delete/activity";
export const UPDATE_ACTIVITY = "/v1/activity/update/activity";

// ==================== Cancellation ====================
export const CREATE_CANCELLATION = "/v1/cancellation/create";
export const GET_CANCELLATION_BY_ID = "/v1/cancellation/get/:cancellation_id";
export const GET_CANCELLATIONS_BY_MATCH = "/v1/cancellation/match/:match_id";
export const GET_CANCELLATIONS_BY_USER = "/v1/cancellation/user/:user_id";
export const GET_CANCELLATIONS_BY_REVIEWER = "/v1/cancellation/reviewer/:reviewer_id";
export const DELETE_CANCELLATION = "/v1/cancellation/delete/:cancellation_id";

// ==================== Education ====================
export const GET_EDUCATION = "/v1/education/education";
export const GET_EDUCATION_BY_ID = "/v1/education/education/:id";
export const CREATE_EDUCATION = "/v1/education/create/education";
export const DELETE_EDUCATION = "/v1/education/delete/education";
export const UPDATE_EDUCATION = "/v1/education/update/education";

// ==================== Experience ====================
export const CREATE_EXPERIENCE = "/v1/experience/create";
export const GET_EXPERIENCE_BY_ID = "/v1/experience/get/:experience_id";
export const GET_EXPERIENCES_BY_MATCH = "/v1/experience/match/:match_id";
export const GET_EXPERIENCES_BY_REVIEWER = "/v1/experience/reviewer/:reviewer_id";
export const GET_EXPERIENCES_BY_REVIEWEE = "/v1/experience/reviewee/:reviewee_id";
export const UPDATE_EXPERIENCE = "/v1/experience/update/:experience_id";
export const DELETE_EXPERIENCE = "/v1/experience/delete/:experience_id";
export const GET_EXPERIENCE_STATS = "/v1/experience/stats/:user_id";

// ==================== Language ====================
export const GET_LANGUAGE = "/v1/language/language";
export const GET_LANGUAGE_BY_ID = "/v1/language/language/:id";
export const CREATE_LANGUAGE = "/v1/language/create/language";
export const DELETE_LANGUAGE = "/v1/language/delete/language";
export const UPDATE_LANGUAGE = "/v1/language/update/language";

// ==================== Position ====================
export const CREATE_POSITION = "/v1/position/create";
export const GET_ALL_POSITIONS = "/v1/position/get";
export const GET_POSITION_BY_ID = "/v1/position/get/:position_id";
export const UPDATE_POSITION = "/v1/position/update/:position_id";
export const DELETE_POSITION = "/v1/position/delete/:position_id";
export const SEARCH_NEARBY_POSITION = "/v1/position/search-nearby";
export const UPLOAD_POSITION_IMAGE = "/v1/position/upload-image/:position_id";

// ==================== Notification ====================
export const CREATE_NOTIFICATION = "/v1/notification/create";
export const GET_PENDING_NOTIFICATIONS = "/v1/notification/pending";
export const GET_ALL_NOTIFICATIONS = "/v1/notification/all";
export const RESPOND_NOTIFICATION = "/v1/notification/respond";

// ==================== Map ====================
export const GET_MAPBOX_TOKEN = "/v1/map/token";