import elementsLocators from "../elementsPage/locators/elementsLocators"

export class MainPage {
    clickOn(path: any) {
        cy.get(path).should('be.visible').realClick()
        cy.log(`Click on ${path}`)
    }
    openOption(optionName:string) {
        cy.get(elementsLocators.optionsColumns).contains(optionName, { matchCase: false }).click().then(() => {
            cy.log(`Click on "${optionName}"`)
        })
    }

    checkAnswerStatusCode(interceptor:string, statusCode:number) {
        cy.wait(interceptor).its('response.statusCode').should('eq', statusCode)
    }
}