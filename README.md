# HHI Map AppScript
### https://hhi-map.netlify.app/

AppScript code for the HHI Map's Stakeholder Submission Form.

Includes a geocoder for addresses + sync to RTDB on approval, and an mailer for application status on update.

Parent project: https://github.com/DSSD-Madison/HHI

Spreadsheet: https://docs.google.com/spreadsheets/u/2/d/1TI0WNrGsTKC_lZPXhcwxK4fHsc2-A88GysVtidI75z0/edit#gid=0

Submission Form: https://docs.google.com/forms/u/3/d/e/1FAIpQLSedeAfs9-vNfGNfuyFMi68RGyM3GqYfY2AhyvC8XMNDqiz9gw/viewform


### Local Development
This project follows [this guide on AppScript](https://developers.google.com/apps-script/guides/typescript) to enable TypeScript development on AppScript.

It also follows [the instructions from the Github](https://github.com/google/clasp/blob/master/docs/typescript.md), which leads to [this page](https://github.com/google/clasp/blob/master/docs/esmodules.md) and [this repo](https://github.com/atti187/esmodules/blob/main/babel.config.js), in order to support ES modules syntax (import/export)

This project requires node, npm, and clasp.

To install clasp, run:
```
npm install -g @google/clasp
```

To set up the project to sync, run the following at the root of this project:
```
npm i
npm run build
clasp login
clasp pull
clasp push --watch
```

Afterwards, go to Google App Script. Run the `createTriggers` function in the code to create all necessary triggers for the project.

If new permissions were added as part of OAuth, run the "sendEmail" function in any mode. A window should pop up asking for the permissions. (The function should fail, as undefined inputs as provided. This is just a workaround to make the app ask for permissions)