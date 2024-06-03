import { blockRequests } from "../../helpers/blockList";
import { fakeEmail, fakeFirstName, fakeLastName } from "../../helpers/fakers";
import { BookStoreAPI } from "../../pageObjects/bookStoreAppPage/bookStoreAPI";
import bookStorePageLocators from "../../pageObjects/bookStoreAppPage/locators/bookStorePageLocators";
import { Login } from "../../pageObjects/bookStoreAppPage/loginPage";

const bookStoreAPI = new BookStoreAPI();
const loginPage = new Login();
const userName = fakeEmail('AT')
const password = '!Q1w2e3r4'
const bookList = ['9781449325862', '9781449331818', '9781449337711', '9781449365035', '9781491904244', '9781593277574']

beforeEach(() => {
    blockRequests()
    cy.visit('/books', { failOnStatusCode: false })
    loginPage.openOption('Login')
    cy.log(`Test started: ${Cypress.currentTest.title}`)
})

afterEach(() => {
    cy.log(`Test ${Cypress.currentTest.title} completed`)
})

context('New user', () => {
    const wrongPassList = ['qwerty123', 'QWERTY123', 'qwerty!@#', 'QwErTy123', '!@#$%^&*(', '123$%^&*()', 'SMa!l']
    const goodUserOptions = {
        firstName: fakeFirstName(),
        lastName: fakeLastName(),
        nameOfUser: fakeEmail('login'),
        pass: password
    }

    it('registration failed - empty fields', () => {
        cy.get(bookStorePageLocators.newUserBtn).should('be.visible').click()
        cy.url().should('match', /register/)
        cy.get(bookStorePageLocators.registryBtn).should('be.visible').realClick()
        loginPage.checkRedBordersOfEmptyFieldsAtRegistry()
    })
    wrongPassList.forEach((wrongPass) => { //все упадут, recaptcha с тестовым ключом google не сработает
        it(`registration failed - password rules does not match`, () => {
            cy.intercept('POST', '/Account/v1/User').as('registration')
            const userOptions = {
                firstName: fakeFirstName(),
                lastName: fakeLastName(),
                nameOfUser: fakeEmail('test'),
                pass: wrongPass
            }
            cy.get(bookStorePageLocators.newUserBtn).should('be.visible').click()
            cy.url().should('match', /register/)
            loginPage.registerNewUser(userOptions)
            loginPage.checkAnswerStatusCode('@registration', 400)
        })
    })
    
    it('registration failed - recapcha does not checked', () => {
        const text:string = 'Please verify reCaptcha to register!'
        cy.intercept('POST', '/Account/v1/User').as('registration')        
        cy.get(bookStorePageLocators.newUserBtn).should('be.visible').click()
        cy.url().should('match', /register/)
        loginPage.registerNewUserNoCaptcha(goodUserOptions)
        cy.get(bookStorePageLocators.outputBox).should('be.visible').and('have.text', text)
    })

    it('registration passed', () => { //recaptcha с тестовым ключом google не сработает        
        cy.get(bookStorePageLocators.newUserBtn).should('be.visible').click()
        cy.intercept('POST', '/Account/v1/User').as('registration') 
            cy.url().should('match', /register/)
            loginPage.registerNewUser(goodUserOptions)
            loginPage.checkAnswerStatusCode('@registration', 201)
    })
})

context('Auth user tests', () => {
    before(() => {
        bookStoreAPI.prepareUserWithBooks(userName, password, bookList)
    })
    it('login test with empty fields', () => {
        cy.get(bookStorePageLocators.userNameInput).should('be.visible').type('{enter}', {force:true})
        cy.get(bookStorePageLocators.passwordInput).should('be.visible').type('{enter}', {force:true})
        cy.get(bookStorePageLocators.loginBtn).click()
        loginPage.checkRedBordersOfEmptyFieldsAtLogin()
    })
    it('login test with wrong user name', () => {
        const text:string = 'Invalid username or password!'
        cy.get(bookStorePageLocators.userNameInput).should('be.visible').type('userName', {force:true})
        cy.get(bookStorePageLocators.passwordInput).should('be.visible').type(password, {force:true})
        cy.get(bookStorePageLocators.loginBtn).click()
        cy.get(bookStorePageLocators.outputBox).should('be.visible').and('have.text', text)
    })

    it('login test with wrong password', () => {
        const text:string = 'Invalid username or password!'
        cy.get(bookStorePageLocators.userNameInput).should('be.visible').type(userName, {force:true})
        cy.get(bookStorePageLocators.passwordInput).should('be.visible').type('password', {force:true})
        cy.get(bookStorePageLocators.loginBtn).click()
        cy.get(bookStorePageLocators.outputBox).should('be.visible').and('have.text', text)
    })
    it('Happy login', () => {
        loginPage.openOption('Login')
        loginPage.login(userName, password)
    })
})