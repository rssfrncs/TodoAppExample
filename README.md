# Created on 16/10/2019 by Ross Francis

## Getting started

### Install dependencies

Run `yarn install`.

### Run the project in dev mode

Run `yarn run start`.

### Run the project in production mode

Run `yarn run build` and once finished run a web server that can serve static files (such as http-server on npm) from `/dist`.

### Run e2e tests using TestCafe

Make sure you have Chrome installed or change the browser in `package.json` and run `yarn run e2e`.

## Application details

- The application allows a user to create a new todo with a message and tag it with a priority.

- To change the priority of a todo you simply drag and drop onto a different "priority lane".

- To delete a todo you click the bin icon.

- To delete all todos you click the big red "Clear all" button.

- All todos are persisted to local storage.

## Design

- I used TypeScript because I'm comfortable with it and like the reassurance it gives me.

  - You'll notice in the state design a neat trick which allows you to define a string union from an actual array of strings. I really like using string unions and avoid enums like the plague.

* I used Redux mainly because even in simple apps you're often surprised by the amount of shared state. Really it probably would have been faster and smaller to use React.useReducer and context in a similar fashion.

  - I'd say the actions (the few there are) are "okay" in terms of action hygeine. In a larger more complicated app, I like to treat my actions as events as much as possible (you can't avoid data fetching setters) as I believe this reduces boilerplate and works well with something like redux-saga for orchestrating side-effects.

* If this was a "real" application and I was expecting large datasets I would definitely make use of virtual lists to ensure I am rendering the minimal amount of DOM nodes possible.

* Also I would memoize any of complex functions to ensure they are not run excessively when producing the same value as the previous run.

* In terms of styling I would have preferred to have used something like styled-components or maybe even try out Emotion and it's CSS prop (not sure how it works with TypeScript mind), but for speed I went with css-in-js using the style attribute. Although I did at least extract some common values to a constant.

* File structure is minimal. Personally I don't shy away from large files so long as everything is related, which in the case of this tiny app it is! In a "real" app with potential routing I would look at what components could be re-used and attempt to make them generic and extract.
