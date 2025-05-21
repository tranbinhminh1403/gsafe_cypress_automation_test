import {
  randomPhone,
  randomTaxCode,
  getToday,
  getRandomIndex,
  getLocation,
} from "../../utils";

Cypress.on("uncaught:exception", (err, runnable) => {
  // Only ignore the React #418 error
  if (err.message.includes("Minified React error #418")) {
    return false; // prevent test failure
  }

  // Let all other errors fail the test
  return true;
});

const numberOfBranch = 2;

const paymentMethod = ["Thanh toán trả trước", "Thanh toán trả sau"];

const { formattedToday } = getToday();

describe("Complete form", () => {
  it("should complete form", () => {
    cy.visit("http://210.211.97.224:3032");
    cy.wait(1000);

    cy.contains("button", "Mua ngay").click();

    //step 1
    cy.get("input#account_name").type("Công ty ABC");
    cy.get("input#tax_code").type(randomTaxCode());
    cy.get("input#account_address").type("2B Th. City");
    cy.get("input#legal_rep").type("laplace");
    cy.get("input#account_email").type("laplace@gmail.com");
    cy.get("input#account_phone").type(randomPhone());
    cy.get("input#industry_name").type("transporter");
    cy.contains("button", "Tiếp tục").click();

    cy.contains("p", "Cơ sở 1").should("be.visible");

    //step 2: accept multiple branch
    [...Array(numberOfBranch).keys()].forEach((i) => {
      const { province, district, ward } = getLocation();
      // locale
      cy.get(`input#saved_order_details_${i}_locale_name`).type("branch " + i);
      // phone number
      cy.get(`input#saved_order_details_${i}_locale_phone`).type(randomPhone());
      // date
      cy.get(`input#saved_order_details_${i}_date`).click();
      cy.get(".ant-picker-dropdown")
        .last()
        .within(() => {
          cy.contains("a", "Today").click({ force: true });
        });
      // cy.get("input#saved_order_details_" + i + "_date").should(
      //   "have.value",
      //   formattedToday
      // );

      // province
      cy.get(`input#saved_order_details_${i}_province`).type(province.name, {
        multiple: true,
      });
      cy.get(`div[title='${province.name}']`).click();
      // district
      cy.get(`input#saved_order_details_${i}_district`).click();
      cy.get(`div[title='${district.name}']`).click({ multiple: true });
      // ward
      cy.get(`input#saved_order_details_${i}_ward`).click();
      cy.get(`div[title='${ward.name}']`).click({ multiple: true });
      // street
      cy.get(`input#saved_order_details_${i}_street`).type("Đường số " + i);
      // installation address
      cy.get(`input#saved_order_details_${i}_installation_address`).type(
        "Số nhà " + i
      );
      // quantity
      cy.get(`input#saved_order_details_${i}_quantity`).type(1);
      // continue or add branch
      if (i === numberOfBranch - 1) {
        cy.contains("button", "Tiếp tục").click();
      } else {
        cy.contains("button", "Thêm cơ sở").click();
        cy.contains("p", "Cơ sở " + (i + 2)).should("be.visible");
      }
    });

    //step 3
    cy.get("p")
      .filter(":contains('Cơ sở')")
      .should("have.length", numberOfBranch);

    [...Array(numberOfBranch).keys()].forEach((i) => {
      cy.contains("p", "Cơ sở " + (i + 1))
        .siblings("div")
        .find(`div#saved_order_details_${i}_service_package`)
        .find("div")
        .then((options) => {
          const index = getRandomIndex(options.length);
          cy.wrap(options[index]).click();
        });
      cy.get(`div#saved_order_details_${i}_period`).should("be.visible");
      cy.get(`div#saved_order_details_${i}_period`)
        .find("label")
        .then((options) => {
          const index = getRandomIndex(options.length);
          cy.wrap(options[index]).click();
        });
    });
    cy.contains("button", "Tiếp tục").click();

    //step 4
    [...Array(numberOfBranch).keys()].forEach((i) => {
      [...Array(2).keys()].forEach((j) => {
        cy.get(
          `input#saved_order_details_${i}_service_phones_${j}_fullname`
        ).type(`user ${i} ${j}`);
        cy.get(`input#saved_order_details_${i}_service_phones_${j}_phone`).type(
          randomPhone()
        );
      });
    });
    cy.contains("button", "Tiếp tục").click();

    //step 5
    cy.contains(
      "span",
      paymentMethod[getRandomIndex(paymentMethod.length)]
    ).click();
    cy.contains("span", "Tôi đã đọc và đồng ý với").click();
  });
});
