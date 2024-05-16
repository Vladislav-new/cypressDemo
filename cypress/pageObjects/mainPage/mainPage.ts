import elementsLocators from "../elementsPage/locators/elementsLocators"

export class MainPage {
    clickOn(path: any) {
        cy.get(path).should('be.visible').click({ force: true })
        cy.log(`Click on ${path}`)
    }
    openOption(optionName:string) {
        cy.get(elementsLocators.optionsColumns).contains(optionName, { matchCase: false }).click().then(() => {
            cy.log(`Click on "${optionName}"`)
        })
    }
}