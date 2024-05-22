export class AlertsAndWindowsPage {
    clickOnBtn(locator){
        cy.get(locator).should('be.visible').click()
        cy.log(`Click on ${locator}`)
    }
}