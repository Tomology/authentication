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

'express-session' provides a session middleware for express.

`npm install express-session`

---

Import 'express-session'

`const session = require('express-session')`

Usage

`session(options)`

Options

`'express-session'` accepts the following properties in the options object.



### Implementation
