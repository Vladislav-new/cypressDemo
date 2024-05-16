import { blockRequests } from "../../helpers/blockList";
import { fakeAddress, fakeDepartment, fakeEmail, fakeFirstName, fakeFullName, fakeLastName, fakeNumber } from "../../helpers/fakers";
import { CheckBoxPage } from "../../pageObjects/elementsPage/elementsCheckBoxPage";
import { RadioButton } from "../../pageObjects/elementsPage/elementsRadioButtonPage";
import { TablePage } from "../../pageObjects/elementsPage/elementsTablePage";
import { TextBoxPage } from "../../pageObjects/elementsPage/elementsTextBoxPage";
import elementsLocators from "../../pageObjects/elementsPage/locators/elementsLocators";
import { MainPage } from "../../pageObjects/mainPage/mainPage";

const mainPage = new MainPage();
const textBoxPage = new TextBoxPage();
const checkBoxPage = new CheckBoxPage();
const radioButtonPage = new RadioButton();
const webTable = new TablePage();

context('Elements options tests', () => {
    beforeEach(() => {
        blockRequests();
        cy.visit('/elements', { failOnStatusCode: false })
    })
    it('Text box', () => { //done
        //Заполняем строки рандомными данными и проверяем их отображение в текстовом блоке
        const name = fakeFullName();
        const email = fakeEmail('test');
        const currAddress = fakeAddress();
        const permAddress = fakeAddress();
        mainPage.openOption('Text Box');
        cy.url().should('match', /text-box/)
        textBoxPage.inputDataIn(elementsLocators.fullNameTextFieldInput, name)
        textBoxPage.inputDataIn(elementsLocators.emailTextFieldInput, email)
        textBoxPage.inputDataIn(elementsLocators.currentAddressTextFieldInput, currAddress)
        textBoxPage.inputDataIn(elementsLocators.permAddressTextFieldInput, permAddress)
        textBoxPage.clickOnSubmit()
        textBoxPage.assertField(elementsLocators.resultNameField, name)
        textBoxPage.assertField(elementsLocators.resultEmailField, email)
        textBoxPage.assertField(elementsLocators.resultCurrentAddressField, currAddress)
        textBoxPage.assertField(elementsLocators.resultPermAddressField, permAddress)
    })

    it('Buttons', () => {

    })

    it('Broken Links', () => {

    })

    it('Check box', () => { //done
        /*
            * для множественного проставления чек бокса и проверки нужно сделать итератор и проверку на check
            * затем занести текст каждого выбранного чек бокса в массив и проверять через сравнение массивов - все в методе @selectRandomCheckBoxes(iter)
        */
        mainPage.openOption('Check Box');
        cy.url().should('match', /checkbox/)
        cy.findByTitle('Expand all').click({ force: true })
        checkBoxPage.selectRandomCheckBoxes(3)
    })

    it('Dynamic props', () => {

    })

    it('Links', () => {

    })

    it('Radio buttons', () => { //done
        mainPage.openOption('Radio Button');
        cy.url().should('match', /radio-button/)
        radioButtonPage.tryClickOnNo()
        radioButtonPage.clickOnYes()
        radioButtonPage.checkResultUnderButton(elementsLocators.yesButton)
        radioButtonPage.clickOnImpressive()
        radioButtonPage.checkResultUnderButton(elementsLocators.impressiveButton)
    })

    context('Tables', () => { //in progress
        let params = {
            firstName: fakeFirstName(),
            lastName: fakeLastName(),
            age: fakeNumber(18, 90),
            email: fakeEmail('test'),
            department: fakeDepartment(),
            salary: fakeNumber(100, 90000)
        }

        beforeEach(() => {
            mainPage.openOption('Web Tables');
            cy.url().should('match', /webtables/)
            cy.log(`Test started: ${Cypress.currentTest.title}`)
            webTable.createNewRow(params.firstName, params.lastName, params.age, params.email, params.salary, params.department)
        })

        afterEach(()=>{
            webTable.clickDeleteRowBtn()
            cy.log(`Test ${Cypress.currentTest.title} completed`)
        }) 

        it(`Create new row with ${params.firstName}, ${params.lastName}, ${params.age}, ${params.email}, ${params.department}, ${params.salary}`, () => {
            //проверка, что grid cell не пустой в следующей строке
            webTable.clickOnAddBtn()
            cy.findByRole('dialog').should('exist')
            webTable.typeFirstName(params.firstName)
            webTable.typeLastName(params.lastName)
            webTable.typeAge(params.age)
            webTable.typeSalary(params.salary)
            webTable.typeDepartment(params.department)
            webTable.typeEmail(params.email)
            webTable.clickSubmitBtn()
            webTable.checkRowIsPresent(params.firstName, params.lastName, params.age, params.email,params.salary,params.department)
            webTable.clickDeleteRowBtn()
        })

        it('Edit row', () => {
           let newAge= fakeNumber(18, 90)
           let newFirstName = fakeFirstName()
           let newSalary = fakeNumber(100, 90000)
           webTable.editRow(3, newFirstName, newAge, newSalary)
           webTable.checkEditedFieldShow(3, 0, newFirstName)
           webTable.checkEditedFieldShow(3, 2, newAge)
           webTable.checkEditedFieldShow(3, 4, newSalary)
        })

        it.only('Delete row', () => {
            //запомнить кол-во строк с данными до удаления и после сравнить их, должно быть на 1 меньше
        })

        it('Search row', () => {
           
        })
    })


    it('Upload', () => {

    })

    it('Download', () => {

    })
})