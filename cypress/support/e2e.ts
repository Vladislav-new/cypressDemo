import './commands';
import 'cypress-real-events'
import '@4tw/cypress-drag-drop'
import addContext from 'mochawesome/addContext'
// // @see error 2306 https://github.com/microsoft/TypeScript/blob/3fcd1b51a1e6b16d007b368229af03455c7d5794/src/compiler/diagnosticMessages.json#L1635
// @ts-ignore
import registerCypressGrep from '@cypress/grep'
registerCypressGrep()

const titleToFileName = (title) =>
  title.replace(/[:\/]/g, '')

Cypress.on('test:after:run', (test, runnable) => {
  if (test.state === 'failed') {
    let parent = runnable.parent
    let filename = ''
    while (parent && parent.title) {
      filename = `${titleToFileName(
        parent.title,
      )} -- ${filename}`
      parent = parent.parent
    }
    filename += `${titleToFileName(
      test.title,
    )} (failed).png`
    addContext(
      { test },
      `../screenshots/${Cypress.spec.name}/${filename}`,
    )
  }
  addContext({ test }, `../videos/${Cypress.spec.name}.mp4`)
})

//костыль чтоб ран не падал от ошибок в браузере
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

// Hide fetch/XHR requests
if (Cypress.env('hideXHR')) {
  const app = window.top;
  if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
    const style = app.document.createElement('style');
    style.innerHTML =
      '.command-name-request, .command-name-xhr { display: none }';
    style.setAttribute('data-hide-command-log-request', '');
    app.document.head.appendChild(style);
  }
}