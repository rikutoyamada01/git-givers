# Feature: Repository Management

This document outlines the requirements for the repository management feature in GitKarma, which includes registering a user's own repositories and browsing all repositories registered on the platform.

## 1. High-Level Goal

To allow users to register their own GitHub repositories with GitKarma, and to browse all repositories that have been registered on the platform.

## 2. User Stories

- As a user, I want to see a list of my own GitHub repositories so that I can choose which one to register.
- As a user, I want to select a repository from the list and have it saved to my GitKarma profile.
- As a user, I want to view a list of all repositories that have been registered on GitKarma, so that I can see what other projects are available for contribution.
- As a user, after I register a repository, I should receive clear feedback that the action was successful.

## 3. Functional Requirements

### 3.1. Data Layer (Database)

- The `Repository` model in `prisma/schema.prisma` will be updated to include a relationship with the `User` model, indicating who registered the repository.

### 3.2. Backend (API Endpoints)

#### `GET /api/github/repos`
- **Purpose:** Fetches the authenticated user's personal repositories directly from GitHub.
- **Authentication:** Requires a valid user session.
- **Logic:** Uses the user's GitHub `access_token` (stored in their session) to make an authenticated call to the GitHub API.
- **Returns:** A list of the user's repositories that are not forks.

#### `POST /api/repositories`
- **Purpose:** Registers a new repository in the GitKarma database.
- **Authentication:** Requires a valid user session.
- **Request Body:** Contains the details of the repository selected by the user (e.g., `githubId`, `name`, `fullName`, `description`, `url`).
- **Logic:**
  - Checks for duplicate registrations based on `githubId`.
  - Creates a new `Repository` record and links it to the authenticated user.
- **Returns:** The newly created repository object.

#### `GET /api/repositories`
- **Purpose:** Fetches all repositories that have been registered in the GitKarma database for browsing.
- **Authentication:** Requires a valid user session.
- **Logic:** Retrieves a paginated list of all `Repository` records, including information about the owner (user who registered it).
- **Returns:** A paginated list of registered repositories.

### 3.3. Frontend (User Interface)

The user dashboard will be updated with two new distinct views:

1.  **Register Repository View:**
    - A dedicated page where a user can see a list of their own GitHub repositories (fetched from `GET /api/github/repos`).
    - Each repository in the list will have a "Register" button.
    - Clicking the button will send the repository data to `POST /api/repositories`.
    - The UI will provide clear loading states and success/error feedback for the registration process.

2.  **Browse Repositories View:**
    - A dedicated page for discovering all projects registered on GitKarma.
    - It will fetch and display a list of repositories from `GET /api/repositories`.
    - The UI will be designed for browsing and discovery, potentially including search and filter capabilities in the future.

### 4. Authentication

- The NextAuth.js session will be configured to include the user's GitHub `access_token`. This is essential for fetching the user's private repositories during the registration process.
