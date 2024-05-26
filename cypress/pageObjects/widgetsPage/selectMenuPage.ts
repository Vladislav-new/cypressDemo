import { fakeNumber } from "../../helpers/fakers"
import { MainPage } from "../mainPage/mainPage"
import widgetsPagesLocators from "./locators/widgetsPagesLocators"

export class SelectMenuPage extends MainPage {

    selectRandomOptionFromDropDown(locator, finder) {
        cy.get(locator).should('exist').then($menu => {
            cy.wrap($menu).find(finder).then($menuItems => {
                let randIndex = fakeNumber(0, $menuItems.length - 1)
                cy.wrap($menuItems).eq(randIndex).invoke('text').then(value => {
                    cy.wrap($menuItems).eq(randIndex).realClick()
                    cy.log(`Select option ${value}`)
                    cy.get('[class$="singleValue"]').should('have.text', value)                    
                })
            })
        })
    }

    selectorValueChoose(locator) {
        cy.get(locator).should('be.visible').children().then((list) => {
            let rand = fakeNumber(0, list.length - 1)
            cy.wrap(list).eq(rand).invoke('text').then(val => {
                cy.get(locator).select(val.toString())
                cy.log(`${val.toString()} has selected`)
            })
        })
    }

    multiselect(iterations, locator, finder) {
        for (let i=0; i < iterations; i++) {
            cy.get(locator).should('exist').then($menu => {
                cy.wrap($menu).find(finder).then($menuItems => {
                    let randIndex = fakeNumber(0, $menuItems.length - 1)
                    cy.wrap($menuItems).eq(randIndex).invoke('text').then(value => {
                        cy.wrap($menuItems).eq(randIndex).realClick()
                        cy.log(`Select option ${value}`)
                        cy.get(widgetsPagesLocators.multiValue).should('contain.text', value)
                    })
                })
            })
        }
    }

}