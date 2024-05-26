export class ModalsPage {
    checkModalsProps(text, width, height) {
        cy.get('.modal-content').should('be.visible').then((modal) => {
            const modalWidth = modal.width()
            const modalHeight = modal.height()
            cy.wrap(modal).find('.modal-body').should('have.text', text)
            expect(modalWidth).to.be.lte(width) 
            expect(modalHeight).to.be.lte(height)
            cy.contains('button', 'Close').click()
        })
        cy.get('.modal-content').should('not.exist')
    }
}