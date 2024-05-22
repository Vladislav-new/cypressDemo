import { should } from "chai";
import { blockRequests } from "../../helpers/blockList";
import { fakeObjectName } from "../../helpers/fakers";
import { AlertsAndWindowsPage } from "../../pageObjects/alertsAndFramesPage/alertsMainPage";
import alertsPageLocators from "../../pageObjects/alertsAndFramesPage/locators/alertsPageLocators";
import { MainPage } from "../../pageObjects/mainPage/mainPage";
import { ModalsPage } from "../../pageObjects/alertsAndFramesPage/modalsPage";

const mainPage = new MainPage();
const alertsPage = new AlertsAndWindowsPage();
const modalsPage = new ModalsPage();

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
            cy.get(alertsPageLocators.newWindowOpenedLocator).should('have.text', text)
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

    context('Alerts', () => {
        beforeEach(() => {
            mainPage.openOption('Alerts')
            cy.url().should('match', /alerts/)
        })

        it('Click Button to see alert', () => {
            const text = 'You clicked a button';
            alertsPage.clickOnBtn(alertsPageLocators.alertBtn)
            cy.on('window:alert', cy.stub().as('simpleAlert'))
            cy.get('@simpleAlert').should('have.been.calledOnceWith', text)
        })

        it('On button click, alert will appear after 5 seconds', () => {
            const text = 'This alert appeared after 5 seconds';
            alertsPage.clickOnBtn(alertsPageLocators.alertTimerBtn)
            cy.on('window:alert', cy.stub().as('timeAlert'))
            cy.get('@timeAlert', { timeout: 5500 }).should('have.been.calledOnceWith', text)
        })

        it('On button click, confirm box will appear - Cancel', () => {
            const text = 'Do you confirm action?';
            const cancelText = 'You selected Cancel';
            const okText = 'You selected Ok';
            alertsPage.clickOnBtn(alertsPageLocators.confirmAlertBtn)
            cy.on("window:confirm", (s) => {
                expect(s).to.equal(text)
                return false
            })
            cy.get(alertsPageLocators.confirmResult).should('be.visible').and('have.text', cancelText)
        })

        it('On button click, confirm box will appear - Ok', () => {
            const text = 'Do you confirm action?';
            const okText = 'You selected Ok';
            alertsPage.clickOnBtn(alertsPageLocators.confirmAlertBtn)
            cy.on("window:confirm", cy.stub().as('confirmAlert'))
            cy.get('@confirmAlert').should('have.been.calledOnceWith', text)
            cy.get(alertsPageLocators.confirmResult).should('be.visible').and('have.text', okText)
        })

        it('On button click, prompt box will appear', () => {
            const randomWords = fakeObjectName()
            cy.window().then(win => {
                cy.stub(win, 'prompt').returns(randomWords)
                alertsPage.clickOnBtn(alertsPageLocators.promptBoxAlertBtn)
                cy.get(alertsPageLocators.promptResult).contains(`You entered ${randomWords}`)
            })
        })


    })

    it('Check iframe text', () => {
        const text = 'This is a sample page'
        mainPage.openOption('Frames')
        cy.url().should('match', /frames/)
        // Находим все элементы iframe с id, начинающимся с "frame"
        cy.get(alertsPageLocators.frameLocator).each(($iframe) => {
            cy.wrap($iframe).its('0.contentDocument.body').find('#sampleHeading').then(value => {
                expect(value.text()).to.be.eq(text)
            })
        })
    })

    it('Check Nested frames data', () => {
        const parentFrameText = 'Parent frame'
        const childIFrameText = 'Child Iframe'
        mainPage.openOption('Nested Frames')
        cy.url().should('match', /nestedframes/)
        cy.get(alertsPageLocators.frameLocator).each(($iframe) => {
            cy.wrap($iframe).its('0.contentDocument.body').eq(0).should('have.text', parentFrameText).then(frame1 => {
                cy.wrap(frame1).find('iframe').its('0.contentDocument.body').should('have.text', childIFrameText)
            })
        })
    })

    it('Show modal', () => {
        const smallModalText = 'This is a small modal. It has very less content'
        const largeModalText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        mainPage.openOption('Modal Dialogs')
        cy.url().should('match', /modal-dialogs/)
        alertsPage.clickOnBtn(alertsPageLocators.smallModalBtn)
        modalsPage.checkModalsProps(smallModalText, 300, 220)
        alertsPage.clickOnBtn(alertsPageLocators.largeModalBtn)
        modalsPage.checkModalsProps(largeModalText, 800, 340)
    })
})