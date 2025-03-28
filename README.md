
# User Management System

A React application that integrates with the Reqres API to perform basic user management functions including authentication, listing users, and managing user data (create, update, delete).

## Features

- **Authentication**: Login screen with credential validation
- **User Management**: 
  - View paginated list of users
  - Create new users
  - Update existing user details
  - Delete users
- **Responsive Design**: Works well on both desktop and mobile devices
- **Form Validation**: Client-side validation for all forms
- **Error Handling**: Graceful handling of API errors with appropriate user feedback

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Routing**: React Router
- **HTTP Client**: Axios
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Data Fetching**: TanStack Query (React Query)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```sh
   git clone <repository-url>
   cd user-management-system
   ```

2. Install dependencies
   ```sh
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

## Usage

### Authentication

Use the following credentials to log in:
- Email: eve.holt@reqres.in
- Password: cityslicka

### User Management

After logging in, you can:
- View the list of users
- Create new users by clicking the "Create User" button
- Edit user details by clicking the edit icon
- Delete users by clicking the delete icon

## API Integration

This application integrates with the Reqres API (https://reqres.in/), which provides endpoints for:
- Authentication: POST /api/login
- List Users: GET /api/users?page=1
- Create User: POST /api/users
- Update User: PUT /api/users/{id}
- Delete User: DELETE /api/users/{id}

## Considerations and Assumptions

1. **Token Management**: 
   - The application stores the authentication token in local storage
   - No token expiration handling is implemented as the Reqres API doesn't provide expiration details

2. **API Limitations**:
   - The Reqres API is a mock API, so actual data changes (create, update, delete) are not persisted
   - The API returns simulated responses for these operations

3. **Pagination**:
   - The implementation uses client-side pagination based on the API's pagination structure
   - Only a limited number of pages are available through the API

4. **Error Handling**:
   - The application handles common API errors and displays appropriate messages
   - Network errors and unexpected responses are caught and displayed to the user

## Future Improvements

- Add unit and integration tests
- Implement more advanced filtering and sorting options
- Add user profile management
- Enhance the UI with animations and transitions
- Implement more comprehensive error handling and logging
