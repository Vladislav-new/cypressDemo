import elementsLocators from "./locators/elementsLocators";

export class TablePage {
    createNewRow(firstName, lastName, age, email, salary, department) {
        this.clickOnAddBtn()
        this.typeFirstName(firstName)
        this.typeLastName(lastName)
        this.typeAge(age)
        this.typeEmail(email)
        this.typeSalary(salary)
        this.typeDepartment(department)
        this.clickSubmitBtn()
    }

    clickOnAddBtn() {
        cy.get(elementsLocators.addNewRowBtn).should('be.visible').click()
        cy.log('CLick on "Add" btn')
    }

    typeFirstName(name) {
        cy.get(elementsLocators.firstNameTableFieldInput).should('exist').type(`{selectAll}{backspace}${name}`)
        cy.log(`Input ${name} in FirstName field`)
    }

    typeLastName(lastname) {
        cy.get(elementsLocators.lastNameTableFieldInput).should('exist').type(lastname)
        cy.log(`Input ${lastname} in LasttName field`)
    }

    typeEmail(email) {
        cy.get(elementsLocators.emailTableFieldInput).should('exist').type(email)
        cy.log(`Input ${email} in Email field`)
    }

    typeAge(age) {
        cy.get(elementsLocators.ageTableFieldInput).should('exist').type(`{selectAll}{backspace}${age}`)
        cy.log(`Input ${age} in Age field`)
    }

    typeSalary(salary) {
        cy.get(elementsLocators.salaryTableFieldInput).should('exist').type(`{selectAll}{backspace}${salary}`)
        cy.log(`Input ${salary} in Salary field`)
    }

    typeDepartment(department) {
        cy.get(elementsLocators.departmentTableFieldInput).should('exist').type(department)
        cy.log(`Input ${department} in Department field`)
    }

    clickSubmitBtn() {
        cy.get(elementsLocators.submitButton).should('be.visible').click()
        cy.log('Click on Submit button')
    }

    clickDeleteRowBtn() {
        cy.get(elementsLocators.deleteRecordTableBtn).last().should('be.visible').click()
        cy.log('Last Row has deleted')
    }

    checkRowIsPresent(firstName, lastName, age, email, salary, department) {
        cy.get(elementsLocators.filledTableRows).last().children().then(elements => {
            cy.wrap(elements).eq(0).find('[role="gridcell"]').eq(0).should('have.text', firstName)
            cy.wrap(elements).eq(0).find('[role="gridcell"]').eq(1).should('have.text', lastName)
            cy.wrap(elements).eq(0).find('[role="gridcell"]').eq(2).should('have.text', age)
            cy.wrap(elements).eq(0).find('[role="gridcell"]').eq(3).should('have.text', email)
            cy.wrap(elements).eq(0).find('[role="gridcell"]').eq(4).should('have.text', salary)
            cy.wrap(elements).eq(0).find('[role="gridcell"]').eq(5).should('have.text', department)
        })
    }

    editRow(index, firstName, age, salary) {
        cy.get(elementsLocators.editTableRowBtn).eq(index).should('be.visible').click()
        this.typeFirstName(firstName)
        this.typeAge(age)
        this.typeSalary(salary)
        this.clickSubmitBtn()
    }

    checkEditedFieldShow(rowIndex, cellIndex, newValue) {
        cy.get(elementsLocators.filledTableRows).eq(rowIndex).children().children().eq(cellIndex).invoke('text').then(value => {
            expect(value).to.equal(newValue.toString())
        })
    }

    searchRow(string) {
        cy.get(elementsLocators.searchBoxInput).should('exist').type(string, { delay: 300 })
        cy.log(`Searched by "${string}" value`)
    }
    checkSearchedValuesInTable(search) {
        //ищем любое соответствие поисковых данных в ячейках таблицы
        cy.get(elementsLocators.filledTableRows).children().children().contains(search, { matchCase: false }).invoke('text').then(value => {
            expect(value.toLowerCase()).to.include(search.toString().toLowerCase())
        })
    }
}