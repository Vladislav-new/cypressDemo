import { MainPage } from "../mainPage/mainPage";
import interactionPageLocators from "./locators/interactionPageLocators";

export class InteractionPage extends MainPage {

    resizeBox(width: number, height: number) {
        cy.get(interactionPageLocators.resizeableRestrictedHandler).drag('[class="constraint-area"]', {
            target: { x: width, y: height },                    
            force: true
        })
        cy.log(`Change size to width:${width}, height:${height}`)
    }

    resizeUnlimBox(width: number, height: number) {
        cy.get(interactionPageLocators.resizableUnlimBoxHandler).move({deltaX: width, deltaY: height })
        cy.log(`Change size to width:${width}, height:${height}`)
    }
    //ээээээээксперименты
    setWidthAndHeightValue(width: number, height: number) {
        cy.get('#resizableBoxWithRestriction').invoke('attr', 'style', `width: ${width}px; height: ${height}px;`).trigger('change')
        cy.log(`Change size to width:${width}, height:${height}`)
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

    areOverlapping = (rectFirst, rectNext) => {
        if (rectFirst.right < rectNext.left || rectNext.right < rectFirst.left) {
            return false
        }

        if (rectFirst.bottom < rectNext.top || rectNext.bottom < rectFirst.top) {
            return false
        }
        return true
    }
}