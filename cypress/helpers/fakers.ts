import { faker } from '@faker-js/faker/locale/ru';
import { fakerRU } from '@faker-js/faker';

// сюда накидывать методы для генерации данных (пользаки, проекты, названия, улицы, телефоны и тп)
// можно комбинировать
export function fakeEmail(prefix: string) {
    let fakeEmail = faker.internet.email({
        firstName: prefix+'.a.AT_'+ faker.lorem.word({length:{min:3,max:7}})+faker.number.int({min:1,max:999}),
        provider: 'yandex.pro'
    })
    return fakeEmail
}
export function invalidEmail() {
    let invalidEmail = faker.internet.email({ firstName: ' a autotest', provider: '@yandex.pro' })
    return invalidEmail
}
export function randomTwoWords(){
  let randomWords = fakerRU.lorem.words(2)
  return randomWords
}
export function fakeAddress() {
    let fakeAddress = `${fakerRU.location.zipCode()}, ${fakerRU.location.city()}, ${fakerRU.location.street()}, ${fakerRU.location.buildingNumber()}`
    return fakeAddress
}
export function fakeObjectName() {
    let fakeObjectName = `AT ${fakerRU.lorem.words(2)}`;
    let truncatedObjectName = fakeObjectName.substring(0, 30);
    return truncatedObjectName
}
export function fakeNameForEngineering() {
    let fakeObjectName = `AT ${faker.number.int({ min: 0, max: 99 })} ${fakerRU.lorem.words(1)}` //30 символов лимит
    let truncatedProjectName = fakeObjectName.substring(0, 23);
    return truncatedProjectName
}
export function fakeFullName() {
    let fakeProjectFullName = fakerRU.person.fullName()
    return fakeProjectFullName
}
export function fakeFirstName() {
    let fakeProjectFullName = fakerRU.person.firstName()
    return fakeProjectFullName
}
export function fakeLastName() {
    let fakeProjectFullName = fakerRU.person.lastName()
    return fakeProjectFullName
}
export function fakeString(max) {
    let fakerString = fakerRU.lorem.words(100).substring(0, max)
    return fakerString
}
export function fakeNumber(min, max) {
    let fakeNumber = faker.number.int({ min, max })
    return fakeNumber
}

export function fakeDepartment() {
    let fakeNumber = fakerRU.company.buzzPhrase()
    let truncatedDepartnemtName = fakeNumber.substring(0, 24);
    return truncatedDepartnemtName
}

export function fakeNumeric(max) {
  let fakeNumber = faker.string.numeric({ length: max, allowLeadingZeros: false })
  return fakeNumber
}
export function fakeSymbol(min, max) {
    const fakeSymbol = faker.string.symbol({ min, max });
    return fakeSymbol
}
