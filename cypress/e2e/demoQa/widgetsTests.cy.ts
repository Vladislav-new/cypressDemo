import { blockRequests } from "../../helpers/blockList";
import { getRandomMultipleOfTen } from "../../helpers/common";
import { fakeNumber, generateRandomDate, getCurrentTime } from "../../helpers/fakers";
import { MainPage } from "../../pageObjects/mainPage/mainPage";
import { AutoCompletePage } from "../../pageObjects/widgetsPage/autoCompletePage";
import { DatePickerPage } from "../../pageObjects/widgetsPage/datePickerPage";
import widgetsPagesLocators from "../../pageObjects/widgetsPage/locators/widgetsPagesLocators";
import { ProgressBarPage } from "../../pageObjects/widgetsPage/progressBarPage";
import { SelectMenuPage } from "../../pageObjects/widgetsPage/selectMenuPage";
import { SliderPage } from "../../pageObjects/widgetsPage/sliderPage";
import { ToolTipPage } from "../../pageObjects/widgetsPage/toolTipPage";


const mainPage = new MainPage();
const autoCompletePage = new AutoCompletePage();
const datePickerPage = new DatePickerPage();
const sliderPage = new SliderPage();
const progressBarPage = new ProgressBarPage();
const tooltipPage = new ToolTipPage();
const selectPage = new SelectMenuPage();


