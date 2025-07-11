# Secure Login App

A Next.js application with JWT authentication, featuring secure login, protected routes, and automatic token refresh.

## Features

- **Login Page** (`/login`): Email/password authentication
- **Protected Home Page** (`/home`): Requires JWT authentication
- **Automatic Token Refresh**: Seamlessly refreshes expired access tokens
- **Secure Token Storage**: Uses HTTP-only cookies for token storage
- **Logout Functionality**: Properly clears tokens and calls logout API

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Axios for API calls
- js-cookie for token management

## API Integration

The app integrates with the following APIs:

- **Login**: `POST https://apigateway.seclob.com/v1/user-no/auth/login`
- **Refresh Token**: `POST https://apigateway.seclob.com/v1/user-no/auth/refresh-token`
- **Logout**: `POST https://apigateway.seclob.com/v1/user-no/auth/logout`

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Access the Application**:
   - Open [http://localhost:3000](http://localhost:3000)
   - You'll be redirected to `/login` if not authenticated
   - Use the provided test credentials or your own

## Project Structure

```
src/
├── app/
│   ├── login/page.tsx          # Login page
│   ├── home/page.tsx           # Protected home page
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── page.tsx                # Root page (redirects)
│   └── globals.css             # Global styles
├── components/
│   ├── AuthProvider.tsx        # Authentication context
│   └── ProtectedRoute.tsx      # Route protection component
├── lib/
│   └── auth.ts                 # Auth service and token management
└── types/
    └── auth.ts                 # TypeScript interfaces

```

## Authentication Flow

1. **Login**: User submits credentials → API call → Store tokens → Redirect to `/home`
2. **Protected Routes**: Check for valid tokens → Allow access or redirect to login
3. **Token Refresh**: Automatic refresh on 401 responses using axios interceptors
4. **Logout**: Clear tokens → Call logout API → Redirect to login

## Test Credentials

```json
{
  "email": "mishnanc@gmail.com",
  "password": "qwertyu"
}
```

## Security Features

- Tokens stored in HTTP-only cookies
- Automatic token refresh on expiration
- Protected routes with authentication checks
- Proper logout with token cleanup