import { MainPage } from "../mainPage/mainPage";

export class InteractionPage extends MainPage {

    dragNDrop(locator, from, to) {
        cy.get(locator).eq(from)
            .trigger("mousedown", { which: 1 })
        cy.get(locator).eq(to)
            .trigger("mousemove")
            .trigger("mouseup")
    }
}