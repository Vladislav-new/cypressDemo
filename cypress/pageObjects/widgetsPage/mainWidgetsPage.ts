import widgetsPageLocators from "./locators/widgetsPagesLocators"

export class WidgetsMainPage {
    clickOnBtn(locator) {
        cy.get(locator).should('be.visible').click()
        cy.log(`Click on ${locator}`)
    }
}
