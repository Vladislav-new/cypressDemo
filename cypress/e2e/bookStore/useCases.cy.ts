import { blockRequests } from "../../helpers/blockList"
import { fakeEmail } from "../../helpers/fakers";
import { BookStoreAPI } from "../../pageObjects/bookStoreAppPage/bookStoreAPI"
import { Login } from "../../pageObjects/bookStoreAppPage/loginPage";
import { Profile } from "../../pageObjects/bookStoreAppPage/profilePage";

const bookStoreAPI = new BookStoreAPI();
const loginPage = new Login();
const profilePage = new Profile();
const userName = fakeEmail('AT')
const password = '!Q1w2e3r4'
const bookList = ['9781449325862', '9781449331818', '9781449337711', '9781449365035', '9781491904244', '9781593277574']


beforeEach(() => {
    bookStoreAPI.prepareUserWithBooks(userName, password, bookList)
    blockRequests()
    cy.visit('/books', { failOnStatusCode: false })
    cy.log(`Test started: ${Cypress.currentTest.title}`)
})

afterEach(() => {
    cy.log(`Test ${Cypress.currentTest.title} completed`)
})

context('Books e2e', () => {
    
    after(() => {
        bookStoreAPI.generateToken(userName, password).then(response => {
            const newToken = response.body.token;
            bookStoreAPI.deleteUser(newToken, userName, password)
        })
    })

    it('Books in list', () => {
        /*
        * по предварительным данным создается пользователь с набором книг
        * заходим в аккаунт
        * сортируем книги по имени
        * в поиске ищем книги по автору (просто ввод автора)
        * из отфильтрованных находим одну и удаляем из списка
        * добавить интерцепторов для перехвата и проверки ответов бэка
        */
        cy.intercept('/Account/v1/GenerateToken').as('getToken')
        cy.intercept('DELETE', /\/BookStore\/v1\/Book/).as('deleteBook')
        loginPage.openOption('Login')
        loginPage.login(userName, password)
        profilePage.openOption('Profile')
        profilePage.checkAnswerStatusCode('@getToken', 200)
        profilePage.sortBy('Author')
        profilePage.search('Kyle Simpson')
        profilePage.deleteBookFromList(0)
        profilePage.checkAnswerStatusCode('@deleteBook', 204)
        cy.get('.rt-noData').should('have.text', 'No rows found')
    })
})

context('Profile e2e', () => {
    it('Delete all books and account', () => {
        cy.intercept('DELETE','/BookStore/v1/Books*').as('deleteAllBooks')
        cy.intercept('DELETE', '/Account/v1/User/*').as('deleteAccount')
        loginPage.openOption('Login')
        loginPage.login(userName, password)
        profilePage.openOption('Profile')
        profilePage.deleteAllBooks()
        profilePage.checkAnswerStatusCode('@deleteAllBooks', 204)
        profilePage.deleteAccount()
        profilePage.checkAnswerStatusCode('@deleteAccount', 204)
        cy.url().should('include', '/login')
    })
})