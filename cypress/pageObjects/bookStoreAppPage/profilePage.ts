import { MainPage } from "../mainPage/mainPage";

export class Profile extends MainPage {
    sortBy(columnName:string){
        cy.contains(columnName).should('exist').realHover().realClick()
        cy.log(`Sort by ${columnName}`)
    }

    search(searchable:string) {
        cy.get('#searchBox').should('exist').type(searchable)
        cy.log(`Input ${searchable} in searchbox`)
    }
    
    deleteBookFromList(index:number) {        
        cy.get('#delete-record-undefined').eq(index).should('be.visible').realHover().realClick()
        cy.get('[class="modal-content"] #closeSmallModal-ok').should('be.visible').click({force:true})
        cy.on("window:confirm", cy.stub().as('confirmAlert'))
        cy.log('Book has been deleted')
    }

    deleteAllBooks() {
        cy.contains('Delete All Books').should('be.visible').click()
        cy.get('[class="modal-content"] #closeSmallModal-ok').should('be.visible').click({force:true})
        cy.on("window:confirm", cy.stub().as('confirmAlert'))
        cy.log('Click on delete All books btn')
    }

    deleteAccount() {        
        cy.contains('Delete Account').should('be.visible').click()
        cy.get('[class="modal-content"] #closeSmallModal-ok').should('be.visible').click({force:true})
        cy.on("window:confirm", cy.stub().as('confirmAlert'))
        cy.log('Click on delete account')
    }
}