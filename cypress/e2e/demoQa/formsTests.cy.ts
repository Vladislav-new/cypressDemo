/**
 * пример теста из фикстуры, когда вводимые данные неизвестны,
 *  а вводятся на основании значений из фикстуры (да\нет)
 *  с последующей генерацией
 * 
 * 
 * p.s. для проверки введенных значений 
 * а не проверки на Не пустые строки нужно переделать методы ввода данных
 *  с их последующим сохранением в переменные и переиспользовать для сравнения
 */

import { blockRequests } from "../../helpers/blockList";
import { FormsPracticePage } from "../../pageObjects/formsPage/formsPracticePage";

const data = require('/cypress/fixtures/formsData.json');
const formsPage = new FormsPracticePage();

beforeEach(() => {
    blockRequests();
    cy.visit('/automation-practice-form', { failOnStatusCode: false })
    cy.log(`Test started: ${Cypress.currentTest.title}`)
})

afterEach(() => {
    cy.log(`Test ${Cypress.currentTest.title} completed`)
})

data.forEach((userData) => {

    it(`Testing form with data set: ${userData.Column1}`, () => {
        cy.wrap(userData).then((data) => {
            let isEmpty = true
            // Проверяем все ключи объекта     
            for (const key in data) {
                if (data[key] !== 'empty') {
                    isEmpty = false
                    break
                }
            }
            //Если хотя бы одно значение отлично от "empty", выполняем действия
            if (!isEmpty) {
                //свичи запрятать в методы отдельные по данным
                formsPage.typeFirstName(userData.firstName)
                formsPage.typeLastName(userData.lastName)
                formsPage.typeEmail(userData.email)
                formsPage.typeGender(userData.gender)
                formsPage.typeMobile(userData.mobile)
                formsPage.typeState(userData.state)
                formsPage.typeCity(userData.city)
                formsPage.typeBirthDate(userData.birthDate)
                formsPage.typeAddress(userData.address)
                formsPage.typeHobbies(userData.hobbies)
                formsPage.typeSubjects(userData.subjects, 4)
                formsPage.clickSubmit()
                if (userData.firstName !== 'empty' && userData.lastName !== 'empty' && userData.mobile !== 'empty' && userData.gender !== 'empty') {
                    // Список полей для проверки
                    const fieldsToCheck = Object.keys(userData).filter((key) => userData[key] !== 'empty')
                    // Проверяем только заполненные поля из фикстуры
                    for (let i = 1; i < fieldsToCheck.length - 2; i++) { //-2 потому что city и lastName являются составными частями табличных полей
                        const field = fieldsToCheck[i]
                        cy.get(`tbody > :nth-child(${i}) > :nth-child(2)`).then(($el) => {
                            if ($el.text().trim() !== '') {
                                //проверка на то что данные в таблице есть, иначе это бы выглядело на индусском для првоерки ТОЛЬКО введенных значений
                                expect($el.text().trim()).not.to.be.empty
                            }
                        })
                    }
                }
            }
        })
    })
})
