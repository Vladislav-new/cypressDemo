import elementsLocators from "./locators/elementsLocators"

export class RadioButton {
    clickOnYes() {
        cy.get(elementsLocators.yesButton).should('exist').click({force:true})
        cy.log('Click at Yes radio')
    }
    clickOnImpressive() {
        cy.get(elementsLocators.impressiveButton).should('exist').click({force:true})
        cy.log('Click at Impressive radio')
    }
    tryClickOnNo() {
        cy.get(elementsLocators.noButton).should('be.disabled').and('exist').click({ force: true })
        cy.log('Click at Impressive radio and nothing happen')
    }
    checkResultUnderButton(locator){
        cy.get(locator).siblings().invoke('text').then($el=>{
            cy.get('[class="text-success"]').should('be.visible').invoke('text').then($elem=>{
                expect($el).to.equal($elem)
            })
        })
        cy.log('Results are equal')
    }
}