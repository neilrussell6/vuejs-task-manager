const DOMAIN_DEVELOPMENT = 'http://localhost:8080/';
const DOMAIN_PRODUCTION = 'https://task-manager-api.neilrussell.co.za/';
export const DOMAIN = (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') ? DOMAIN_PRODUCTION : DOMAIN_DEVELOPMENT;
export const API_PREFIX = 'api';
export const ARTIFICIAL_DELAY = 1000;
export const LOGIN_DELAY = 0;
export const ARTIFICIAL_DELAY_DEFAULT = false;
export const MINIMAL_MESSAGE_DEFAULT = false;
