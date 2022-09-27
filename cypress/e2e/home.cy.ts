it("should load the page", () => {
  cy.visit("/");
  cy.findAllByText(/You are not logged in!/i).should("have.length", 1);
});
