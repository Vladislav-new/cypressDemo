import { blockRequests } from "../../helpers/blockList";
import { fakeAddress, fakeDepartment, fakeEmail, fakeFirstName, fakeFullName, fakeLastName, fakeNumber } from "../../helpers/fakers";
import { CheckBoxPage } from "../../pageObjects/elementsPage/elementsCheckBoxPage";
import { RadioButton } from "../../pageObjects/elementsPage/elementsRadioButtonPage";
import { TablePage } from "../../pageObjects/elementsPage/elementsTablePage";
import { TextBoxPage } from "../../pageObjects/elementsPage/elementsTextBoxPage";
import elementsLocators from "../../pageObjects/elementsPage/locators/elementsLocators";
import { MainPage } from "../../pageObjects/mainPage/mainPage";
import { Buttons } from "../../pageObjects/elementsPage/elementsButtonsPage";
import { LinksPage } from "../../pageObjects/elementsPage/elementsLinksPage";
import { UploadDownloadPage } from "../../pageObjects/elementsPage/elementsUploadDownloadPage";
import { DynamicPropsPage } from "../../pageObjects/elementsPage/elementsDynamicProps";

const mainPage = new MainPage();
const textBoxPage = new TextBoxPage();
const checkBoxPage = new CheckBoxPage();
const radioButtonPage = new RadioButton();
const webTable = new TablePage();
const buttonsPage = new Buttons()
const linksPage = new LinksPage();
const downloadAndUploadPage = new UploadDownloadPage();
const dynamicPropsPage = new DynamicPropsPage();

