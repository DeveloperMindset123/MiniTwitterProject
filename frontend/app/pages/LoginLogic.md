### Logic behind login implementation:

* Create a new page for each login category (SU, CU, Regular User) --> once we implement the functionalities for each such users
* On each login page, create a form with the neccessary fields, e.g., username and password.
* When the user submits the form, validate the input and send it to the backend server using axios
* On the backend server, use express.js to handle the login requests.
* Authenticate the user and generate a JSON Web Token (JWT)
* Send the JWT back to the client.
* Store the JWT in the browser's local storage
* Redirect the user to the appropriate page based on their login category.
* Create a middleware function that checks for the presence of a valid JWT in the request headers. If the JWT is valid, allow the request to proceed. Otherwise, return an error response.
* Use the middleware function to protect any routes in your backend application that you want to restrict to authorized users.

Additionally, the following verification features needs to be implemented:
- <b><u>Terms and Agreements:</u></b> Create a terms and agreements page that users must agree to before they can proceed. There's third-party services available such as TermsFeed, or iubenda, to generate the terms and agreements.

- <b><u>Age Verification:</u></b> Implement a mechanism to verify the age of the users. There's third party tools such as "AgeVerify" or "OnFido", to verify the age of the users.

- <b><u>Content Moderation:</u></b> Implement a mechanism to moderate the content that is posted on the platform. There's third party services such as "Google Cloud Natural Language" or "Amazon Rekognition" that can be used to moderate content.

To Further Breakdown the above logic...

#### Frontend:
1. On each login page, create a form with the neccessary fields, e.g. username, password, email and phone number (for corporate users only)
2. When the user submits the form, validate the input and send it to the backend server using Axios.

#### Backend:
1. Create an express.js project.
2. Create a new route for each login category, e.g. `/admin/login`, `/corporate/login`, `/regular/login` and `/surfer/login`.
3. On each login route, validate the input and authenticate the user.
4. If the user authenticates successfully, generate a JSON Web Token (JWT) and send it back to the client.

#### Shared
1. Create a new file called `types.ts` and define the types for your users and JWTs.
2. Create a new file called `constants.ts` and define the constants for your application, e.g. the JWT secret key and the terms and conditions URL.
3. Create a new file called `utils.ts` and define the utillity function for your application, e.g. a function to verify JWTs.

#### Login Flow
1. The user visits the login page for the desired login category.
2. The user enters their credentials and submits the form.
3. The frontend validates the input and sends the credentials to the backend server.
4. The backend server validates the credentials and authenticates the user.
5. If the user authenticated successfully, the backend server generates a JWT and sends it back to the client.
6. The frontend stores the JWT in the browser's local storage and redirects the user to the appropriate page based on their login category.
