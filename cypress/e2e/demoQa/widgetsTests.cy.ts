import { data } from "cypress/types/jquery";
import { blockRequests } from "../../helpers/blockList";
import { generateRandomDate, getCurrentTime } from "../../helpers/fakers";
import { MainPage } from "../../pageObjects/mainPage/mainPage";
import { AutoCompletePage } from "../../pageObjects/widgetsPage/autoCompletePage";
import { DatePickerPage } from "../../pageObjects/widgetsPage/datePickerPage";
import { faker } from "@faker-js/faker";


const mainPage = new MainPage();
const autoCompletePage = new AutoCompletePage();
const datePickerPage = new DatePickerPage();

context('Actions with widgets', () => {
    beforeEach(() => {
        blockRequests()
        cy.visit('/widgets', { failOnStatusCode: false })
        cy.log(`Test started: ${Cypress.currentTest.title}`)
    })

    afterEach(() => {
        cy.log(`Test ${Cypress.currentTest.title} completed`)
    })
    it('Accordian', () => {
        mainPage.openOption('Accordian')
        cy.url().should('match', /accordian/)
        cy.get('.accordion').eq(1).children().each((accordion) => {
            const currentAccordion = cy.wrap(accordion)
            currentAccordion.click()
            currentAccordion.children().should('have.class', 'collapse show')
        })
    })

    it('Autocomplete', () => {
        const colorMap: { [key: string]: string } = {
            red: 're',
            blue: 'bl',
            green: 'gr',
            yellow: 'ye',
            purple: 'pu',
            black: 'bla',
            white: 'whi'
        };
        mainPage.openOption('Auto Complete')
        cy.url().should('match', /auto-complete/)
        //ввод значений мапы в текстовую форму и проверка
        Object.entries(colorMap).forEach(([color, value]) => {
            autoCompletePage.typeMultipleColors(value)
            autoCompletePage.checkColorsInMultipleForm(color)
        })
        //генерим случайный цвет для ввода, и по его значению берем имя ключа для сравнения с результатом
        const randomColor = colorMap[Object.keys(colorMap)[Math.floor(Math.random() * Object.keys(colorMap).length)]];
        const randomKey = Object.keys(colorMap).find((key) => colorMap[key] === randomColor);

        //ввод случайного значения мапы с ключом во второе поле и проверка
        autoCompletePage.typeSingleColor(randomColor)
        autoCompletePage.checkSingleColor(randomKey);
    })

    context('DatePicker', () => {
        let date = generateRandomDate()    
        beforeEach(() => {
            mainPage.openOption('Date Picker')
            cy.url().should('match', /date-picker/)
        })
        it('Date Picker - calendar', () => {
            datePickerPage.selectRandomDateFromCalendar()            
        })

        it('Date Picker - input date in calendar', () => {
            datePickerPage.inputDate(date)
            datePickerPage.checkDateInInput(`${date}`)
        })

        it('Date picker - calendar with time',()=>{
            datePickerPage.selectRandomDateTimeFromCalendar()
        })
        it('Date picker - input date with time', () => {
            let currentTime = getCurrentTime()
            datePickerPage.inputDateTime(`${date} ${currentTime}`)
            datePickerPage.checkDateTimeInput(date, currentTime)
        })
    })

    context('Slider actions', () => {
        it.only('Slider drag', () => {
            mainPage.openOption('Slider')
            cy.url().should('match', /slider/)
        })

        it('slider Input and check position', () => {

        })
    })


    it('Progress bar', () => {

    })

    it('Tabs', () => {

    })

    it('Tool Tips', () => {

    })

    it('Select Menu', () => {

    })
})