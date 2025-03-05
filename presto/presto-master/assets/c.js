/* eslint-disable no-undef */

describe('Admin Happy Path UI Tests of Pestro', () => {
    before(() => {     
      cy.visit('http://localhost:3000/register');
    });
  
    it('Registers successfully and creates a new presentation', () => {
      // Registration steps
      cy.get('input[name="name"]').type('2p');
      cy.get('input[name="email"]').type('ar012hgv425@pko.com'); // Use a valid email format
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="confirm password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.wait(1000);  
      cy.url().should('include', '/dashboard');
  
      // Create a new presentation
      cy.get('button').contains('New Presentation').click(); 
      cy.get('input[name="name"]').type('My New Presentation'); 
      cy.get('input[name="description"]').type('This is a description of my new presentation.');  
      cy.get('input[name="thumbnail"]').type('https://example.com/image.png');
      cy.get('button').contains('Create').click();  
  
      // Verify the new presentation creation
      cy.get('h3').contains('My New Presentation').click();
      cy.get('h1').contains('Action tabs');
  
      // Edit presentation title and description
      cy.get('button[aria-label="edit-title"]').click(); // Use actual button attributes if available
      cy.get('input[name="name"]').clear().type('Updated Presentation Name');
      cy.get('input[name="description"]').clear().type('Updated description for the presentation.');
      cy.get('button').contains('Save changes').click();
  
      // Edit presentation thumbnail
      cy.get('button[aria-label="edit-thumbnail"]').click(); // Use actual button attributes if available
      cy.get('input[name="thumbnail"]').clear().type('https://example.com/new-image.png');
      cy.get('button').contains('Save changes').click();
  
      // Confirm changes
      cy.get('h3').contains('Updated Presentation Name').should('exist');
    });
  });
  