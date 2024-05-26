import { blockRequests } from "../../helpers/blockList";
import { InteractionPage } from "../../pageObjects/interactionsPage/interactionsPage";
import interactionPageLocators from "../../pageObjects/interactionsPage/locators/interactionPageLocators";

const interactionsPage = new InteractionPage();
context('Interactions', () => {

    beforeEach(() => {
        blockRequests();
        cy.visit('/interaction', { failOnStatusCode: false })
        cy.log(`Test started: ${Cypress.currentTest.title}`)
    })

    afterEach(() => {
        cy.log(`Test ${Cypress.currentTest.title} completed`)
    })

    context('Sortable actions', () => {
        beforeEach(() => {
            interactionsPage.openOption('Sortable');
            cy.url().should('match', /sortable/)
        })
        it('List', () => {
            cy.get(interactionPageLocators.listOfElements).should('have.length', 6).then(items => {
                const initialOrder = Cypress._.map(items, 'textContent')
                let fromIndex = Cypress._.random(0, 5)
                let toIndex = Cypress._.random(0, 5)
                cy.get(interactionPageLocators.listOfElements).eq(fromIndex).invoke('text').then(draggedItem => {
                    cy.get(interactionPageLocators.listOfElements).should('have.length', 6)                    
                    interactionsPage.dragNDrop(interactionPageLocators.listOfElements, fromIndex, toIndex)
                    cy.get(interactionPageLocators.listOfElements).should('have.length', 6).then(items => {
                        const newOrder = Cypress._.map(items, 'textContent')
                        expect(newOrder).not.to.deep.eq(initialOrder)
                        expect(newOrder[toIndex]).to.eq(draggedItem)
                    })
                })
            })
        })

        it.only('Grid', () => {

        })
    })
})