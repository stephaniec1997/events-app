# Events MERN App

This project was a personal project to learn backend coding. I used [Mongoose](https://mongoosejs.com) to model my data and defined routing with [Express](https://expressjs.com/en/guide/routing.html).

I have now added testing with the intent of learning. I have used both [Jest](https://jestjs.io) and [Enzyme](https://airbnb.io/enzyme/) for testing.

## Demo

You can find a demo of this project [here](https://events-app-mern.herokuapp.com).

## Running Application

To run the app you will need to add your own database uris into a .env file. From there just run:

```
(cd client && npm run start) & npm run start
```

or run on separate terminal windows (for backend development purposes run nodemon):

```
nodemon index.js
```

```
cd client
npm start
```

## App Information

The app was meant to display events created by an admin. In order to become an admin a person needs to create an account and then be added by an existing admin. As of now events only have start and end dates without times. Form validation is on the front-end instead of backend or both.

## App Information

The app was meant to display events created by an admin. In order to become an admin a person needs to create an account and then be added by an existing admin. As of now events only have start and end dates without times. Form validation is on the front-end instead of backend or both.

## Sources

My basic schemas for events and users were modeled after an existing group project that I unfortunately cannot display. The routes for events were also modeled after that. I also looked at express and mongoose documentation to understand what exactly I was doing.

Of course most learning projects cannot be accomplished without online articles/tutorials. I can't remember all that I used and if I should have given you credit lmk.

### Login System

The one I do remember was for the login system. After several hours of researching the best ways to create a login system for a MERN app, Josh's [article](https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb) really saved me! Of course I modified the code to fit my needs but he was very concise in the article which helped me easily implement it withinmy app.

### Testing

For testing I used the jest and enzyme documentation. After hours of trial and error using jest.mock() for axios, I realized my first implementation was correct but there really was a bug in my app, which didn't even cross my mind at first. This [article](https://wanago.io/2018/09/17/javascript-testing-tutorial-part-four-mocking-api-calls-and-simulating-react-components-interactions/) helped me debug by introducing me to jest.spyOn().
