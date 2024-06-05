# portfolio-Cypress
There is a presentation of my skills regarding some issues related to JS\TS and Cypress framework
- matrix strategy with split test-scopes
- launch CI file in GHActions by schedule or by button
- artifacts with screenshots/html reports
- OOP
- Page object
- Data generator
- custom commands
- API, e2e and UI tests
- tags

## To run code
- to run in github:
-- open Actions-> mochaReportAndSplit-> Run workflow-> input tags without comma`s and click green btn;
- scripts to local run:
-- npx cypress run --browser chrome   //(all tests);
-- npx cypress run --browser chrome --env grepTags="e2e"   //(test with tags- possibletags are: e2e, regression, UI, API, smoke); 
