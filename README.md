# Authentication methods using Node/Express

## Table of Contents

1. [Session Based Authentication](#session-based-authentication)

   - [Introduction](#introduction)
   - [Dependencies](#dependencies)

2. [Token Based Authentication](<#token-based-authentication-(jwt)>)

   - [Introduction](#introduction)
   - [Dependencies](#dependencies)

3. [Managing Passwords](#managing-passwords)

## Session Based Authentication

### Introduction

#### What is a session?

A server-side storage of information that is desired to persist throughout the user's interaction with the web site or web application.

A unique identifier is stored on the client side (called a "session id"). This session id is passed to the web server every time the browser makes an HTTP request. The web application pairs this session id with its internal database and retrieves the stored variables for use by the requested page.

Simple Walkthrough:

    1. User submits login form
    2. Server stores a session and responds with a session id
    3. Browser puts session id in a cookie
    4. Browser sends cookies with future requests
    5. The server can respond with data designed for the currently logged in user

#### What is a cookie?

A cookie is a small piece of text stored on a user's computer by their browser.

### Dependencies

'express-session'

`npm install express-session`

'express-session' provides a session middleware for express.

##### Usage

`const session = require('express-session')`

`session(options)`

##### Options

`'express-session'` accepts the following properties in the options object:

**cookie**<br>

An object that contains the settings for the session ID cookie. The default value is:
` { path: '/', httpOnly: true, secure: false, maxAge: null, }`

The following options can be set in this object:

- `domain`<br>
  Host to which the cookie will be set. If omitted, defaults to the host of the current URL.

- `maxAge`<br>
  Number of milliseconds until the cookie expires. Sets the `expires` option by taking the current server time and adding `maxAge` milliseconds to the value to calculate an `Expires` datetime. By default, no maximum age is set.

- `expires`<br>
  The maximum lifetime of the cookie. By default, no expiration is set, and most clients will consider this a "non-persistent" cookie and will delete it on a condition like exiting a web browser application.
  **Note:** If both `expires` and `maxAge` are set in the options, then the last one defined is what is used. The `expires` option should not be set directly; instead only use the `maxAge` option.

- `httpOnly`<br>
  Forbids JavaScript from accessing the cookie, e.g. through the `Document.cookie` property, when set to `true`. That is, the cookie is accessible server-side only.

- `path`<br>
  A path that must exist in the requested URL, or the browser won't send the `Cookie` header. By default, this is set to '/', which is the root path of the domain.

- `sameSite`<br>
  Controls whether a cookie is sent with cross-origin requests (that is, whether a cookie is sent with requests initiated from third-party websites), providing some protection against CSRF attacks. The `sameSite` property can be set to the following values:<br><br> - `Strict`: The cookie will not be sent along with requests initiated by third party websites. This can affect browsing experience negatively. For example, if you click on a link that points to a Facebook profile page, and if Facebook.com has set its cookie as `SameSite=Strict`, you cannot continue navigation on Facebook unless you log in to Facebook again. The reason for this is bevause Facebook's cookie was not sent by this request.<br><br> - `Lax`: The cookie will not be sent on nomral cross-site subrequests (for example to load images or frames into a third party site), but are sent when the user is navigating to the origin site (i.e. when following a link).<br><br> - `None`: The cookie will be sent along with all with requests initiated by third party websites. Note: `sameSite` can only be set to `None` if the `secure` attribtue is set to `true`.

- `secure`<br>
  If set to true, will only send the cookie with an encrypted request over the HTTPS protocol, never with unsercured HTTP (except on localhost).

**genid**<br>
Function to call to generate a new session ID. Provide a function that returns a string that will be used as a session ID. The function is given `req` as the first argument if you want to use some value attached to `req` when generating the ID.
The default value is a function which uses the `uid-safe` library to generate IDs.

**name**<br>
The name of the session ID cookie to set in the response and read from in the request. The default value is `connect.sid`.

**proxy**<br>
Trust the reverse proxy when setting secure cookies (via the "X-Forwarded-Proto" header). The default value is `undefined`.

**resave**<br>
Forces the session to be saved back to the session store, even if the session was never modified during the request. Default value is `true`, but using the default has been deprecated, as the default will change in the future. Typically, you'll want `false`.

**rolling**<br>
Force the session identifier cookie to be set on every response. The expiration is reset to the original `maxAge`, resetting the expiration countdown. The default value is `false`. Note: when this option is set to `true` but the `saveUninitialized` option is set to `false`, the cookie will not be set on a response with an uninitialized session.

**saveUninitialized**<br>
Forces a session that is "uninitialized" to be saved to the sotre. A session is uninitialized whn it is new but not modified. Choosing `false` is useful for implementing login sessions, redusing server storage usage, or complying with laws that require permission before setting a cookie. The default value is `true`.

**secret**<br>
Required option. This is the secret used to sign the session ID cookie. This can be either a string for a single secret, or an array of multiple secrets. If an array of secrets is provided, only the first element will be used to sign the session ID cookie, while all the elements will be considered when verifying the signature in requests.

**store**<br>
The session store instance, defaults to a new `MemoryStore` instance.

**unset**<br>
Control the result of unsetting `req.session` (through `delete`, setting to `null`, etc.). The default value is `keep`.<br>

- `destroy` - The session wil be destroyed when the response ends.<br>
- `keep` - The session in the store will be kept, but modifications made during the request are ignored and not saved.

### Implementation

## Token Based Authentication (JWT)

### Introduction

JSON Web Tokens (JWT) are a stateless solution for authentication - there is no need to store any session on the server. They are suited for RESTful APIs.

An encoded JWT looks like a string. It is made up of three parts:

1. Header<br>
   Metadata about the token itself. Typically consists of two parts: the type of token, which is JWT, and the signing algorithm being used, such as HMAC SHA256 or RSA.Then, this JSON is Base64Url encoded to form the first part of the JWT.<br><br>
2. Payload<br>
   Data that we can encode into the token. Note: This data (as well as the metadata in the header) is encoded but not encrypted. Anyone will be able to decode them and read them. Sensitive data shouldn't be stored here. The payload is Base64Url encoded.<br><br>
3. Signature<br>
   The signature is created by taking the encoded header, the encoded payload, the secret that is saved on the server, and then using the algorithm specified in the header. The signature is used to verify the message wasn't changed along the way, and, in the case of tokens signed with a private key, it can also verify that the sender of the JWT is who it says it is.<br><br>

When a JWT is sent to a server, the server needs to verify it i.e. verify that no-one has changed the header or the payload data of the token. The verification will take the header and payload, along with the secret which is saved on the server, and create a test signature. The original signature when the JWT was first created is still in the token. The test signature is compared to the original signature. If test signature is the same as the original signature, then it means that the payload and the header have not been modified.

Simple Walkthrough:

1. A user logs into the website. A POST request with 'email' and 'password' is sent to the server.
2. The application checks if the user exists and if the password is correct. If yes, a unique JWT for only that user is created using a secret string that is stored on the server.
3. The server sends the JWT back to the client which will store it either in a cookie or localStorage.
4. A user is logged in as soon as they receive their unique JWT, which is not stored anywhere on the server.
5. Any time the user wants to access a protected route, they send the JWT along with the request.
6. Once the request hits the server, the app will verify if the JWT is valid and if the user is actually who they say they are.
7. If valid, the requested data will be sent back to the client. If not, an error will be sent back.

Note: all JWT communication must happen over HTTPS?

### Dependencies

'jsonwebtoken'

`npm install jsonwebtoken`

### Usage

`const jwt = require('jsonwebtoken');`

Signing the token:<br>
`jwt.sign(payload, secretKey, [options, callback]);`

In authentication, the payload you want to send is the user's ID. For example:<br>
`const payload = { user: { id: user.id, }, };`

### Refresh Tokens

An extra 'count' column will be added to our users table in our database. It stores the version of the token that is live and that people are using. It is going to be unique per user.
When someone logs into our app, we are going to validate that and if it is valid, we are then going to send back two tokens - a refresh token, and an access token (both will be JWT). The refresh token will be a long lived token. The access token will expire after a short time. Inside both these tokens we will store the user ID. In the refresh token we will store the current count that the user has in the database. We will be sending these back with two cookies.
What happens when the access token expires? If the refresh token is valid, we will refresh the access token, if not, we treat them as an unauthenticated user.
Expired access token --> Server - Fetch User -> DataBase (compare count that is in the database to the count that is in the refresh token) - User -> Server --> New Access Token

## Managing Passwords

1. Include a 'confirm password' field.
2. Encyption/hashing