context('Elements options tests', () => {
    
    beforeEach(() => {
        blockRequests();
        cy.visit('/elements', { failOnStatusCode: false })
        cy.log(`Test started: ${Cypress.currentTest.title}`)
    })

    afterEach(() => {
        cy.log(`Test ${Cypress.currentTest.title} completed`)
    })

    it('Text box', () => { 
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
        let messages = ['You have done a double click', 'You have done a right click', 'You have done a dynamic click'];
        mainPage.openOption('Buttons');
        cy.url().should('match', /buttons/)
        buttonsPage.simpleCLickOnBtn()
        buttonsPage.rightClickOnBtn()
        buttonsPage.doubleClickOnBtn()
        messages.forEach(message => {
            buttonsPage.checkMessageAfterClick(elementsLocators.clickMessage, message)
        })
    })

    context('Broken Links - Images', () => {
        beforeEach(() => {
            mainPage.openOption('Broken Links - Images');
            cy.url().should('match', /broken/)
        })
        it('Find broken images on page', () => {//должен упасть это ОК
            const brokenImages = []
            cy.get('img').each(($el, k) => {
                //у сломанных картинок нет ширины в natural
                if ($el.prop('naturalWidth') === 0) {
                    const src = $el.attr('src')
                    const info = `${src ? src : ''}`
                    brokenImages.push(info)
                    cy.log(`Broken image ${k + 1}: ${info}`)
                }
            }).then(() => {
                // report all broken images at once
                if (brokenImages.length) {
                    throw new Error(
                        `Found ${brokenImages.length
                        } broken images\n${brokenImages.join(', ')}`,
                    )
                }
            })
        })

        it('Ckeck links on page', () => {
            cy.get('a').each(link => {
                if (link.prop('href'))
                    cy.request({
                        url: link.prop('href'),
                        failOnStatusCode: false
                    })
                cy.log(link.prop('href'))
            })
        })
    })

    it('Check box', () => { //flacky
        /*
            * для множественного проставления чек бокса и проверки нужно сделать итератор и проверку на check
            * затем занести текст каждого выбранного чек бокса в массив и проверять через сравнение массивов - все в методе @selectRandomCheckBoxes(iter)
        */
        mainPage.openOption('Check Box');
        cy.url().should('match', /checkbox/)
        cy.findByTitle('Expand all').click({ force: true })
        checkBoxPage.selectRandomCheckBoxes(3)
        cy.findByTitle('Collapse all').click({ force: true })
    })

    it('Dynamic props', () => {
        let colorAfter = 'rgb(220, 53, 69)'
        let colorBefore = 'rgb(255, 255, 255)'
        mainPage.openOption('Dynamic Properties');
        cy.url().should('match', /dynamic-properties/)
        dynamicPropsPage.checkBefore(colorBefore)
        cy.wait(5000)
        dynamicPropsPage.checkAfter(colorAfter)
    })

    context('Links', () => {
        beforeEach(() => {
            mainPage.openOption('Links');
            cy.url().should('match', /links/)
        })
        it('Home link click', () => {
            //в cypress нет работы с табами, поэтому удаляем target и просто смотрим редирект
            linksPage.clickOnHomeLink()
            cy.url().should('eq', Cypress.config().baseUrl)
            cy.go('back')
            cy.url().should('match', /links/)
        })

        it('Home dynamic link click', () => {
            //ищем по вхождению строки и кол-ву символов через regexp, т.е. НЕ Home
            linksPage.clickOnDynamicHomeLink()
            cy.url().should('eq', Cypress.config().baseUrl)
            cy.go('back')
            cy.url().should('match', /links/)
        })
        //здесь и далее проверка кодов через Intercept
        it('api call 201', () => {
            cy.intercept('GET', /created/).as('createdResponse')
            linksPage.clickOnRequestBtn(elementsLocators.createdRequest)
            linksPage.checkResponse('createdResponse', 201)
        })

        it('api call 204', () => {
            cy.intercept('GET', /no-content/).as('noContentResponse')
            linksPage.clickOnRequestBtn(elementsLocators.noContentRequest)
            linksPage.checkResponse('noContentResponse', 204)
        })

        it('api call 301', () => {
            cy.intercept('GET', /moved/).as('movedResponse')
            linksPage.clickOnRequestBtn(elementsLocators.movedRequest)
            linksPage.checkResponse('movedResponse', 301)
        })

        it('api call 400', () => {
            cy.intercept('GET', /bad-request/).as('badResponse')
            linksPage.clickOnRequestBtn(elementsLocators.badRequest)
            linksPage.checkResponse('badResponse', 400)
        })

        it('api call 401', () => {
            cy.intercept('GET', /unauthorized/).as('unauthResponse')
            linksPage.clickOnRequestBtn(elementsLocators.unauthorizedRequest)
            linksPage.checkResponse('unauthResponse', 401)
        })

        it('api call 403', () => {
            cy.intercept('GET', /forbidden/).as('deniedResponse')
            linksPage.clickOnRequestBtn(elementsLocators.forbiddenRequest)
            linksPage.checkResponse('deniedResponse', 403)
        })

        it('api call 404', () => {
            cy.intercept('GET', /invalid-url/).as('notFoundResponse')
            linksPage.clickOnRequestBtn(elementsLocators.invalidUrlRequest)
            linksPage.checkResponse('notFoundResponse', 404)
        })
    })

    it('Radio buttons', () => { 
        mainPage.openOption('Radio Button');
        cy.url().should('match', /radio-button/)
        radioButtonPage.tryClickOnNo()
        radioButtonPage.clickOnYes()
        radioButtonPage.checkResultUnderButton(elementsLocators.yesButton)
        radioButtonPage.clickOnImpressive()
        radioButtonPage.checkResultUnderButton(elementsLocators.impressiveButton)
    })

    context('Tables', () => { 
        let params = {
            firstName: fakeFirstName(),
            lastName: fakeLastName(),
            age: fakeNumber(18, 90),
            email: fakeEmail('test'),
            department: fakeDepartment(),
            salary: fakeNumber(100, 90000)
        }
        let searchStrings = ['47386fghrytf3487', 'ins', 'Insurance', 'al', '10000', 'a@', '29']

        beforeEach(() => {
            mainPage.openOption('Web Tables');
            cy.url().should('match', /webtables/)
            webTable.createNewRow(params.firstName, params.lastName, params.age, params.email, params.salary, params.department)
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
            webTable.checkRowIsPresent(params.firstName, params.lastName, params.age, params.email, params.salary, params.department)
            webTable.clickDeleteRowBtn()
        })

        it('Edit row', () => {
            let newAge = fakeNumber(18, 90)
            let newFirstName = fakeFirstName()
            let newSalary = fakeNumber(100, 90000)
            webTable.editRow(3, newFirstName, newAge, newSalary)
            webTable.checkEditedFieldShow(3, 0, newFirstName)
            webTable.checkEditedFieldShow(3, 2, newAge)
            webTable.checkEditedFieldShow(3, 4, newSalary)
        })

        it('Delete row', () => { //считаем кол-во строк в таблице до удаления и сарвниваем с кол-вом после
            cy.get(elementsLocators.filledTableRows).then(($value) => {
                length = $value.length
                webTable.clickDeleteRowBtn()
                cy.get(elementsLocators.filledTableRows).its('length').should('be.lt', length)
            })
        })

        searchStrings.forEach((search) => {
            it(`Search row with attr ${search}`, () => {
                webTable.searchRow(search)
                //сравниваем кол-во пустых строк с общим кол-вом строк и если они около равны, то ищем NoRowsFound - тест окончен
                //это нужно чтоб при изменении отображения элементов в таблице тест не падал
                cy.get(elementsLocators.emptyTableRows).its('length').then(value => {
                    cy.get('[role="rowgroup"]').its('length').then(allrows => {
                        if (value >= allrows) {
                            cy.get('[class="rt-noData"]').contains('No rows found').should('exist')
                        } else {
                            webTable.checkSearchedValuesInTable(search)
                        }
                    })
                })
            })
        })
    })

    it('Upload', () => {
        mainPage.openOption('Upload and Download');
        cy.url().should('match', /upload-download/)
        downloadAndUploadPage.uploadFile()
        cy.get('[id="uploadedFilePath"]').should('be.visible').and('have.text', 'C:\\fakepath\\text2.txt')
    })

    it('Download', () => { //нужно явно указать путь для сохранения либо в chrome options либо в cypress.config.ts
        mainPage.openOption('Upload and Download');
        cy.url().should('match', /upload-download/)
        downloadAndUploadPage.clickOnDownLoad()
        downloadAndUploadPage.verifyDownload()
    })
})