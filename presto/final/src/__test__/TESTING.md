<!-- ** note make some changes in the contents before submitting . -->
<!-- Component -->
Component Testing Approach
For component testing, I focused on ensuring that each component behaves correctly under various conditions. My approach involved the following key strategies:
a) Component Selection:
I selected a diverse set of components to test, ensuring they are not overly similar to comply with the assignment requirements. I included components such as Navbar, Footer, and Modal, each with distinct functionalities and use cases.
b) Test Coverage:
Each component test was designed to cover various scenarios, including:
Rendering states (e.g., authenticated vs. unauthenticated for the Navbar).
Interaction handling (e.g., click events for buttons).
Edge cases (e.g., empty states or error responses).
c) Test Clarity and Structure:
Tests were organized logically, with clear naming conventions that indicate the purpose of each test case. Each test function includes comments that describe the scenario being tested, making it easier to understand the testing rationale at a glance.
Use of Mocking:

I utilized mocking (e.g., using jest.mock() for API calls) to isolate component behavior from external dependencies. This ensures tests focus on the component’s internal logic and UI rendering.
Example:
For the Footer component, a simple test checks if the footer renders correctly with the expected text. This verifies that the component can display static content accurately.

<!-- UI -->
Admin Happy Path UI Tests

This section outlines a set of end-to-end UI tests that simulate the most common actions an admin might perform on our platform. The tests are divided into two sequences, covering separate areas of functionality:

1. Register, Create, Edit, and Logout Flow
Objective: This test sequence covers essential operations for a new user: registration, presentation creation, editing, and logout.
Steps:
Register a New User: Ensures the registration process works correctly by filling in required details like name, email, and password, then submitting.
Create a New Presentation: After logging in, the user creates a presentation with a title, description, and thumbnail.
Edit Presentation Details: The user modifies the presentation’s title, description, and thumbnail to validate editing functions.
Logout: Concludes the session by verifying the logout process.
Rationale: This test ensures that a new user can register, create, and update content, confirming these actions work smoothly.
2. Login After Logout Flow
Objective: Tests the login functionality after the first logout to confirm user session handling.
Steps:
Login: After logging out, the user logs back in with their previously registered email and password.
Verify Access to Dashboard and Logout Again: Checks that the user can access the dashboard and logout again, validating session continuity.
Rationale: This second flow ensures that login functions correctly after an initial logout, validating that user sessions are handled appropriately.