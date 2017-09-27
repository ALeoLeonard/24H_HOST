## Setup
* Place config.js in `public/`
* Run a local server: `python -m SimpleHTTPServer 8000`
* All frontend files are in `public/`

## Pages
* localhost:8000/public/index.html - main signup page
* localhost:8000/public/cancel.html - cancellation page
  * custom url params generated for each signup:
  * localhost:8000/public/cancel.html?email=test@email.com&id=001_13:30
* localhost:8000/public/data/ - page for creating "identifiers" for each guest
* localhost:8000/public/instruct/ - page running during performance, generating instructions

## Firebase
* console: https://console.firebase.google.com/u/0/project/host-24hour/
* database: https://console.firebase.google.com/u/0/project/host-24hour/database/data

## Firebase functions
* Edit file `functions/index.js`. Necessary npm packages should be logged in `functions/package.json`.
* `firebase deploy` - redeploys entire project, usually not necessary
* `firebase deploy --only functions` - deploys changes to index.js functions file
* https://firebase.google.com/docs/functions/get-started

## Useful links
* https://github.com/BorisMoore/jsrender
* https://github.com/datejs/Datejs