// Declare consts for Auth0 details reqired in this app

const CREATE_BOOK = "create:books";
const READ_BOOK = "read:books";
const UPDATE_BOOK = "update:books";
const DELETE_BOOK = "delete:books";

// The Auth0 client id for this app
const AUTH0_CLIENT_ID = "XvodKBO6BTNmPKn2RKmEwXelCFT344ch";

//My Auth0 domain aka account/ tenant
const AUTH0_DOMAIN = "faisal-islam.eu.auth0.com";

// This value is the 'identifier' in my book API settings
const AUDIENCE = "https://booksapi.com";

// it tells Where Auth0 should return the token to after authentication process done
const AUTH0_CALLBACK_URL = "http://localhost:3000";

// Initialise Auth0 connection with parameters defined above
const auth0WebAuth = new auth0.WebAuth({
  domain: AUTH0_DOMAIN,
  clientID: AUTH0_CLIENT_ID,
  redirectUri: AUTH0_CALLBACK_URL,
  responseType: "id_token token",
  audience: AUDIENCE,
});

const auth0Authentication = new auth0.Authentication(auth0WebAuth, {
  domain: AUTH0_DOMAIN,
  clientID: AUTH0_CLIENT_ID,
});
