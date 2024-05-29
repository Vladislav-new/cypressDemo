import { blockRequests } from "../../helpers/blockList";
import { InteractionPage } from "../../pageObjects/interactionsPage/interactionsPage";
import interactionPageLocators from "../../pageObjects/interactionsPage/locators/interactionPageLocators";

const interactionsPage = new InteractionPage();
context('Interactions', () => {

    beforeEach(() => {
        blockRequests();
        cy.visit('/interaction', { failOnStatusCode: false })
        cy.log(`Test started: ${Cypress.currentTest.title}`)
    })

    afterEach(() => {
        cy.log(`Test ${Cypress.currentTest.title} completed`)
    })

    context('Sortable actions', () => {
        beforeEach(() => {
            interactionsPage.openOption('Sortable');
            cy.url().should('match', /sortable/)
        })
        it('List', () => {
            cy.get(interactionPageLocators.listOfElements).should('have.length', 6).then(items => {
                const initialOrder = Cypress._.map(items, 'textContent')
                let fromIndex = Cypress._.random(0, 5)
                let toIndex = Cypress._.random(0, 5)
                cy.get(interactionPageLocators.listOfElements).eq(fromIndex).invoke('text').then(draggedItem => {
                    cy.get(interactionPageLocators.listOfElements).should('have.length', 6)
                    interactionsPage.dragNDropByLocation(interactionPageLocators.listOfElements, fromIndex, toIndex)
                    cy.get(interactionPageLocators.listOfElements).should('have.length', 6).then(items => {
                        const newOrder = Cypress._.map(items, 'textContent')
                        expect(newOrder).not.to.deep.eq(initialOrder)
                        expect(newOrder[toIndex]).to.eq(draggedItem)
                    })
                })
            })
        })

        it('Grid', () => { //дублирование кода есть но если убрать все под метод то читаемость падает
            interactionsPage.clickOn(interactionPageLocators.tabGridElems)
            cy.get(interactionPageLocators.gridOfElements).should('have.length', 9).then(items => {
                const initialOrder = Cypress._.map(items, 'textContent')
                let fromIndex = Cypress._.random(0, 8)
                let toIndex = Cypress._.random(0, 8)
                cy.get(interactionPageLocators.gridOfElements).eq(fromIndex).invoke('text').then(draggedItem => {
                    cy.get(interactionPageLocators.gridOfElements).should('have.length', 9)
                    interactionsPage.dragNDropByLocation(interactionPageLocators.gridOfElements, fromIndex, toIndex)
                    cy.get(interactionPageLocators.gridOfElements).should('have.length', 9).then(items => {
                        const newOrder = Cypress._.map(items, 'textContent')
                        expect(newOrder).not.to.deep.eq(initialOrder)
                        expect(newOrder[toIndex]).to.eq(draggedItem)
                    })
                })
            })
        })
    })

    context('Actions with selectable elements - clicker ', () => {
        beforeEach(() => {
            interactionsPage.openOption('Selectable')
            cy.url().should('match', /selectable/)
        })
        it('Make a smile', () => {
            const smileArr = ['One', 'Three', 'Nine', 'Eight', 'Seven']
            interactionsPage.clickOn(interactionPageLocators.tabGridElems)
            interactionsPage.clickGridElement(...smileArr)
        })
        it('Random click element - list', () => {
            for (let i = 0; i < 5; i++) {
                interactionsPage.clickOnRandomElement(interactionPageLocators.selectList)
            }
        })
        it('Random click element - grid', () => {
            interactionsPage.clickOn(interactionPageLocators.tabGridElems)
            for (let i = 0; i < 5; i++) {
                interactionsPage.clickOnRandomElement(interactionPageLocators.gridOfElements)
            }
        })
    })

    context('Resizable boxes actions', () => {
        beforeEach(() => {
            interactionsPage.openOption('Resizable')
            cy.url().should('match', /resizable/)
        })
        it('Restricted resize', () => {
            interactionsPage.resizeBox(100, 100) //по каким то причинам react компонент тут по точным координатам не пытается провести drop
            cy.get('#resizableBoxWithRestriction').invoke('width').should('be.lte', 150)
            cy.get('#resizableBoxWithRestriction').invoke('height').should('be.lte', 150)
            interactionsPage.resizeBox(250, 250)
            cy.get('#resizableBoxWithRestriction').invoke('width').should('be.gte', 200).and('be.lte', 500)
            cy.get('#resizableBoxWithRestriction').invoke('height').should('be.gte', 200).and('be.lte', 300)
            interactionsPage.resizeBox(500, 300)
            cy.get('#resizableBoxWithRestriction').invoke('width').should('be.gte', 498)
            cy.get('#resizableBoxWithRestriction').invoke('height').should('be.gte', 298)
            //запрет на значениме больше 500х300
            interactionsPage.resizeBox(600, 400)
            cy.get('#resizableBoxWithRestriction').invoke('width').should('be.lte', 500)
            cy.get('#resizableBoxWithRestriction').invoke('height').should('be.lte', 300)
            //так же работает при непосредственном вмешательстве в style, подход не совсем правильный, скорее как замещение реального размера
            //лимиты в этом случае не сработают
            interactionsPage.setWidthAndHeightValue(250, 250)
            cy.get('#resizableBoxWithRestriction').invoke('width').should('be.gte', 200).and('be.lte', 251)
            cy.get('#resizableBoxWithRestriction').invoke('height').should('be.gte', 200).and('be.lte', 251)
        })

        it('Unlimited resizable box', () => {
            //до точных значений остаются десятые и тысячные и при использовании методов плагина 4w X и Y значения имеют наложение(не понятно откуда)
            //константами калибруем до указанных значений в методе и в ассерте, чтоб проверять  вхождение по границам
            const offsetX = 198.667;
            const offsetY = 197.667;
            interactionsPage.resizeUnlimBox(1600 - offsetX, 1400 - offsetY)
            cy.get('#resizable').invoke('width').should('be.gte', 1600).and('lte', 1601)
            cy.get('#resizable').invoke('height').should('be.gte', 1400).and('lte', 1401)
        })
    })

    context('Droppable actions', () => {
        beforeEach(() => {
            interactionsPage.openOption('Droppable')
            cy.url().should('match', /droppable/)
        })

        it('DragNDrop', () => {
            cy.get(interactionPageLocators.draggable).drag(interactionPageLocators.droppable, { force: true })
            cy.get(interactionPageLocators.droppable).should('have.css', 'background-color', 'rgb(70, 130, 180)')
        })

        it('Accept', () => {
            interactionsPage.clickOn(interactionPageLocators.acceptTabInDroppable)
            interactionsPage.dragNdrop(interactionPageLocators.notAcceptable, interactionPageLocators.acceptDroppable)
            interactionsPage.checkBackgroundColor(interactionPageLocators.acceptDroppable, 'rgba(0, 0, 0, 0)') //смотрим что бокс не изменил цвет
            interactionsPage.dragAndmouseMove(interactionPageLocators.acceptable, 100, 100)
            interactionsPage.checkBackgroundColor(interactionPageLocators.acceptDroppable, 'rgb(60, 179, 113)')
            interactionsPage.dragNdrop(interactionPageLocators.acceptable, interactionPageLocators.acceptDroppable)
            interactionsPage.checkBackgroundColor(interactionPageLocators.acceptDroppable, 'rgb(70, 130, 180)')
        })

        it('Propogation', () => { //можно было бы разбить на множество мелких тестов, но потаскать решил в одном
            interactionsPage.clickOn(interactionPageLocators.propogationTab)
            //move dragBox and check colors of both boxes
            interactionsPage.dragAndmouseMove(interactionPageLocators.dragBox, 100, 100)
            interactionsPage.checkBackgroundColor(interactionPageLocators.notGreedyDropBoxPropogation, 'rgb(60, 179, 113)')
            interactionsPage.checkBackgroundColor(interactionPageLocators.notGreedyInnerDropBoxPropogation, 'rgb(60, 179, 113)')
            interactionsPage.checkBackgroundColor(interactionPageLocators.greedyDropBoxPropogation, 'rgb(60, 179, 113)')
            interactionsPage.checkBackgroundColor(interactionPageLocators.greedyDropBoxInnerPropogation, 'rgb(60, 179, 113)')
            //not greedy not inner move
            interactionsPage.dragAndmouseMove(interactionPageLocators.dragBox, 400, 150)
            interactionsPage.checkBackgroundColor(interactionPageLocators.notGreedyDropBoxPropogation, 'rgb(143, 188, 143)')
            interactionsPage.checkBackgroundColor(interactionPageLocators.notGreedyInnerDropBoxPropogation, 'rgb(60, 179, 113)')
            //not greedy inner move
            interactionsPage.dragAndmouseMove(interactionPageLocators.dragBox, 0, -50)
            interactionsPage.checkBackgroundColor(interactionPageLocators.notGreedyInnerDropBoxPropogation, 'rgb(143, 188, 143)')
            //not greedy not inner dnd
            interactionsPage.dragNdrop(interactionPageLocators.dragBox, interactionPageLocators.notGreedyDropBoxPropogation)
            interactionsPage.checkBackgroundColor(interactionPageLocators.notGreedyDropBoxPropogation, 'rgb(70, 130, 180)')
            interactionsPage.checkDroppableText(interactionPageLocators.notGreedyDropBoxPropogation)
            //not greedy inner dnd
            interactionsPage.dragNdrop(interactionPageLocators.dragBox, interactionPageLocators.notGreedyInnerDropBoxPropogation)
            interactionsPage.checkBackgroundColor(interactionPageLocators.notGreedyInnerDropBoxPropogation, 'rgb(70, 130, 180)')
            interactionsPage.checkDroppableText(interactionPageLocators.notGreedyInnerDropBoxPropogation)
            // greedy not inner move
            interactionsPage.dragAndmouseMove(interactionPageLocators.dragBox, 0, 190)
            interactionsPage.checkBackgroundColor(interactionPageLocators.greedyDropBoxPropogation, 'rgb(143, 188, 143)')
            interactionsPage.checkBackgroundColor(interactionPageLocators.greedyDropBoxInnerPropogation, 'rgb(60, 179, 113)')
            // greedy inner move
            interactionsPage.dragAndmouseMove(interactionPageLocators.dragBox, 0, 100)
            interactionsPage.checkBackgroundColor(interactionPageLocators.greedyDropBoxPropogation, 'rgb(60, 179, 113)')
            interactionsPage.checkBackgroundColor(interactionPageLocators.greedyDropBoxInnerPropogation, 'rgb(143, 188, 143)')
            //greedy not inner dnd
            interactionsPage.dragNdrop(interactionPageLocators.dragBox, interactionPageLocators.greedyDropBoxPropogation)
            interactionsPage.checkBackgroundColor(interactionPageLocators.greedyDropBoxPropogation, 'rgb(70, 130, 180)')
            interactionsPage.checkDroppableText(interactionPageLocators.greedyDropBoxPropogation)
            //greedy inner dnd
            interactionsPage.dragNdrop(interactionPageLocators.dragBox, interactionPageLocators.greedyDropBoxInnerPropogation)
            interactionsPage.checkBackgroundColor(interactionPageLocators.greedyDropBoxInnerPropogation, 'rgb(70, 130, 180)')
            interactionsPage.checkDroppableText(interactionPageLocators.greedyDropBoxInnerPropogation)
        })

        it('Revert', () => {
            const getRectangle = ($el) => $el[0].getBoundingClientRect()
            interactionsPage.clickOn(interactionPageLocators.revertTab)
            interactionsPage.dragAndmouseMove(interactionPageLocators.revertableBox, 100, 0)
            interactionsPage.checkBackgroundColor(interactionPageLocators.revertDropBox, 'rgb(60, 179, 113)')
            interactionsPage.dragAndmouseMove(interactionPageLocators.revertableBox, 400, 100)
            interactionsPage.checkBackgroundColor(interactionPageLocators.revertDropBox, 'rgb(143, 188, 143)')
            interactionsPage.dragAndmouseMove(interactionPageLocators.revertableBox, -350, -30)
            //отпускаем лкм
            cy.get(interactionPageLocators.revertableBox).click()
            //dnd revert check       
            interactionsPage.dragNdrop(interactionPageLocators.revertableBox, interactionPageLocators.revertDropBox)
            cy.wait(1000) //explicit wait Для ожидания когда элемент вернется на место
            cy.get(interactionPageLocators.revertableBox).then(getRectangle).then(rectRevertableBox => {
                cy.get(interactionPageLocators.revertDropBox).then(getRectangle).then(rectDropBox => {
                    expect(interactionsPage.areOverlapping(rectRevertableBox, rectDropBox), 'are overlapping?').to.be.false
                })
            })
            //dnd non revert check
            interactionsPage.dragNdrop(interactionPageLocators.nonrevertableBox, interactionPageLocators.revertDropBox)
            cy.get(interactionPageLocators.nonrevertableBox).then(getRectangle).then(rectNonRevertableBox => {
                cy.get(interactionPageLocators.revertDropBox).then(getRectangle).then(rectDropBox => {
                    expect(interactionsPage.areOverlapping(rectNonRevertableBox, rectDropBox), 'are overlapping?').to.be.true
                })
            })
        })
    })

    context('Draggable actions', () => {
        beforeEach(() => {
            interactionsPage.openOption('Dragabble')
            cy.url().should('match', /dragabble/)
        })

        const getRectangle = ($el) => $el[0].getBoundingClientRect();

        it('Simple drag', () => {
            cy.get(interactionPageLocators.dragBox).then(getRectangle).then(rectPositionBox => {
                interactionsPage.dragAndmouseMove(interactionPageLocators.dragBox, 100, 100)
                cy.get(interactionPageLocators.dragBox).then(getRectangle).then(rectNextPositionBox => {
                    expect(rectPositionBox).to.not.be.eq(rectNextPositionBox)
                })
            })
        })

        it('Axis restrict X', () => {
            //чекаем что при mouseMove по X оси для Y элемента, элемент на месте остается            
            const getRectangleX = ($el) => $el[0].getBoundingClientRect().x;
            interactionsPage.clickOn(interactionPageLocators.tabAxisRestrict)
            cy.get(interactionPageLocators.restrictedY).then(getRectangleX).then(rectPositionXStart => {
                interactionsPage.dragAndmouseMove(interactionPageLocators.restrictedY, 200, 0)                
                cy.get(interactionPageLocators.restrictedY).then(getRectangleX).then(rectPositionXEnd => {
                    expect(rectPositionXStart).to.eq(rectPositionXEnd)
                })
            })
        })

        it('Axis restrict Y', () => {
            //тут баг сайпреса, при движении смещение по Y оси, либо баг кнопки. Даже при смещении по осям 0 и 0, несоовтетствие Y оси от изначального положения            
            const getRectangleY = ($el) => $el[0].getBoundingClientRect().y;
            interactionsPage.clickOn(interactionPageLocators.tabAxisRestrict)
            cy.get(interactionPageLocators.restrictedX).then(getRectangleY).then(rectPositionYStart => {
                cy.get(interactionPageLocators.restrictedX).should('exist').trigger('mousedown', { which: 1 }).trigger('mousemove',{clientX:0, ClientY:0, force: true })
                //interactionsPage.dragAndmouseMove(interactionPageLocators.restrictedX, 2.3333435058594, 0)         
                cy.get(interactionPageLocators.restrictedX).then(getRectangleY).then(rectPositionYEnd => {
                    expect(rectPositionYStart).to.eq(rectPositionYEnd)
                })
            })
        })
    })
})