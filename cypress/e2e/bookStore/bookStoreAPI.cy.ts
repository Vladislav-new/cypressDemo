import { fakeEmail } from "../../helpers/fakers";
import { BookStoreAPI } from "../../pageObjects/bookStoreAppPage/bookStoreAPI"

const bookStoreAPI = new BookStoreAPI();
const jp = require('jsonpath');

beforeEach(() => {
    cy.log(`Test started: ${Cypress.currentTest.title}`)
})

afterEach(() => {
    cy.log(`Test ${Cypress.currentTest.title} completed`)
})

const password = 'QwErTy!156';
const booksList = ['9781449325862', '9781449331818', '9781449337711', '9781449365035', '9781491904244', '9781593277574'];

context('account CRUD', () => {
    const userName = fakeEmail('accountCRUD');
    beforeEach(() => {
        bookStoreAPI.prepareUserWithBooks(userName, password, booksList)
    })
    afterEach(() => {
        bookStoreAPI.generateToken(userName, password).then(response => {
            const newToken = response.body.token;
            bookStoreAPI.deleteUser(newToken, userName, password)
        })
    })

    it('authorized', { tags: ['API', 'regression'] }, () => {
        bookStoreAPI.authorizeRequest(userName, password).then(response => {
            expect(response.status).to.eq(200)
        })
    })

    it('genereateToken', { tags: ['API', 'regression'] }, () => {
        bookStoreAPI.generateToken(userName, password).then(resp => {
            expect(resp.body.token).to.be.not.null
        })
    })

    it('User create', { tags: ['API', 'regression'] }, () => {
        const newUser = fakeEmail('api');
        bookStoreAPI.createNewUser(newUser, password).then(resp => {
            expect(resp.body.username).to.eq(newUser)
        })
    })

    it('User delete', { tags: ['API', 'regression'] }, () => {
        const NewUserName = fakeEmail('delete');
        bookStoreAPI.prepareUserWithBooks(NewUserName, password, booksList)
        bookStoreAPI.generateToken(NewUserName, password).then(respToken => {
            const token = respToken.body.token;
            bookStoreAPI.deleteUser(token, NewUserName, password)
        })
    })

    it('get user data', { tags: ['API', 'regression'] }, () => {
        bookStoreAPI.generateToken(userName, password).then(respToken => {
            const token = respToken.body.token;
            bookStoreAPI.getUserData(token, userName, password).then(userDataResp => {
                const userID = userDataResp.body.userId;
                const usernemaFromResp = userDataResp.body.username;
                expect(usernemaFromResp).to.eq(userName)
                expect(userID).to.not.be.null
                bookStoreAPI.getUserDataById(token, userID).then(userDataByIdResp => {
                    //это все можно спрятать в методы, но оставил, чтоб нагляднее было
                    expect(userDataByIdResp.body.username).to.eq(userName)
                    expect(userDataByIdResp.body.userId).to.eq(userID)
                    const body = JSON.stringify(userDataByIdResp)
                    const json = JSON.parse(body)
                    const booksArray: Array<string> = jp.query(json, '$..books..isbn')
                    booksArray.forEach((book, index) => {
                        expect(book).to.equal(booksList[index])
                    })
                })
            })
        })
    })
})

