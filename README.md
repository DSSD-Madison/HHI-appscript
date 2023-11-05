# HHI Map AppScript
### https://hhi-map.netlify.app/

AppScript code for the HHI Map's Stakeholder Submission Form.

Includes a geocoder for addresses on approval, and an mailer for application status on update.

Parent project: https://github.com/DSSD-Madison/HHI

Spreadsheet: https://docs.google.com/spreadsheets/u/2/d/1TI0WNrGsTKC_lZPXhcwxK4fHsc2-A88GysVtidI75z0/edit#gid=0

Submission Form: https://docs.google.com/forms/u/3/d/e/1FAIpQLSedeAfs9-vNfGNfuyFMi68RGyM3GqYfY2AhyvC8XMNDqiz9gw/viewform


### Local Development
This project follows [this guide on AppScript](https://developers.google.com/apps-script/guides/typescript) to enable TypeScript development on AppScript

This project requires node, npm, and clasp.

To install clasp, run:
```
npm install -g @google/clasp
```

To set up the project to sync, run the following at the root of this project:
```
npm i
clasp login
clasp pull
clasp push --watch
```