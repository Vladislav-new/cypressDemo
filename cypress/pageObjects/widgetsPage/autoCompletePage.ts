import widgetsPageLocators from "./locators/widgetsPagesLocators"

export class AutoCompletePage {
    checkColorsInMultipleForm(color) {
        //проверка введенных значений 
        cy.get(widgetsPageLocators.lastColorInMultipleForm).last().invoke('text').then(result => {
            expect(result.toLowerCase()).to.be.eq(color)
        })
    }
    typeMultipleColors(value) {
        cy.get(widgetsPageLocators.inputMultipleColors).children().last().type(`${value}{enter}`, { delay: 100 })
    }
    typeSingleColor(value) {
        cy.get(widgetsPageLocators.inputSingleColor).children().last().type(`${value}{enter}`, { delay: 100 })
    }
    checkSingleColor(color) {
        cy.get(widgetsPageLocators.resultInSingleColorField).invoke('text').then(result => {
            expect(result.toLowerCase()).to.be.eq(color)
        })
    }
}