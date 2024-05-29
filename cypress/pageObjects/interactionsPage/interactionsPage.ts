import { MainPage } from "../mainPage/mainPage";
import interactionPageLocators from "./locators/interactionPageLocators";

export class InteractionPage extends MainPage {

    resizeBox(width: number, height: number) {
        cy.get(interactionPageLocators.resizeableRestrictedHandler).drag('[class="constraint-area"]', {
            target: { x: width, y: height },                    
            force: true
        })
    }

    resizeUnlimBox(width: number, height: number) {
        cy.get(interactionPageLocators.resizableUnlimBoxHandler).move({deltaX: width, deltaY: height })            
    }
    //ээээээээксперименты
    setWidthAndHeightValue(width: number, height: number) {
        cy.get('#resizableBoxWithRestriction').invoke('attr', 'style', `width: ${width}px; height: ${height}px;`).trigger('change');
      }

    dragNdrop(locatorFrom, locatorTo) {
        //@ts-ignore
        cy.get(locatorFrom).should('exist').drag(locatorTo, {position:'right',force:true})
    }
    
    dragAndmouseMove(locator, x, y) {
        cy.get(locator).should('exist').trigger('mousedown', {which:1}).trigger('mousemove', x, y, {force: true})
    }

    checkBackgroundColor(locator, colorRgb) {
        cy.get(locator).should('have.css','background-color', colorRgb)
    }

    checkDroppableText(locator) {
        cy.get(locator).find('p').eq(0).invoke('text').then(value=>{
            expect(value).to.be.eq('Dropped!')
        })
    }
    
    dragNDropByLocation(locator, from, to) {
        cy.get(locator).eq(from)
            .trigger("mousedown", { which: 1 })
        cy.get(locator).eq(to)
            .trigger("mousemove")
            .trigger("mouseup")
        cy.log(`Dragged from ${from + 1} to ${to + 1}`)
    }

    clickOnRandomElement(locator) {
        cy.get(locator).should('be.visible').then((elements) => {
            let randomValue = Cypress._.random(0, elements.length - 1)
            cy.wrap(elements).eq(randomValue).invoke('text').then($elementsValue => {
                cy.wrap(elements).eq(randomValue).realClick()
                cy.log(`Click on ${$elementsValue}`)
                //cy.contains($elementsValue).should('have.class', 'list-group-item active') //убран поскольку один элемент может быть нажат несколько раз
            })
        })
    }

    clickGridElement(...args: string[]) {
        for (var i = 0; i < arguments.length; i++) {
            cy.contains(arguments[i]).should('be.visible').realClick()
            cy.contains(arguments[i]).invoke('text').then((text) => {
                cy.contains(text).should('have.class', 'list-group-item active')
                cy.log(`Click on ${text}`)
            })
        }
    }

    areOverlapping = (rect1, rect2) => {
        if (rect1.right < rect2.left || rect2.right < rect1.left) {
            return false
        }

        if (rect1.bottom < rect2.top || rect2.bottom < rect1.top) {
            return false
        }
        return true
    }
}