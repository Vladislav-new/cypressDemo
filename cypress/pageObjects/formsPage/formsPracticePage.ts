import { fakeAddress, fakeBirthDate, fakeEmail, fakeFirstName, fakeLastName, fakeNumber, fakeSubject } from "../../helpers/fakers";
import formsPageLocators from "./locators/formsPageLocators";

export class FormsPracticePage {

    typeFirstName(data) {
        switch (data) {
            case 'filled':
                let firstName = fakeFirstName();
                cy.get(formsPageLocators.firstNameInput).should('exist').type(firstName, { delay: 100 });
                cy.log(`Typed: ${firstName}`);
                return firstName;
            case 'empty':
                cy.log('Do nothing');
                return '';
        }
    }

    typeLastName(data) {
        switch (data) {
            case 'filled':
                let lastName = fakeLastName()
                cy.get(formsPageLocators.lastNameInput).should('exist').type(lastName, { delay: 100 })
                cy.log(`Typed: ${lastName}`)
                break;
            case 'empty':
                cy.log('Do nothing')
        }
    }

    typeEmail(data) {
        switch (data) {
            case 'filled':
                let email = fakeEmail('test')
                cy.get(formsPageLocators.emailInput).should('exist').type(email)
                cy.log(`Typed: ${email}`)
                break;
            case 'empty':
                cy.log('Do nothing')
        }
    }

    typeGender(data) {
        switch (data) {
            case 'Male':
                cy.get(formsPageLocators.genderRadioBtn).siblings().contains(data).click()
                cy.log('Select male gender');
                break;
            case 'Female':
                cy.get(formsPageLocators.genderRadioBtn).siblings().contains(data).click()
                cy.log('Select female gender');
                break;
            case 'Other':
                cy.get(formsPageLocators.genderRadioBtn).siblings().contains(data).click()
                cy.log('Select other gender');
                break;
        }
    }

    typeMobile(data) {
        let nineNumbers = fakeNumber(111111111, 999999999)
        let tenNumbers = fakeNumber(1111111111, 9999999999)
        switch (data) {
            case 'nineNumbers':
                cy.get(formsPageLocators.mobileNumber).should('exist').type(nineNumbers.toString())
                cy.log(`Type ${nineNumbers} mobie`);
                break;
            case 'tenNumbers':
                cy.get(formsPageLocators.mobileNumber).should('exist').type(tenNumbers.toString())
                cy.log(`Type ${tenNumbers} mobie`);
                break;
        }
    }

    typeBirthDate(data) {
        switch (data) {
            case 'filled':
                let birthDay = fakeBirthDate()
                cy.get(formsPageLocators.birthDateInput).should('exist').type(`{selectAll}${birthDay.toString()}{enter}`)
                cy.log(`Type ${birthDay} in calendar`)
                break;
            case 'empty':
                cy.log('Do nothing')
                break;
        }
    }

    typeSubjects(data: string, iterations: number) {
        let enteredSubjects: Set<string> = new Set(); // Используем Set для удаления дубликатов
        let subjectsArray = data.split(',');

        switch (data) {
            case 'filled':
                // Генерируем новые слова с помощью fakeSubject()
                for (let i = 0; i < iterations; i++) {
                    let newSubjects = subjectsArray.map(subject => fakeSubject()); // применение map() для генерации новых слов, где хотябы одно слово будет введено
                    // Вводим новые данные и проверяем на совпадение
                    newSubjects.forEach(subject => {
                        let newSubject = subject;
                        while (enteredSubjects.has(newSubject.trim())) {
                            newSubject = fakeSubject(); // Генерируем новое слово, пока оно не будет уникальным
                        }
                        cy.get(formsPageLocators.subjectsAreaInput).type(`${newSubject}{enter}`);
                        enteredSubjects.add(newSubject.trim()); // Добавляем слово в Set
                    });
                }
                break;
            case 'empty':
                cy.log('Do nothing');
                break;
        }
    }

    clickOnHobbieCheckBox(hobbiesArray) {
        cy.get(formsPageLocators.hobbiesArea).each(hobbie => {
            cy.wrap(hobbie).invoke('text').then(hobbieValue => {
                hobbiesArray.forEach(hobby => {
                    if (hobbieValue.trim() === hobby.trim()) {
                        cy.wrap(hobbie).contains(hobby.trim(), { matchCase: false }).click({ multiple: true })
                    }
                })
            })
        })
    }

    typeHobbies(data) {
        let hobbiesArray = data.split(',');
        switch (data) {
            case 'Music':
                this.clickOnHobbieCheckBox(hobbiesArray)
                cy.log('Check Music hobbie');
                break;
            case 'Reading':
                this.clickOnHobbieCheckBox(hobbiesArray)
                cy.log('Check Reading hobbie');
                break;
            case 'Sports':
                this.clickOnHobbieCheckBox(hobbiesArray)
                cy.log('Check Sports hobbie');
                break;
            case 'Sports, Reading, Music':
                this.clickOnHobbieCheckBox(hobbiesArray)
                cy.log('Check All hobbies');
                break;
            case 'Music, Reading':
                this.clickOnHobbieCheckBox(hobbiesArray)
                cy.log('Check music and reading hobbies');
                break;
            case 'Sports, Music':
                this.clickOnHobbieCheckBox(hobbiesArray)
                cy.log('Check sports and music hobbies');
                break;
            case 'Sports, Reading':
                this.clickOnHobbieCheckBox(hobbiesArray)
                cy.log('Check sports and reading hobbies');
                break;
        }
    }

    typeAddress(data) {
        switch (data) {
            case 'filled':
                let address = fakeAddress()
                cy.get(formsPageLocators.addressInput).should('exist').type(address)
                cy.log(`Typed: ${address}`)
                break;
            case 'empty':
                cy.log('Do nothing')
        }
    }

    uploadPicture(data) {

    }

    selectState(data) {
        cy.get(formsPageLocators.stateDropDown).should('be.visible').click()
        cy.log('Click State DropDown');
        cy.get(formsPageLocators.stateOptions).contains(data).should('be.visible').click()
        cy.log(`Select ${data} option`)
        cy.get('[class$="singleValue"]').should('have.text', data)
    }

    typeState(data) {
        switch (data) {
            case 'Uttar Pradesh':
                this.selectState(data)
                break;
            case 'Haryana':
                this.selectState(data)
                break;
            case 'Rajasthan':
                this.selectState(data)
                break;
            case 'NCR':
                this.selectState(data)
                break;
        }
    }

    typeCity(data) {
        switch (data) {
            case 'filled':
                cy.contains('Select City').should('exist').click({ force: true })
                cy.get(formsPageLocators.stateOptions).should('be.visible').then(values => {
                    let randomValueIndex = fakeNumber(0, values.length - 1)
                    cy.wrap(values).eq(randomValueIndex).click()
                })
                break;
            case 'empty':
                cy.log('Do nothing')
        }
    }

    clickSubmit() {
        cy.get(formsPageLocators.submitBtn).should('be.visible').click()
        cy.log('Click submit btn')
    }

    checkSubmitForm(gender, mobile, state) {
        cy.get('[role="document"]').children().find('[class="modal-content"]').should('be.visible')
        cy.get('tbody > :nth-child(1) > :nth-child(2)').should('not.be.empty')
        cy.get('tbody > :nth-child(3) > :nth-child(2)').should('have.text', gender)
        cy.get('tbody > :nth-child(4) > :nth-child(2)').should('have.text', mobile)
        cy.get('tbody > :nth-child(5) > :nth-child(2)').should('have.text', state)
    }
}