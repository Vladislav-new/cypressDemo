import widgetsPagesLocators from "./locators/widgetsPagesLocators";

export class ProgressBarPage {
    clickAndStopOnPercent(percent) {
        let percentage = percent * 100;
        if (percent < 100) {
            cy.get(widgetsPagesLocators.startStopButton).should('have.text', 'Start').then((btn) => {
                cy.wrap(btn).click()
                cy.wait(percentage)
                cy.get(widgetsPagesLocators.startStopButton).should('have.text', 'Stop').click()
            })
        } else {
            cy.get(widgetsPagesLocators.startStopButton).should('have.text', 'Start').then((btn) => {
                cy.wrap(btn).click()
                cy.wait(percentage)
            })

        }
    }

    checkPercentage(percent) {
        cy.get(widgetsPagesLocators.progressBar).should('have.attr', 'style', `width: ${percent}%;`)
        cy.get(widgetsPagesLocators.progressBar).invoke('text').then(value=>{
            expect(value).to.be.eq(`${percent}%`)
        })
    }
}