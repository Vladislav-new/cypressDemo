import widgetsPagesLocators from "./locators/widgetsPagesLocators";

export class SliderPage {
    setSliderValue(val: any) {
        const newValueSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value',).set
        cy.get(widgetsPagesLocators.sliderContainer).then(($slider) => {
            newValueSet.call($slider[0], val)
        }).trigger('change')
    }
    checkSliderValue(val: any) {
        cy.get(widgetsPagesLocators.sliderContainer).should('have.value', val)
    }
}