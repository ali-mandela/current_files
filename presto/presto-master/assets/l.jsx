// /* eslint-disable no-undef */
// describe('Admin Happy Path UI Tests of Pestro', () => {
//   before(() => {     
//     cy.visit('http://localhost:3000/register');
//   });

//   it('Registers successfully', () => {
//     cy.get('input[name="name"]').type('2p');
//     cy.get('input[name="email"]').type('ar0123123@1pko.com');
//     cy.get('input[name="password"]').type('password123');
//     cy.get('input[name="confirm password"]').type('password123');
//     cy.get('button[type="submit"]').click();
//     cy.wait(1000);  
//     cy.url().should('include', '/dashboard'); 
//     cy.get('button').contains('New Presentation').click(); 
//     cy.get('input[name="name"]').type('My New Presentation'); 
//     cy.get('input[name="description"]').type('This is a description of my new presentation.');  
//     cy.get('input[name="thumbnail"]').type('https://example.com/image.png');
//     cy.get('button').contains('Create').click();  
//     cy.get('h3').contains('My New Presentation').click();
//     cy.get('h1').contains('Action tabs');
//   });
// }); 

/* eslint-disable no-undef */