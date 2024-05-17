import elementsLocators from "./locators/elementsLocators"

export class DynamicPropsPage {

    checkBefore(colorBefore) {
        cy.get(elementsLocators.changeColor).should('have.css', 'color', colorBefore)
        cy.get(elementsLocators.visibleAfter).should('not.exist')
        cy.get(elementsLocators.enabledAfter).should('be.disabled').and('exist')
    }

    checkAfter(colorAfter) {
        cy.get(elementsLocators.changeColor).should('have.css', 'color', colorAfter)
        cy.get(elementsLocators.visibleAfter).should('exist')
        cy.get(elementsLocators.enabledAfter).should('be.enabled').and('exist')
    }
}