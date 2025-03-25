# masterSchool

masterSchool is a Node.js application designed to manage an admissions process through a RESTful API. It allows for creating users, tracking their progress through various admission steps, and determining their acceptance status.

**Features**  
  User Management: Create and manage user profiles with personal details.  
  Admissions Flow Tracking: Monitor user progress through predefined admission steps and tasks.  
  Status Evaluation: Determine the acceptance status of users based on their progress and results.
  
**Prerequisites**  
Before setting up the project, ensure you have the following installed:  
  Node.js (version 14 or later)  
  npm (comes bundled with Node.js)
  
**Installation**  
  Clone the Repository from https://github.com/AhiyaSchneider/masterSchool  
  Navigate to the Project Directory and than Install Dependencies:  npm install

**Running the Application**  
Start the Server:  node index.js  
The server will start and listen for incoming requests. By default, it runs on http://localhost:3000.  
Testing the API using test.js (script provided for testing of the API endpoints) To execute it:  
node test.js  
This script will perform a series of API calls to demonstrate the functionality of the application.  

**Notes**  
  The application uses in-memory storage; data will reset upon server restart.  
  Ensure all required fields are provided in API requests to avoid errors.  
  For detailed information on each endpoint's functionality, refer to the controller and utility files in the repository.
