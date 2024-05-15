export class MainPage {
    clickOn(path:any){
        cy.get(path).should('be.visible').click({force: true})
        cy.log(`Click on ${path}`)
    }
}