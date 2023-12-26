# About

- Created a REST api to be consumed by a mobile app, which is somewhat similar to TrueCaller
  which tell you if a number is spam, or allow you to find a person’s name by searching for their phone number or vice-versa.

### Tech Stack

- Language : Typescript
- Database : PostgreSql
- ORM : Prisma

# Prerequisites

1. node.js
2. typescript should be installed
3. local postgresql database string

### Step 1

1. run `npm install` in the root directory of project
2. Fill up values in .env file

- DATABASE_URL: replace the username password with your credentials for your local database and make
  sure it is hosted on port 5432.
- SALT: A complex string used to hash password.
- SECRET: A complex string used to sign a jwt token.

3.  run `npx prisma migrate dev --name init` to generate tables in your local DB
4.  run `tsc`
5.  populate database by running `node dist/utils/populate.js`
6.  after that run `node dist/app.js`. This will start the backend on port 3000

### Routes for testing

1. POST : http://localhost:3000/api/register

- body: {
  "name":"sample name",
  "phoneNumber":"9876543201",
  "password":"testpassword123",
  "email":"name@example.com"
  }

- About
  - Register's new users, Only one user can register on the app with a particular phone number.
  - A user has to register with at least name and phone number, along with a password, before
    using. He can optionally add an email address.
  - A user needs to be logged in to do anything; there is no public access to anything.
  - We will assume that the user’s phone contacts will be automatically imported into the app’s
    database - we have't implemented importing the contacts.

2. GET : http://localhost:3000/api/login

- body: {
  "phoneNumber":"9876543201",
  "password":"testpassword123"
  }

- About
  - Login route for user to login using phone number and password.
  - A user needs to be logged in to do anything; there is no public access to anything.

3. POST : http://localhost:3000/api/spam

- body : {
  "phoneNumber":"9876543201"
  }
- Headers:{
  "Authorization":"Bearer jwt-token-recieved when logged in"
  }

- About
  - A user should be able to mark a number as spam so that other users can identify spammers via
    the global database. Note that the number may or may not belong to any registered user or
    contact - it could be a random number.

4. GET : http://localhost:3000/api/search?value=search_query

- Headers:{
  "Authorization":"Bearer jwt-token-recieved when logged in"
  }

- About

  - A user can search for a person by name in the global database. Search results will display the
    name, phone number and spam likelihood for each result matching that name completely or partially.
    Results will first show people whose names start with the search query, and then people
    whose names contain but don’t start with the search query.

  - A user can search for a person by phone number in the global database. If there is a registered
    user with that phone number, Only that result would be shown. Otherwise, All results matching that
    phone number completely would be shown.

5. GET : http://localhost:3000/api/user?name=sample name&phoneNumber=9876543201&spam=false

- Headers:{
  "Authorization":"Bearer jwt-token-recieved when logged in"
  }

- About
  - Clicking a search result displays all the details for that person along with the spam likelihood.
    But the person’s email is only displayed if the person is a registered user and the user who is
    searching is in the person’s contact list.