context('books CRUD', () => {
    const userName = fakeEmail('booksCRUD');
    beforeEach(() => {
        bookStoreAPI.prepareUserWithBooks(userName, password, booksList)
    })

    afterEach(() => {
        bookStoreAPI.generateToken(userName, password).then(response => {
            const newToken = response.body.token;
            bookStoreAPI.deleteUser(newToken, userName, password)
        })
    })

    it('get all books and schema assert', { tags: ['API', 'regression'] }, () => {
        cy.fixture('booksSchema').then((bookSchema) => {
            bookStoreAPI.getBookList().then(bookList => {
                cy.validateSchema(bookList, bookSchema).then(() => {
                    cy.log('JSON is valid')
                })
            })
        })
    })

    it('add books to user and schema assert', { tags: ['API', 'regression'] }, () => {
        cy.fixture('addNewBookToUserSchema').then((addNewBookSchema) => {
            const bookId = '9781593275846';
            bookStoreAPI.generateToken(userName, password).then(tokenResponse => {
                const token = tokenResponse.body.token;
                bookStoreAPI.getUserData(token, userName, password).then(userDataResponse => {
                    const userId = userDataResponse.body.userId;
                    bookStoreAPI.addBooksToUser(token, userId, bookId).then(resp => {
                        cy.validateSchema(resp, addNewBookSchema).then(() => {
                            cy.log('JSON is valid')
                        })
                    })
                })
            })
        })
    })

    it('delete all books from user', { tags: ['API', 'regression'] }, () => {
        bookStoreAPI.generateToken(userName, password).then(tokenResponse => {
            const token = tokenResponse.body.token;
            bookStoreAPI.getUserData(token, userName, password).then(userDataResponse => {
                const userId = userDataResponse.body.userId;
                bookStoreAPI.deleteAllBooksFromUser(token, userId).then(resp => {
                    expect(resp.status).to.eq(204)
                })
                bookStoreAPI.getUserDataById(token, userId).then(userData => {
                    expect(userData.body.books).to.be.empty
                })
            })
        })
    })

    it('get book detail', { tags: ['API', 'regression'] }, () => {
        cy.fixture('bookDetailsSchema').then((bookDetailsSchema) => {
            const bookId = '9781449331818';
            bookStoreAPI.generateToken(userName, password).then(tokenResponse => {
                const token = tokenResponse.body.token;
                bookStoreAPI.getBookDetail(token, bookId).then(resp => {
                    cy.validateSchema(resp, bookDetailsSchema).then(() => {
                        cy.log('JSON is valid')
                    })
                })
            })
        })
    })

    it('delete book', { tags: ['API', 'regression'] }, () => {
        const bookISBN = '9781449331818';
        bookStoreAPI.generateToken(userName, password).then(tokenResponse => {
            const token = tokenResponse.body.token;
            bookStoreAPI.getUserData(token, userName, password).then(userDataResponse => {
                const userId = userDataResponse.body.userId;
                bookStoreAPI.getUserDataById(token, userId).then(userDataBeforeDelete => {
                    const body = JSON.stringify(userDataBeforeDelete)
                    const json = JSON.parse(body)
                    const booksArrayBefore: Array<string> = jp.query(json, '$..books..isbn')
                    bookStoreAPI.deleteBookFromUser(token, userId, bookISBN).then(resp => {
                        expect(resp.status).to.eq(204)
                    })
                    bookStoreAPI.getUserDataById(token, userId).then(userDataAfterDelete => {
                        const body = JSON.stringify(userDataAfterDelete)
                        const json = JSON.parse(body)
                        const booksArrayAfter: Array<string> = jp.query(json, '$..books..isbn')
                        expect(booksArrayAfter).to.not.deep.equals(booksArrayBefore)
                    })
                })
            })
        })
    })

    it('update user`s book list - change', { tags: ['API', 'regression'] }, () => {
        const bookISBN = '9781449331818';
        const newISBN = '9781593275846';
        bookStoreAPI.generateToken(userName, password).then(tokenResponse => {
            const token = tokenResponse.body.token;
            bookStoreAPI.getUserData(token, userName, password).then(userDataResponse => {
                const userId = userDataResponse.body.userId;
                bookStoreAPI.getUserDataById(token, userId).then(userDataBeforeDelete => {
                    const body = JSON.stringify(userDataBeforeDelete)
                    const json = JSON.parse(body)
                    const booksArrayBefore: Array<string> = jp.query(json, '$..books..isbn')
                    bookStoreAPI.updateBookList(token, userId, bookISBN, newISBN).then(resp => {
                        expect(resp.status).to.eq(200)
                    })
                    bookStoreAPI.getUserDataById(token, userId).then(userDataAfterDelete => {
                        const body = JSON.stringify(userDataAfterDelete)
                        const json = JSON.parse(body)
                        const booksArrayAfter: Array<string> = jp.query(json, '$..books..isbn')
                        expect(booksArrayAfter).to.not.deep.equals(booksArrayBefore)
                    })
                })
            })
        })
    })
})