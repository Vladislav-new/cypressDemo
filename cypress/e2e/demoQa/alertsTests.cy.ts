import { blockRequests } from "../../helpers/blockList";
import { AlertsAndWindowsPage } from "../../pageObjects/alertsAndFramesPage/alertsMainPage";
import alertsPageLocators from "../../pageObjects/alertsAndFramesPage/locators/alertsPageLocators";
import { MainPage } from "../../pageObjects/mainPage/mainPage";

const mainPage = new MainPage();
const alertsPage = new AlertsAndWindowsPage();

context('Actions with alerts and windows - tests', () => {
    beforeEach(() => {
        blockRequests()
        cy.visit('/alertsWindows', { failOnStatusCode: false })
        cy.log(`Test started: ${Cypress.currentTest.title}`)
    })

    afterEach(() => {
        cy.log(`Test ${Cypress.currentTest.title} completed`)
    })

    context('Browser-windows: new-tab, new-window, window-message', () => {
        beforeEach(() => {
            mainPage.openOption('Browser Windows')
            cy.url().should('match', /browser-windows/)
        })

        it('New window stubbing', () => {
            cy.window().then((win) => {
                cy.stub(win, 'open', url => {
                    win.location.href = 'https://demoqa.com/sample'
                }).as("newWindow")
            })
            const text = 'This is sample page'
            alertsPage.clickOnBtn(alertsPageLocators.newWindowBtn)           
            cy.get(alertsPageLocators.newWindowOpenedLocator).should('have.text', 'This is a sample page')            
        })

        it('New Tab stub', () => {
            cy.window().then((win) => {
                cy.stub(win, 'open').as('open')
            })
            alertsPage.clickOnBtn(alertsPageLocators.newTabOpenBtn)
            cy.get('@open').should('have.been.calledOnceWithExactly', '/sample')
        })

        it('New message window', () => {
            //тут следим за событием открытия окна, чтоб потом переиспользовать, примерно как intercept
            cy.visit('/browser-windows').then((win) => {
                cy.spy(win, 'open').as('open')
            })
            const text = 'Knowledge increases by sharing but not by saving. Please share this website with your friends and in your organization.'
            alertsPage.clickOnBtn(alertsPageLocators.newMessageWindowOpenBtn)
            //тип окна = MsgWindow, увы cypress window:alert не видит его
            //в its('firstCall.ReturnValue') возвращаем путь к свойству объекта, возвращенному функцией cy.spy 
            cy.get('@open').should('be.calledOnceWith', '', 'MsgWindow').its('firstCall.returnValue').then(childWindow => {                
                expect(childWindow.document.body.innerText).to.be.equal(text)
            }).wait(800).invoke('close')
        })
    })
})