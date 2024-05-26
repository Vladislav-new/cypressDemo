export class ToolTipPage {
    hoverAndVerifyTooltip(hoverElement, expectedTooltipText) {
        cy.get(hoverElement).realHover()        
        cy.get('[role="tooltip"] [class="tooltip-inner"]').should('be.visible').and('have.text', expectedTooltipText)
    }
}