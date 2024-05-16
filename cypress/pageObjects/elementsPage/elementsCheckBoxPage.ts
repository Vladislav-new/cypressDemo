import { result } from "cypress/types/lodash"
import { getRandomInt } from "../../helpers/common"
import elementsLocators from "./locators/elementsLocators"

export class CheckBoxPage {
    clickOnExpandAll() {
        cy.findByTitle('Expand all').click({ force: true }).then(() => {
            cy.log('Tree has expanded')
        })
    }

    findHalfCheckedParents(locator, index) {
        cy.wrap(locator).eq(index).should('be.visible').parentsUntil('#tree-node').then(() => {
            cy.get(elementsLocators.parentCheckBoxesChecked).should('be.visible')
        })
    }

    checkArraysIsEqual(arr1, arr2) {
        cy.then(() => {
            arr1.sort()
            arr2.sort()
            expect(arr1.toString()).to.equal(arr2.toString())
        })
    }

    selectRandomCheckBoxes(iterations: number) {
        let results = []
        let values = []
        for (let i = 0; i < iterations; i++) {
            cy.get(elementsLocators.checkBoxMaxDepthInTree).should('be.visible').then($listing => {
                let randomNumber = getRandomInt(0, $listing.length - 1)
                let isChecked = false
                cy.then(() => {
                    if (!isChecked) {
                        cy.wrap($listing).eq(randomNumber).then(($checkbox) => {
                            cy.wrap($checkbox).click()
                            isChecked = true
                        })
                    } else {
                        // Обновляем предыдущий случайный индекс
                        randomNumber = getRandomInt(0, $listing.length - 1)
                    }
                })
                //проверяем простановку родительских чекбоксов
                this.findHalfCheckedParents($listing, randomNumber)
                //заносим данные в массив values из строк чек боксов
                cy.wrap($listing).eq(randomNumber).siblings(elementsLocators.checkBoxTitles).should('be.visible').each(($el) => {
                    cy.wrap($el).invoke('text').then((value) => {
                        if (value === 'Word File.doc') {
                            value = 'wordfile'
                        } else if (value === 'Excel File.doc') {
                            value = 'excelfile'
                        }
                        values.push(value.toLowerCase())
                    })
                })
            })
        }
        //тут проблема с наполнением массива поскольку получаем сразу все значения, приходится делить
        //заносим данные в массив results из выбранных строк внизу списка
        cy.get(elementsLocators.checkBoxResultsView).should('be.visible').each(($els) => {
            cy.wrap($els).invoke('text').then((result) => {
                results.push(result.toLowerCase().split(','))
            })
        })
        this.checkArraysIsEqual(results, values)
    }
}