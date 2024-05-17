import elementsLocators from "./locators/elementsLocators";
import path from "path";

export class UploadDownloadPage {

    clickOnDownLoad() {
        cy.get(elementsLocators.downloadBtn).should('be.visible').click()
        cy.log('Click on download btn')
    }

    uploadFile() {
        cy.get(elementsLocators.uploadBtn).should('be.visible').selectFile('./cypress/helpers/filesToInteract/text2.txt')
        cy.log('Click in Upload btn')
    }

    verifyDownload() {
        const downloadsFolder = Cypress.config("downloadsFolder");
        cy.readFile(path.join(downloadsFolder, "sampleFile.jpeg")).should("exist");
    }
}