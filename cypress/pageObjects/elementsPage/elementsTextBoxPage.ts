import elementsLocators from "./locators/elementsLocators"

export class TextBoxPage {
    inputDataIn(path, data) {
        cy.get(path).should('be.visible').type(data).then(() => {
            cy.log(`Input "${data}" to field "${path}"`)
        })
    }
    clickOnSubmit() {
        cy.get(elementsLocators.submitButton).should('be.visible').click().then(() => {
            cy.log('Click on submit')
        })
    }
    assertField(locator, expResult) {
        cy.get(locator).should('be.visible').should('contain', expResult).then(() => {
            cy.log(`Result matched with "${expResult}"`)
        })
    }
}