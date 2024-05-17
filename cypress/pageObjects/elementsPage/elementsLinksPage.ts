import elementsLocators from "./locators/elementsLocators";

export class LinksPage {

    clickOnHomeLink() {
        cy.get(elementsLocators.homeLink).invoke('removeAttr', 'target').click()
        cy.log('Click on Home link')
    }

    clickOnDynamicHomeLink() {
        //regexp
        cy.contains(/^Home.{5}$/).should('be.visible').invoke('removeAttr', 'target').click()
        cy.log('Click on dynamic Home link')
    }

    clickOnRequestBtn(locator) {
        cy.get(locator).should('be.visible').click()
        cy.log(`Click on ${locator}`)
    }

    checkResponse(response, respCode) {
        cy.wait(`@${response}`).its('response.statusCode').should('eq', respCode)
    }
}