import elementsLocators from "./locators/elementsLocators"

export class Buttons {

    doubleClickOnBtn() {
        cy.get(elementsLocators.dblClickBtn).should('be.visible').dblclick()
        cy.log('Perform double click')
    }
    simpleCLickOnBtn() {
        cy.contains(/^Click Me$/i).should('have.text', 'Click Me').click()
        cy.log('Perform Simple click')
    }
    rightClickOnBtn() {
        cy.get(elementsLocators.rigthClickBtn).should('be.visible').rightclick()
        cy.log('Perform right click')
    }
    checkMessageAfterClick(locator, message) {
        cy.get(locator).should('be.visible').and('contain.text', message)
    }
}