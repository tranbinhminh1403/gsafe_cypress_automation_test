const url = Cypress.env("WEB_URL");

describe("should open pdf file in new tab", () => {
  it("should open pdf file in new tab", () => {
    cy.visit(url);
    cy.wait(1000);
    cy.contains("a", "Thư ngỏ").should("have.attr", "target", "noreferrer");
    cy.contains("a", "Thư ngỏ").should("have.attr", "href", "/pdf/letter.pdf");
  });
});
