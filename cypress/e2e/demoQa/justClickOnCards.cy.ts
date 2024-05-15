import { blockRequests } from "../../helpers/blockList";
import mainPageLocators from "../../pageObjects/mainPage/locators/mainPageLocators";
import { MainPage } from "../../pageObjects/mainPage/mainPage";

const mainPage = new MainPage();

context('Main page opened', () => {
    beforeEach(()=>{      
        blockRequests();
        cy.visit('', {failOnStatusCode: false})
    })
    it('Open Elements page', ()=>{
        mainPage.clickOn(mainPageLocators.elements)
        cy.url().should('match', /elements/)
    })
    it('Open Forms page', ()=>{
        mainPage.clickOn(mainPageLocators.forms)
        cy.url().should('match', /forms/)
    })
    it('Open Alerts, Frame & Windows page', ()=>{
        mainPage.clickOn(mainPageLocators.alerts)
        cy.url().should('match', /alertsWindows/)
    })
    it('Open Widgets page', ()=>{
        mainPage.clickOn(mainPageLocators.widgets)
        cy.url().should('match', /widgets/)
    })
    it('Open Interactions page', ()=>{
        mainPage.clickOn(mainPageLocators.interactions)
        cy.url().should('match', /interaction/)
    })
    it('Open Book Store Application page', ()=>{
        mainPage.clickOn(mainPageLocators.bookStore)
        cy.url().should('match', /books/)
    })
})