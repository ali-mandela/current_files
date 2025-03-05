// /* eslint-disable no-undef */
// describe('Admin Happy Path UI Tests of Pestro', () => {
//   before(() => {     
//     cy.visit('http://localhost:3000/register');
//   });

//   it('Registers successfully, creates, and edits a new presentation, then logs out', () => {
//     // Register a new user
//     cy.get('input[name="name"]').type('Muhammad Ali');
//     cy.get('input[name="email"]').type('user1258469@gmail.com');
//     cy.get('input[name="password"]').type('password123');
//     cy.get('input[name="confirm password"]').type('password123');
//     cy.get('button[type="submit"]').click();
//     // cy.wait(2000);  
    
//     // Create a new presentation
//     cy.get('[data-cy="new-presentation"]').click();
//     cy.get('input[name="name"]').type('My New Presentation');
//     cy.get('input[name="description"]').type('This is a description of my new presentation.');
//     cy.get('input[name="thumbnail"]').type('https://example.com/image.png');
//     cy.get('[data-cy="c-new-p"]').click();   

//     // Verify and edit presentation
//     cy.get('h3').contains('My New Presentation').click();
//     cy.get('[data-cy="edit-title-icon"]').click();
//     cy.get('input[name="name"]').clear().type('Updated Presentation Name');
//     cy.get('input[name="description"]').clear().type('Updated description for the presentation.');
//     cy.get('button').contains('Save changes').click();

//     cy.get('[data-cy="edit-thumbnail-icon"]').click(); 
//     cy.get('input[name="thumbnail"]').clear().type('https://example.com/new-image.png');
//     cy.get('[data-cy="u-t"]').click();

//     // Add Slides and additional steps
//     cy.get('[data-cy="add-s-o"]').click();
//     cy.wait(500);
//     cy.get('[data-cy="add-s-o"]').click();
//     cy.wait(500);
//     cy.get('[data-cy="add-s-o"]').click(); 
//     cy.wait(500);
//     cy.get('[data-cy="add-s-o"]').click(); 
//     cy.wait(1000);
//     cy.get('[data-cy="add-n-s"]').click().click().click();

//     // Delete and Confirm Delete, then log out
//     cy.wait(1000);
//     cy.get('[data-cy="d-s"]').click();
//     cy.wait(500);
//     cy.get('[data-cy="d-c"]').click();
//     cy.wait(500);
//     cy.get('[data-cy="l-out"]').click(); 
//   });

//   it('Logs in after first logout', () => {
//     cy.visit('http://localhost:3000/login');
//     cy.get('input[name="email"]').type('user1258469@gmail.com');
//     cy.get('input[name="password"]').type('password123');
//     cy.get('button[type="submit"]').click();
//     cy.wait(2000);   
//     cy.get('[data-cy="l-out"]').should('exist'); 
//     cy.get('[data-cy="l-out"]').click();
//   });
// });


/* eslint-disable no-undef */
describe('Admin Happy Path UI Tests of Presto', () => {
  
  before(() => {     
    cy.visit('http://localhost:3000/register');
  });

  it('Registers successfully, creates, and edits a new presentation, then logs out', () => {
    // Register a new user
    cy.get('input[name="name"]').type('Muhammad Ali');
    cy.get('input[name="email"]').type('user1258469@gmail.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirm password"]').type('password123');
    cy.get('button[type="submit"]').click();
     
    cy.get('[data-cy="new-presentation"]').click();
    cy.get('input[name="name"]').type('My New Presentation');
    cy.get('input[name="description"]').type('This is a description of my new presentation.');
    cy.get('input[name="thumbnail"]').type('https://example.com/image.png');
    cy.get('[data-cy="c-new-p"]').click();   
 
    cy.get('h3').contains('My New Presentation').click();
    cy.get('[data-cy="edit-title-icon"]').click();
    cy.get('input[name="name"]').clear().type('Updated Presentation Name');
    cy.get('input[name="description"]').clear().type('Updated description for the presentation.');
    cy.get('button').contains('Save changes').click();

    cy.get('[data-cy="edit-thumbnail-icon"]').click(); 
    cy.get('input[name="thumbnail"]').clear().type('https://example.com/new-image.png');
    cy.get('[data-cy="u-t"]').click();
  
    cy.get('[data-cy="add-s-o"]').click();
    cy.get('[data-cy="add-s-o"]').click();
    cy.get('[data-cy="add-s-o"]').click();
    cy.get('[data-cy="add-s-o"]').click();
 
    cy.get('[data-cy="add-n-s"]').click().click().click();
 
    cy.get('[data-cy="d-s"]').click();
    cy.get('[data-cy="d-c"]').click();
    cy.get('[data-cy="l-out"]').click(); 
  });
       
 

});
