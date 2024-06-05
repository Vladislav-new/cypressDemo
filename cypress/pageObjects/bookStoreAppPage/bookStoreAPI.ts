
export class BookStoreAPI {

    prepareUserWithBooks(user: string, pass: string, books: Array<string>) {
        this.createNewUser(user, pass).then((createUserResponse) => {
            expect(createUserResponse.status).to.eq(201)
            let userId = createUserResponse.body.userID;
            this.generateToken(user, pass).then((generateTokenResponse) => {
                expect(generateTokenResponse.status).to.eq(200)
                let token = generateTokenResponse.body.token;
                books.forEach((book) => {
                    this.addBooksToUser(token, userId, book)
                })
            })
        })
    }

    authorizeRequest(login: string, pass: string) {
        cy.request({
            method: 'POST',
            url: 'Account/v1/Authorized',
            body: {
                userName: login,
                password: pass
            }
        })
    }

    createNewUser(user: string, pass: string) {
        return cy.request({
            method: 'POST',
            url: '/Account/v1/User',
            body: {
                userName: user,
                password: pass
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            failOnStatusCode: false
        }).then(response => {
            return response;
        })
    }

    getUserData(token: string, user: string, pass: string) {
        return cy.request({
            method: 'POST',
            url: '/Account/v1/Login',
            body: {
                userName: user,
                password: pass
            },
            headers: {
                'Authorization': `Bearer ${token}`
            },
        }).then(response => {
            return response;
        })
    }

    getUserDataById(token: string, userId: string) {
        return cy.request({
            method: 'GET',
            url: `Account/v1/User/${userId}`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            return response;
        })
    }

    getBookList() {
        return cy.request({
            method: 'GET',
            url: 'BookStore/v1/Books'
        }).then(response => {
            return response
        })
    }

    getBookDetail(token: string, bookISBN: string) {
        return cy.request({
            method: 'GET',
            url: `BookStore/v1/Book?ISBN=${bookISBN}`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            return response
        })
    }
    
    updateBookList(token: string, userId: string, bookISBN: string, newISBN:string) {
        return cy.request({
            method: 'PUT',
            url: `BookStore/v1/Books/${bookISBN}`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: {
                userId: userId,
                isbn: newISBN
            }
        }).then(response => {
            return response
        })
    }

    deleteBookFromUser(token: string, userId: string, bookISBN: string) {
        return cy.request({
            method: 'DELETE',
            url: `BookStore/v1/Book`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: {
                isbn: bookISBN,
                userId: userId
            }
        }).then(response => {
            return response
        })
    }

    deleteAllBooksFromUser(token: string, userId: string) {
        return cy.request({
            method: 'DELETE',
            url: `BookStore/v1/Books?UserId=${userId}`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            return response
        })
    }

    deleteUser(token: string, user: string, pass: string) {
        this.getUserData(token, user, pass).then(resp => {
            expect(resp.status).to.eq(200)
            const userId = resp.body.userId;
            const newToken = resp.body.token;
            cy.request({
                method: 'DELETE',
                url: `/Account/v1/User/${userId}`,
                headers: {
                    'Authorization': `Bearer ${newToken}`
                }
            }).then(response => {
                expect(response.status).to.eq(204)
            })
        })
    }

    generateToken(user: string, pass: string) {
        return cy.request({
            method: 'POST',
            url: '/Account/v1/GenerateToken',
            body: {
                userName: user,
                password: pass
            }
        }).then(response => {
            return response;
        })
    }

    addBooksToUser(token, userid: string, bookId: any) {
        return cy.request({
            method: 'POST',
            url: '/BookStore/v1/Books',
            body: {
                userId: userid,
                collectionOfIsbns: [
                    {
                        isbn: bookId
                    }
                ]
            },
            headers: {
                'Authorization': `Bearer ${token}`
            },
            failOnStatusCode: false
        }).then(response => {
            return response;
        })
    }
}