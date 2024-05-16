import { blockRequests } from "../../helpers/blockList";
import { getRandomInt } from "../../helpers/common";
import { fakeAddress, fakeEmail, fakeFullName } from "../../helpers/fakers";
import { CheckBoxPage } from "../../pageObjects/elementsPage/elementsCheckBoxPage";
import { RadioButton } from "../../pageObjects/elementsPage/elementsRadioButtonPage";
import { TextBoxPage } from "../../pageObjects/elementsPage/elementsTextBoxPage";
import elementsLocators from "../../pageObjects/elementsPage/locators/elementsLocators";
import { MainPage } from "../../pageObjects/mainPage/mainPage";

const mainPage = new MainPage();
const textBoxPage = new TextBoxPage();
const checkBoxPage = new CheckBoxPage();
const radioButtonPage = new RadioButton();

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

    context('Tables', () => {
        beforeEach(() => {
            mainPage.openOption('Web Tables');
            cy.url().should('match', /webtables/)
        })

        it.only('Create new row', () => {
            
        })

        it('Edit row', () => {
           
        })

        it('Delete row', () => {
            
        })

        it('Search row', () => {
           
        })
    })


    it('Upload', () => {

    })

    it('Download', () => {

    })
})