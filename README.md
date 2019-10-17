# Created on 16/10/2019 by Ross Francis

## Getting started

### Install dependencies

Run `yarn install`.

### Run the project in dev mode

Run `yarn run start`.

### Run the project in production mode

Run `yarn run build` and once finished run a web server that can serve static files (such as http-server on npm) from `/dist`.

### Run e2e tests

The application has a small set of e2e tests written using TestCafe.

The tests can be run against either dev or production but the site must be located at http://127.0.0.1:8080.

Make sure you have Chrome installed or change the specified browser (or browsers if you desire) in `package.json`.

Run `yarn run e2e`.

## Application details

- The application allows a user to create a new todo with a message and tag it with a priority.

- To change the priority of a todo you simply drag and drop onto a different "priority lane".

- To delete a todo you click the bin icon.

- To delete all todos you click the big red "Clear all" button.

- All todos are persisted to local storage.

## Design

- Instead of going with a pre-made solution such as create-react-app I scaffolded the webpack.config using webpack-cli and made some major modifications. I like to write as much of my configuration by hand to ensure that I have a full understanding of the build process (same for babel, eslint etc.).

- I used TypeScript because I'm comfortable with it and like the reassurance it gives me.

  - You'll notice in the reducer state type a "neat" trick which allows one to infer a string union from an actual array of strings. I prefer string unions to enums as you can work with strings (less imports) whilst having complete type safety + intellisense.

* I selected Redux mainly for it's middleware ability. I was able to integrate redux-persist middleware to provide persistence (localStorage) to the application with just a few lines of configuration code. However, I also prefer to model my state with reducers as I find that it leads to  code that is easier to understand and modify - there is an argument that reducers along with actions add boilerplate but I'd counter argue that you shouldn't trade brevity for clarity!

  - I'd say the actions (the few there are) are "okay" in terms of action hygeine. In a larger more complicated app, I like to treat my actions as events as much as possible (you can't avoid data fetching setters) as I believe this reduces boilerplate and works well with something like redux-saga for orchestrating side-effects.
  
  - I make use of immer.js to allow locally scoped mutation such as `delete object[id]` or `todos[id] = ...`. This makes the reducer code much easier to read whilst remaining immutable.

* If I was expecting large datasets I would make use of virtual lists to ensure that I am rendering the minimal amount of DOM nodes possible.

* I would also memoize any complex functions to ensure that they are not excessively run when producing the same value as the previous run. 

* For styling if I was expecting collaborators I would probably have gone withstyled-components or maybe even experiement with Emotion and it's CSS prop (not sure how it works with TypeScript mind). However, for speed of development I simply went with inline styles using the style attribute. Although I made sure to at least extract some common values to a constant.

* File structure is rather minimal. Although I am not one to shy away from larger files so long as everything is related, there just aren't too many comp! In a "real" more complex application, or in an environment where components are shared across projects I would look at what components could be made generic and extract them into a shared directory for re-use.
