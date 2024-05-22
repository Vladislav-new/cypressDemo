import { fakeNumber } from "../../helpers/fakers";
import widgetsPagesLocators from "./locators/widgetsPagesLocators";

export class DatePickerPage {

    selectRandomDateFromCalendar() {
        let year = fakeNumber(1910, 2070).toString()
        cy.get(widgetsPagesLocators.dateInput).should('be.visible').click()
        cy.get(widgetsPagesLocators.datePickerYearSelectInCalendar).select(`${year}`)
        cy.get(widgetsPagesLocators.datePickerMonthSelectInCalendar).children().should('exist')
            .then(($list) => {
                let random = fakeNumber(0, $list.length - 1)
                cy.wrap($list).eq(random).invoke('text').then(text => {
                    cy.get(widgetsPagesLocators.datePickerMonthSelectInCalendar).should('exist').select(text)
                })
            })
        cy.get(widgetsPagesLocators.datePickerDayInCurrentMonth).should('exist').then(($list) => {
            let random = fakeNumber(0, $list.length - 1)
            cy.wrap($list).eq(random).click({ force: true })
        })
    }

    selectYearOrMonth(locator, dropdown) {
        cy.get(locator).then((hower) => {
            cy.wrap(hower).realClick()
            cy.get(dropdown).children().should('be.visible').then($list => {
                let random = fakeNumber(0, $list.length - 1)
                cy.wrap($list).eq(random).scrollIntoView().realClick()
            })
        })
    }

    selectDay() {
        cy.get(widgetsPagesLocators.datePickerDayInCurrentMonth).should('exist').then(($list) => {
            let random = fakeNumber(0, $list.length - 1)
            cy.wrap($list).eq(random).click({ force: true })
        })
    }

    selectTime() {
        cy.get(widgetsPagesLocators.dateTimeInput).should('be.visible').click()
        cy.get(widgetsPagesLocators.datePickerTimeInCalendar).children().should('exist').then($list => {
            let random = fakeNumber(0, $list.length - 1)
            cy.wrap($list).eq(random).click({ force: true })
        })
    }

    selectRandomDateTimeFromCalendar() {
        cy.get(widgetsPagesLocators.dateTimeInput).should('be.visible').click()
        //год
        this.selectYearOrMonth(widgetsPagesLocators.datePickerYear, widgetsPagesLocators.datePickerYearDropDown)
        //месяц
        this.selectYearOrMonth(widgetsPagesLocators.datePickerMonth, widgetsPagesLocators.datePickerMonthDropDown)
        //день
        this.selectDay()
        //время
        this.selectTime()
    }

    inputDate(date) {
        cy.get(widgetsPagesLocators.dateInput).type(`{selectAll}${date.toString()}{enter}`)
    }

    inputDateTime(dateTime) {
        cy.get(widgetsPagesLocators.dateTimeInput).type(`{selectAll}${dateTime.toString()}{enter}`)
    }

    checkDateInInput(checkDate) {
        const date = new Date(checkDate);
        const formattedDate = date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        cy.get(widgetsPagesLocators.dateInput).invoke('val').should('eq', formattedDate)
    }

    checkDateTimeInput(dateString, timeString) {
        const date = new Date(dateString);
        const hours = parseInt(timeString.slice(0, 2))
        const minutes = parseInt(timeString.slice(3, 5))
        date.setHours(hours, minutes)
        const formattedDateTime = date.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        })
        cy.get(widgetsPagesLocators.dateTimeInput).invoke('val').should('eq', formattedDateTime.replace(' at ', ' ').toString())
    }

}