context('Actions with widgets', () => {
    beforeEach(() => {
        blockRequests()
        cy.visit('/widgets', { failOnStatusCode: false })
        cy.log(`Test started: ${Cypress.currentTest.title}`)
    })

    afterEach(() => {
        cy.log(`Test ${Cypress.currentTest.title} completed`)
    })
    it('Accordian', () => {
        mainPage.openOption('Accordian')
        cy.url().should('match', /accordian/)
        cy.get('.accordion').eq(1).children().each((accordion) => {
            const currentAccordion = cy.wrap(accordion)
            currentAccordion.click()
            currentAccordion.children().should('have.class', 'collapse show')
        })
    })

    it('Autocomplete', () => {
        const colorMap: { [key: string]: string } = {
            red: 're',
            blue: 'bl',
            green: 'gr',
            yellow: 'ye',
            purple: 'pu',
            black: 'bla',
            white: 'whi'
        }
        mainPage.openOption('Auto Complete')
        cy.url().should('match', /auto-complete/)
        //ввод значений мапы в текстовую форму и проверка
        Object.entries(colorMap).forEach(([color, value]) => {
            autoCompletePage.typeMultipleColors(value)
            autoCompletePage.checkColorsInMultipleForm(color)
        })
        //генерим случайный цвет для ввода, и по его значению берем имя ключа для сравнения с результатом
        const randomColor = colorMap[Object.keys(colorMap)[Math.floor(Math.random() * Object.keys(colorMap).length)]]
        const randomKey = Object.keys(colorMap).find((key) => colorMap[key] === randomColor)

        //ввод случайного значения мапы с ключом во второе поле и проверка
        autoCompletePage.typeSingleColor(randomColor)
        autoCompletePage.checkSingleColor(randomKey)
    })

    context('DatePicker', () => {
        let date = generateRandomDate()
        beforeEach(() => {
            mainPage.openOption('Date Picker')
            cy.url().should('match', /date-picker/)
        })
        it('Date Picker - calendar', () => {
            datePickerPage.selectRandomDateFromCalendar()
        })

        it('Date Picker - input date in calendar', () => {
            datePickerPage.inputDate(date)
            datePickerPage.checkDateInInput(`${date}`)
        })

        it('Date picker - calendar with time', () => {
            datePickerPage.selectRandomDateTimeFromCalendar()
        })
        it('Date picker - input date with time', () => {
            let currentTime = getCurrentTime()
            datePickerPage.inputDateTime(`${date} ${currentTime}`) //YYYY-MM-DD HH:mm
            datePickerPage.checkDateTimeInput(date, currentTime)
        })
    })

    it('Slider set value', () => {
        mainPage.openOption('Slider')
        cy.url().should('match', /slider/)
        const randomValue = fakeNumber(0, 100)
        sliderPage.setSliderValue(randomValue)
        sliderPage.checkSliderValue(randomValue)
    })

    it('Progress bar', () => {
        //запускаем прогресс бар на случайное число секунд от 1 до 10,
        //затем останавливаем и проверяем ширину элемента
        mainPage.openOption('Progress Bar')
        cy.url().should('match', /progress-bar/)
        const percent = getRandomMultipleOfTen()
        progressBarPage.clickAndStopOnPercent(percent)
        progressBarPage.checkPercentage(percent)
    })

    it('Tabs', () => {
        //прокликиваем все активные табы и проверяем атрибут aria-selected true у отмеченного таба
        //не активные табы не кликаем а смотрим, что они просто есть
        //тут решил не создавать отдельный класс и метод, тест слишком короткий
        mainPage.openOption('Tabs')
        cy.url().should('match', /tabs/)
        cy.get(widgetsPagesLocators.tabsList).children().each(($el) => {
            if (!$el.attr('aria-disabled') || $el.attr('aria-disabled') !== 'true') {
                cy.wrap($el).click()
                cy.wrap($el).should('have.attr', 'aria-selected', 'true')
            } else {
                cy.wrap($el).should('be.visible').and('have.attr', 'aria-disabled', 'true')
            }
        })
    })

    context('ToolTips check', () => {
        const tooltipTests = [
            { hoverElement: widgetsPagesLocators.toolTipBtn, expectedTooltipText: 'You hovered over the Button' },
            { hoverElement: widgetsPagesLocators.toolTipTextField, expectedTooltipText: 'You hovered over the text field' },
            { hoverElement: widgetsPagesLocators.contraryLinkHower, expectedTooltipText: 'You hovered over the Contrary' },
            { hoverElement: widgetsPagesLocators.addressLinkHower, expectedTooltipText: 'You hovered over the 1.10.32' },
        ]
        //можно еще session добавить чтоб постоянно на страницу не ходить а продолжать тест на той же
        tooltipTests.forEach((test) => {
            it(`${test.expectedTooltipText}`, () => {
                mainPage.openOption('Tool Tips')
                cy.url().should('match', /tool-tips/)
                tooltipPage.hoverAndVerifyTooltip(test.hoverElement, test.expectedTooltipText)
            })
        })
    })

    it('Menu', () => {
        mainPage.openOption('Menu')
        cy.url().should('match', /menu/)
        cy.get(widgetsPagesLocators.listsInMenu).each(item => {
            cy.wrap(item).realHover()
        })
    })

    context('Select menu actions', () => {
        beforeEach(() => {
            mainPage.openOption('Select Menu')
            cy.url().should('match', /select-menu/)
        })
        it('Select value', () => {
            selectPage.clickOn(widgetsPagesLocators.dropDownOptionsWithGroup)
            selectPage.selectRandomOptionFromDropDown(widgetsPagesLocators.dropDownMenu, widgetsPagesLocators.option)
        })

        it('Select one', () => {
            selectPage.clickOn(widgetsPagesLocators.dropDownOptionsOne)
            selectPage.selectRandomOptionFromDropDown(widgetsPagesLocators.dropDownMenu, widgetsPagesLocators.option)
        })

        it('Drop down select', () => {
            selectPage.selectorValueChoose(widgetsPagesLocators.selectOldStyle)
        })

        it('Drop down multi-select', () => {
            cy.contains('Multiselect').parent().siblings('div').realClick()
            selectPage.multiselect(3, widgetsPagesLocators.dropDownMenu, widgetsPagesLocators.option)
        })

        it('List multi-select', () => {
            //выполним селект двух элементов из списка                      
            cy.get('#cars option').then(options => {
                //@ts-ignore
                const optionValues = [...options].map(option => option.text)
                const randomOptions = Cypress._.sampleSize(optionValues, 2)
                cy.get('#cars').select(randomOptions)
                cy.get('#cars option:selected').then(selectedOptions => {
                    //@ts-ignore
                  const selectedValues = [...selectedOptions].map(option => option.text)
                  cy.wrap(selectedValues).should('deep.include.members', randomOptions)
                })
              })              
        })
    })

})