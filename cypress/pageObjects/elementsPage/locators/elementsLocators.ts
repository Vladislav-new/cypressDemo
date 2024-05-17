export default {
   //elements list
   columnNames:'[class="element-group"]:has(span:contains("Elements")) ul>li>span',   
   optionsColumns:'[id^="item"]',
   //text box
   fullNameTextFieldInput:'[id="userName"]',
   emailTextFieldInput:'[id="userEmail"]',
   currentAddressTextFieldInput:'[id="currentAddress"]',
   permAddressTextFieldInput:'[id="permanentAddress"]',
   submitButton:'[id="submit"]',
   resultNameField:'[id="name"]',
   resultEmailField:'[id="email"]',
   resultCurrentAddressField:'p[id="currentAddress"]',
   resultPermAddressField:'p[id="permanentAddress"]',
   //check box
   checkBoxTitles:'span[class="rct-title"]',
   checkBoxMaxDepthInTree: 'li:not(:has(ol)) [class="rct-checkbox"]',
   checkBoxResultsView: '[class="text-success"]',
   parentCheckBoxesChecked:'ol [class~="rct-icon-half-check"]',
   //radio button
   yesButton: '[id="yesRadio"]',
   impressiveButton: '[id="impressiveRadio"]',
   noButton: '[id="noRadio"]',
   //webtable
   addNewRowBtn:'[id="addNewRecordButton"]',
   firstNameTableFieldInput:'[id="firstName"]',
   lastNameTableFieldInput:'[id="lastName"]',
   emailTableFieldInput:'[id="userEmail"]',
   ageTableFieldInput:'[id="age"]',
   salaryTableFieldInput:'[id="salary"]',
   departmentTableFieldInput:'[id="department"]',
   deleteRecordTableBtn: '[id^="delete-record"]',   
   filledTableRows:'[class="rt-tr-group"]:has( div>[class="rt-td"]:not(:has(*)))',
   emptyTableRows: '[class="rt-tr-group"]:has(div[role="gridcell"]>span)',
   editTableRowBtn:'[id^="edit-record"]',
   searchBoxInput: '[id="searchBox"]',
   //butons
   dblClickBtn: '[id="doubleClickBtn"]',
   rigthClickBtn: '[id="rightClickBtn"]',
   clickMessage: '[id$="Message"]',
   //links
   homeLink: '[id="simpleLink"]',
   createdRequest: '[id="created"]',
   noContentRequest: '[id="no-content"]',
   movedRequest: '[id="moved"]',
   badRequest: '[id="bad-request"]',
   unauthorizedRequest: '[id="unauthorized"]',
   forbiddenRequest: '[id="forbidden"]',
   invalidUrlRequest: '[id="invalid-url"]',
   //download&upload
   downloadBtn: '[id="downloadButton"]',
   uploadBtn: '[id="uploadFile"]',
   //dynamicProps
   enabledAfter: '[id="enableAfter"]',
   changeColor: '[id="colorChange"]',
   visibleAfter: '[id="visibleAfter"]',
}