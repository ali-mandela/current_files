/* eslint-disable no-undef */
describe('Happy path from login to logout spec', () => {
  before(() => {     
    cy.visit('http://localhost:3000/login');
  });
  it('Logs in after first logout', () => {
    // cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type('muhammadali.nitrkl@gmail.com');
    cy.get('input[name="password"]').type('1111');
    cy.get('button[type="submit"]').click();
    cy.wait(2000);
    cy.get('[data-cy="l-out"]').click(); 
  });
})


