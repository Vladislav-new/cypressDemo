import { MainPage } from "../mainPage/mainPage";
import bookStorePageLocators from "./locators/bookStorePageLocators";

export class Login extends MainPage {

    login(userName: string, password: string) {
        cy.get(bookStorePageLocators.userNameInput).should('be.visible').type(userName, {force:true})
        cy.get(bookStorePageLocators.passwordInput).should('be.visible').type(password, {force:true})
        cy.get(bookStorePageLocators.loginBtn).click()
        cy.get(bookStorePageLocators.userNameValue).should('be.visible')
        cy.log(`Login under ${userName}`)
    }

    registerNewUser(options: any) {
        cy.get(bookStorePageLocators.fistNameInput).should('be.visible').type(options.firstName)
        cy.get(bookStorePageLocators.lastNameInput).should('be.visible').type(options.lastName)
        cy.get(bookStorePageLocators.userNameInput).should('be.visible').type(options.nameOfUser)
        cy.get(bookStorePageLocators.passwordInput).should('be.visible').type(options.pass)
        cy.confirmCaptcha()
        cy.get(bookStorePageLocators.registryBtn).should('be.visible').realClick()
    }

    registerNewUserNoCaptcha(options: any) {
        cy.get(bookStorePageLocators.fistNameInput).should('be.visible').type(options.firstName)
        cy.get(bookStorePageLocators.lastNameInput).should('be.visible').type(options.lastName)
        cy.get(bookStorePageLocators.userNameInput).should('be.visible').type(options.nameOfUser)
        cy.get(bookStorePageLocators.passwordInput).should('be.visible').type(options.pass)
        cy.get(bookStorePageLocators.registryBtn).should('be.visible').realClick()
    }

    checkRedBordersOfEmptyFieldsAtRegistry() {
        cy.get(bookStorePageLocators.fistNameInput).should('have.css', 'border-color', 'rgb(220, 53, 69)')
        cy.get(bookStorePageLocators.lastNameInput).should('have.css', 'border-color', 'rgb(220, 53, 69)')
        cy.get(bookStorePageLocators.userNameInput).should('have.css', 'border-color', 'rgb(220, 53, 69)')
        cy.get(bookStorePageLocators.passwordInput).should('have.css', 'border-color', 'rgb(220, 53, 69)')
    }
    checkRedBordersOfEmptyFieldsAtLogin() {        
        cy.get(bookStorePageLocators.userNameInput).should('have.css', 'border-color', 'rgb(220, 53, 69)')
        cy.get(bookStorePageLocators.passwordInput).should('have.css', 'border-color', 'rgb(220, 53, 69)')
    }
}