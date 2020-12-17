# Authentication methods using Node/Express

## Table of Contents

1. [Session Based Authentication](#session-based-authentication)

   - [Introduction](#introduction)
   - [Dependencies](#dependencies)

2. Token Based Authentication

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

#### 'express-session'

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

`domain`<br>
Host to which the cookie will be set. If omitted, defaults to the host of the current URL.

`maxAge`<br>
Number of milliseconds until the cookie expires. Sets the `expires` option by taking the
current server time and adding `maxAge` milliseconds to the value to calculate an `Expires`
datetime. By default, no maximum age is set.

`expires`<br>
The maximum lifetime of the cookie. By default, no expiration is set, and most clients will
consider this a "non-persistent" cookie and will delete it on a condition like exiting a web
browser application.
**Note:** If both `expires` and `maxAge` are set in the options, then the last one defined is
what is used. The `expires` option should not be set directly; instead only use the `maxAge`
option.

`httpOnly`<br>
Forbids JavaScript from accessing the cookie, e.g. through the `Document.cookie` property, when
set to `true`.

`path`<br>
A path that must exist in the requested URL, or the browser won't send the `Cookie` header. By default,
this is set to '/', which is the root path of the domain.

`sameSite`<br>
Controls whether a cookie is sent with cross-origin requests, providing some protection against
CSRF attacks.

`secure`<br>
If set to true, will only send the cookie with an encrypted request over the HTTPS protocol, never with unsercured HTTP (except on localhost).

`genid`<br>
Function to call to generate a new session ID. Provide a function that returns a string that will be used as a session ID. The function is given `req` as the first argument if you want to use some value attached to `req` when generating the ID.
The default value is a function which uses the `uid-safe` library to generate IDs.

`name`<br>
The name of the session ID cookie to set in the response and read from in the request. The default value is `connect.sid`.

### Implementation
