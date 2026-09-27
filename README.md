# Zoho CRM Portal — Next.js Integration

A full-stack **Next.js application** that integrates with **Zoho CRM** and provides a simple portal for managing **Leads, Accounts, and Contacts**.

The application implements Zoho CRM OAuth authentication, reads CRM metadata, retrieves records, creates records, handles duplicate emails, associates Contacts with Accounts, retrieves created records, and provides a responsive UI for viewing and creating CRM records.

---

## How to Run the Project

### 1. Clone the Repository

Clone the project repository and navigate into the project directory:

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies

Install all required npm packages:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory of the project.

Add the required Zoho CRM OAuth configuration:

```env
ZOHO_CLIENT_ID=1000.5XUJTON3KE4BSOJURQ1GUC08AWKQMW
ZOHO_CLIENT_SECRET=3651b5b6c6ccb3516e5975b2b210142d4f1a581b79
ZOHO_REDIRECT_URI=http://localhost:3000/api/auth/callback
ZOHO_ACCOUNTS_URL=https://accounts.zoho.com
ZOHO_API_BASE_URL=https://www.zohoapis.com/crm/v8
```

Use the actual environment variable names configured in the application.

> Do not commit `.env.local`, client secrets, access tokens, or refresh tokens to the repository.

### 4. Start the Development Server

Run the Next.js development server:

```bash
npm run dev
```

### 5. Open the Application

Once the development server is running, open:

```text
http://localhost:3000
```

The application provides separate sections for:

- Leads
- Accounts
- Contacts

### 6. Zoho CRM Authorization

If OAuth authorization is required, complete the Zoho CRM authorization flow using the configured Zoho application.

The configured redirect URI in Zoho must exactly match the redirect URI used by the application.

After successful authorization, the application can use the Zoho CRM APIs to retrieve and create Leads, Accounts, and Contacts.

### 7. Production Build

To create a production build:

```bash
npm run build
```

To start the production application:

```bash
npm start
```

### 8. Vercel Deployment

The application can be deployed to Vercel.

After connecting the repository to Vercel:

1. Configure the required environment variables in the Vercel project settings.
2. Configure the production OAuth redirect URI in the Zoho API Console.
3. Deploy the application.
4. Complete the Zoho OAuth authorization flow using the production URL.
5. Verify Leads, Accounts, and Contacts functionality.

### Quick Start

For local development:

```bash
git clone <repository-url>
cd <project-folder>
npm install
```

Create `.env.local`, configure the Zoho credentials, and then run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 1. Project Overview

### Main Features

- Zoho CRM OAuth 2.0 authentication
- Secure access-token retrieval through a reusable token service
- Leads management
- Accounts management
- Contacts management
- Zoho CRM metadata API integration
- Dynamic identification of Zoho CRM field API names through metadata
- Record listing
- Record detail pages
- Record creation
- Contact → Account lookup association
- Duplicate email detection
- Centralized API error handling
- HTTP status handling
- Toast notifications for user-facing errors
- Next.js App Router API routes
- TypeScript
- Vercel-compatible deployment

---

## 2. Technology Stack

| Technology             | Purpose                    |
| ---------------------- | -------------------------- |
| Next.js                | Full-stack React framework |
| React                  | Frontend UI                |
| TypeScript             | Type-safe development      |
| Axios                  | Zoho CRM API requests      |
| Next.js Route Handlers | Backend API endpoints      |
| Zoho CRM API v8        | CRM integration            |
| Zoho OAuth 2.0         | Authentication             |
| Sonner                 | Toast notifications        |
| Vercel                 | Deployment                 |

---

## 3. Zoho CRM Modules Implemented

The application currently integrates three Zoho CRM modules:

### Leads

Implemented operations:

- List Leads
- View Lead details
- Create Lead
- Search Lead by email
- Prevent duplicate email creation
- Retrieve the newly created Lead

Main fields used:

```text
First_Name
Last_Name
Company
Email
Phone
```

### Accounts

Implemented operations:

- List Accounts
- View Account details
- Create Account
- Retrieve created Account

Main fields used:

```text
Account_Name
Phone
Website
Email
Industry
```

The exact fields available to the application were identified from Zoho CRM metadata rather than assuming field names.

### Contacts

Implemented operations:

- List Contacts
- View Contact details
- Create Contact
- Search Contact by email
- Prevent duplicate email creation
- Associate Contact with an Account
- Retrieve created Contact

Main fields used:

```text
First_Name
Last_Name
Email
Phone
Account_Name
Account_Id
```

For the Contact → Account relationship, the application uses Zoho CRM's `Account_Name` lookup field and passes the Account record ID.

Example:

```json
{
  "Account_Name": {
    "id": "ACCOUNT_RECORD_ID"
  }
}
```

---

# 4. Metadata API

One important part of this project is that the Zoho CRM field API names were **identified using Zoho CRM's Metadata / Fields API**.

The application does not rely only on the labels displayed in the Zoho CRM UI.

For example, a UI label such as:

```text
Last Name
```

may have the API name:

```text
Last_Name
```

Similarly, the Contact account relationship uses the API field:

```text
Account_Name
```

### Why metadata was used

Zoho CRM APIs require the actual **Field API Names** when sending and requesting record data.

The Fields Metadata API provides information such as:

- Field label
- API name
- Data type
- Mandatory status
- Read-only status
- Custom/system field information
- Picklist values
- Lookup information
- Unique-field information
- Other field configuration

This allowed the application to identify the correct Zoho field names before implementing the CRUD operations.

Zoho's API documentation also explicitly recommends obtaining field API names from the Fields Metadata API when constructing record requests.

---

# 5. Zoho API Version

The application uses:

```text
Zoho CRM API v8
```

Examples:

```text
https://www.zohoapis.com/crm/v8/Leads
https://www.zohoapis.com/crm/v8/Accounts
https://www.zohoapis.com/crm/v8/Contacts
```

The application uses Zoho's API field names when sending and receiving CRM data.

---

# 6. OAuth Authentication

The application uses Zoho OAuth 2.0 instead of hard-coding an access token.

The general flow is:

```text
User
  |
  v
Next.js Application
  |
  v
Zoho Authorization
  |
  v
Authorization Code
  |
  v
Zoho Token Endpoint
  |
  v
Access Token + Refresh Token
  |
  v
Zoho CRM APIs
```

### OAuth scopes

The integration requires appropriate CRM scopes for the implemented modules.

Example scopes used during development include:

```text
ZohoCRM.modules.leads.READ
ZohoCRM.modules.leads.CREATE
ZohoCRM.settings.READ
```

Equivalent permissions are required for Accounts and Contacts when those modules are accessed or modified.

### Important

Access tokens are temporary.

The application therefore uses a token utility such as:

```ts
getValidToken();
```

to obtain a valid token before making CRM API requests.

For a production multi-user application, refresh tokens should be persisted securely per Zoho-connected user/tenant rather than kept only in process memory.

---

# 7. Project Structure

The project uses the Next.js App Router.

A simplified structure is:

```text
.
├── app/
│   ├── api/
│   │   ├── leads/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   │
│   │   ├── accounts/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   │
│   │   └── contacts/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   │
│   ├── leads/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── accounts/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── contacts/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── auth/
│   │   └── ...
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── Sidebar.tsx
│   ├── ThemeProvider.tsx
│   └── ...
│
├── lib/
│   ├── zoho-api.ts
│   └── token-store.ts
│
├── public/
│
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

> The exact component files may vary depending on the final UI implementation, but the application follows this App Router/API Route Handler structure.

---

# 8. Backend API Routes

The Next.js application contains backend Route Handlers under:

```text
app/api/
```

This allows the browser to communicate with the application's own API instead of directly exposing Zoho OAuth credentials or implementation details.

---

## Leads

### List Leads

```text
GET /api/leads
```

Internally:

```text
GET https://www.zohoapis.com/crm/v8/Leads
```

The request includes fields such as:

```text
id
First_Name
Last_Name
Email
Company
Phone
```

---

### Create Lead

```text
POST /api/leads
```

Request body example:

```json
{
  "First_Name": "John",
  "Last_Name": "Doe",
  "Company": "Example Ltd",
  "Email": "john@example.com",
  "Phone": "01700000000"
}
```

Flow:

```text
POST /api/leads
       |
       v
Validate input
       |
       v
Search Lead by Email
       |
       +---- Found ----> HTTP 409
       |
       v
Create Lead in Zoho
       |
       v
Get created Lead using returned ID
       |
       v
Return created Lead
```

---

### Get Lead

```text
GET /api/leads/:id
```

Internally:

```text
GET /crm/v8/Leads/:id
```

---

# 9. Accounts API

### List Accounts

```text
GET /api/accounts
```

### Create Account

```text
POST /api/accounts
```

Example:

```json
{
  "Account_Name": "Example Corporation",
  "Phone": "01700000000",
  "Website": "https://example.com"
}
```

### Get Account

```text
GET /api/accounts/:id
```

---

# 10. Contacts API

### List Contacts

```text
GET /api/contacts
```

### Create Contact

```text
POST /api/contacts
```

Example frontend payload:

```json
{
  "First_Name": "John",
  "Last_Name": "Doe",
  "Email": "john@example.com",
  "Phone": "01700000000",
  "Account_Id": "5725769000001234567"
}
```

The backend maps the account ID to Zoho's lookup field:

```json
{
  "First_Name": "John",
  "Last_Name": "Doe",
  "Email": "john@example.com",
  "Phone": "01700000000",
  "Account_Name": {
    "id": "5725769000001234567"
  }
}
```

This associates the Contact with the selected Account.

### Get Contact

```text
GET /api/contacts/:id
```

---

# 11. Duplicate Handling

The application performs an application-level duplicate check before creating Leads and Contacts.

Example:

```text
POST /api/leads
        |
        v
Search Zoho by Email
        |
        +---- Existing record
        |          |
        |          v
        |       HTTP 409
        |
        +---- No record
                   |
                   v
              Create record
```

The API returns:

```json
{
  "success": false,
  "code": "DUPLICATE_EMAIL",
  "message": "A lead with this email already exists."
}
```

HTTP status:

```text
409 Conflict
```

The frontend handles this with a toast notification.

Example:

```ts
if (res.status === 409 && data.code === "DUPLICATE_EMAIL") {
  toast.error("Duplicate Lead", {
    description: "This email already exists in Zoho CRM.",
  });

  return;
}
```

---

# 12. Centralized Error Handling

Zoho API errors are handled centrally rather than repeating error parsing in every route.

Typical information extracted includes:

```text
HTTP status
Zoho error code
Zoho error message
```

Example response:

```json
{
  "success": false,
  "code": "OAUTH_SCOPE_MISMATCH",
  "message": "Unauthorized"
}
```

This makes frontend error handling more predictable.

---

# 13. Important Zoho Errors Considered

### 401 — Unauthorized

Possible causes include:

- Invalid access token
- Expired access token
- Missing/incorrect OAuth permissions
- `OAUTH_SCOPE_MISMATCH`

### OAUTH_SCOPE_MISMATCH

This indicates that the OAuth authorization does not provide the scope required for the requested operation.

The solution is to:

1. Identify the required Zoho API scope.
2. Add the scope to the OAuth authorization request.
3. Re-authorize the application.
4. Obtain a new access token.

Simply changing the scope in source code does not upgrade an already-issued token.

### 403 — Permission Denied

The authenticated Zoho user may not have sufficient CRM permissions.

### 400 — Invalid Data / Missing Mandatory Field

The request may contain:

- Incorrect field API name
- Invalid field value
- Missing mandatory field
- Incorrect data type

### 409 — Application Duplicate

The application uses HTTP `409 Conflict` for its own duplicate-email rule.

---

# 14. Lead Creation and Record Retrieval

The assignment requires the newly inserted record to be retrieved using the returned Record ID.

The implementation follows:

```text
1. POST /Leads
2. Receive created Record ID
3. GET /Leads/{Record ID}
4. Return the complete created record
```

Example:

```ts
const record = response.data.data[0];
const recordId = record.details.id;

const details = await axios.get(
  `https://www.zohoapis.com/crm/v8/Leads/${recordId}`,
  {
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
    },
  }
);
```

This verifies that the record was successfully created and can subsequently be retrieved from Zoho CRM.

---

# 15. GET vs Search

The implementation uses both operations for different purposes.

### GET by ID

Use when the record ID is already known:

```text
GET /Leads/{id}
```

Example:

```text
GET /api/leads/5725769000001234567
```

### Search

Use when the record ID is not known and we need to find a record based on information such as email:

```text
GET /Leads/search?email=john@example.com
```

Simple interview explanation:

> GET by ID = I already know the record.
>
> Search = I need to find the record.

---

# 16. Contact → Account Relationship

Zoho CRM represents the Contact's Account relationship using a lookup field.

The Contact contains:

```text
Account_Name
```

The value is a lookup object containing the Account record ID.

Example:

```json
"Account_Name": {
  "id": "ACCOUNT_ID"
}
```

The frontend can therefore maintain:

```text
Account_Name
Account_Id
```

where:

- `Account_Name` is used for display.
- `Account_Id` is used to create the Zoho lookup relationship.

---

# 17. Frontend Pages

The application provides separate pages for each module.

### Leads

```text
/leads
```

Displays Leads and provides the create interface.

```text
/leads/:id
```

Displays an individual Lead.

### Accounts

```text
/accounts
```

Displays Accounts and provides the create interface.

```text
/accounts/:id
```

Displays an individual Account.

### Contacts

```text
/contacts
```

Displays Contacts and provides the create interface.

```text
/contacts/:id
```

Displays an individual Contact.

---

# 18. Example Frontend Create Flow

The frontend follows a consistent pattern:

```text
User fills form
      |
      v
Client-side validation
      |
      v
POST to Next.js API route
      |
      v
Next.js validates/processes request
      |
      v
Zoho CRM API
      |
      v
Response
      |
      +---- Error ---> Toast / error message
      |
      +---- Success -> Detail page
```

After successful creation, the application navigates to the newly created record:

```text
/contacts/{id}?isSuccess=true
```

or:

```text
/leads/{id}?isSuccess=true
```

---

# 19. Environment Variables

Sensitive credentials should not be committed to Git.

Example `.env.local`:

```env
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REDIRECT_URI=http://localhost:3000/api/auth/zoho/callback
ZOHO_REFRESH_TOKEN=your_refresh_token
```

Use the actual variable names configured in the project.

### Never commit:

```text
.env
.env.local
client secrets
refresh tokens
access tokens
```

Add environment files to `.gitignore`.

For Vercel, configure the environment variables in the project's Vercel settings.

---

# 20. Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

If the application uses a different configured port, use that port instead.

---

# 21. OAuth Setup

Create/configure a Zoho application in the Zoho API Console.

Configure:

```text
Client ID
Client Secret
Redirect URI
Required OAuth scopes
```

The redirect URI configured in Zoho must exactly match the redirect URI used by the application.

Example:

```text
http://localhost:3000/api/auth/zoho/callback
```

For production, configure the deployed HTTPS callback URL as appropriate.

---

# 22. Security Considerations

The application keeps Zoho authentication logic on the server side.

The browser communicates with:

```text
Next.js API Routes
```

instead of directly handling the Zoho client secret.

Important security practices:

- Never expose `ZOHO_CLIENT_SECRET` to the browser.
- Never expose a refresh token to client-side JavaScript.
- Never hard-code access tokens.
- Store refresh tokens securely.
- Use HTTPS in production.
- Validate incoming request data.
- Restrict OAuth scopes to the permissions actually required.
- Do not log access tokens or refresh tokens.
- Keep environment variables out of source control.

---

# 23. Production Token Architecture

The current implementation uses a reusable token utility to obtain a valid access token.

For a production multi-user application, the recommended architecture is:

```text
User / Tenant
     |
     v
Stored encrypted refresh token
     |
     v
Zoho OAuth Token Endpoint
     |
     v
Short-lived access token
     |
     v
Zoho CRM API
```

Refresh tokens should be stored securely and associated with the correct connected user/tenant.

An in-memory token store is suitable for local development/testing but should not be relied upon for a production deployment because server restarts or serverless execution can discard process memory.

---

# 24. Deployment

The application is designed for deployment on Vercel.

Typical deployment flow:

```text
Git Repository
      |
      v
Vercel
      |
      v
Next.js Build
      |
      v
Production Application
```

Before deployment:

1. Add required environment variables.
2. Configure the production Zoho OAuth redirect URI.
3. Ensure the deployed domain uses HTTPS.
4. Verify Zoho OAuth authorization.
5. Test Leads.
6. Test Accounts.
7. Test Contacts.
8. Test Contact → Account association.
9. Test duplicate handling.
10. Test record detail pages.

---

# 25. API Design Summary

| Application Endpoint | Method | Purpose        |
| -------------------- | ------ | -------------- |
| `/api/leads`         | GET    | List Leads     |
| `/api/leads`         | POST   | Create Lead    |
| `/api/leads/:id`     | GET    | Get Lead       |
| `/api/accounts`      | GET    | List Accounts  |
| `/api/accounts`      | POST   | Create Account |
| `/api/accounts/:id`  | GET    | Get Account    |
| `/api/contacts`      | GET    | List Contacts  |
| `/api/contacts`      | POST   | Create Contact |
| `/api/contacts/:id`  | GET    | Get Contact    |

---

# 26. Zoho API Mapping

| Application             | Zoho CRM                   |
| ----------------------- | -------------------------- |
| `GET /api/leads`        | `GET /crm/v8/Leads`        |
| `POST /api/leads`       | `POST /crm/v8/Leads`       |
| `GET /api/leads/:id`    | `GET /crm/v8/Leads/:id`    |
| `GET /api/accounts`     | `GET /crm/v8/Accounts`     |
| `POST /api/accounts`    | `POST /crm/v8/Accounts`    |
| `GET /api/accounts/:id` | `GET /crm/v8/Accounts/:id` |
| `GET /api/contacts`     | `GET /crm/v8/Contacts`     |
| `POST /api/contacts`    | `POST /crm/v8/Contacts`    |
| `GET /api/contacts/:id` | `GET /crm/v8/Contacts/:id` |

---

# 27. Implementation Decisions

### Why Next.js?

Next.js allows the project to contain both:

- React frontend pages
- Server-side API Route Handlers

This keeps the frontend and Zoho integration in a single application.

### Why use API routes?

The browser should not directly receive the Zoho client secret or refresh token.

The Next.js backend acts as an integration layer:

```text
Frontend
   |
   v
Next.js API
   |
   v
Zoho CRM
```

### Why use metadata?

Zoho field labels and API names are not always identical.

Using metadata ensures that the application works with the actual API names configured in the CRM.

### Why use search before create?

The application needs application-level control over duplicate email creation.

The flow is:

```text
Search
  ↓
Existing?
  ├── Yes → 409 DUPLICATE_EMAIL
  └── No  → Create
```

---

# 28. Assessment Requirements Covered

The implementation covers the main practical requirements:

- [x] Zoho CRM account/application setup
- [x] OAuth authentication
- [x] No hard-coded access token
- [x] Access token handling
- [x] Refresh token handling
- [x] Zoho CRM API integration
- [x] Metadata API usage
- [x] Field API name identification
- [x] Read Leads
- [x] Read Accounts
- [x] Read Contacts
- [x] Display CRM record IDs
- [x] Display names
- [x] Display emails
- [x] Display additional fields
- [x] Create Leads
- [x] Create Accounts
- [x] Create Contacts
- [x] Retrieve newly created record
- [x] Duplicate email handling
- [x] Contact → Account association
- [x] HTTP/API error handling
- [x] OAuth scope error handling
- [x] Next.js App Router
- [x] TypeScript
- [x] Vercel deployment

---

# 29. Zoho Documentation

Official Zoho CRM API documentation:

- Zoho CRM API v8 — Insert Records
- Zoho CRM Fields Metadata API
- Zoho CRM Records API
- Zoho CRM OAuth documentation

The Zoho Insert Records documentation confirms that record creation requests must use Field API Names and that field API names can be obtained from the Fields Metadata API.

---

# 31. Future Improvements

Possible production improvements include:

- Persistent encrypted OAuth token storage
- Multi-user / multi-tenant Zoho connections
- Token refresh middleware
- Update records
- Delete records
- Pagination
- Advanced search/filtering
- Sorting
- Server-side validation with Zod
- Rate-limit handling
- Retry/backoff handling
- Structured logging
- Automated tests
- Role-based access control
- Audit logging
- Better loading/error states
- CRM metadata caching
- Automated synchronization
- Background jobs for large data synchronization

---

## Conclusion

This project demonstrates a practical full-stack Zoho CRM integration using Next.js and TypeScript.

The key architectural pattern is:

```text
                 ┌─────────────────────┐
                 │     Next.js UI      │
                 │ Leads / Accounts /  │
                 │ Contacts            │
                 └──────────┬──────────┘
                            │
                            v
                 ┌─────────────────────┐
                 │ Next.js API Routes │
                 │ /api/leads         │
                 │ /api/accounts      │
                 │ /api/contacts      │
                 └──────────┬──────────┘
                            │
                            v
                 ┌─────────────────────┐
                 │ OAuth / Token      │
                 │ Management         │
                 └──────────┬──────────┘
                            │
                            v
                 ┌─────────────────────┐
                 │   Zoho CRM API v8  │
                 │ Leads / Accounts / │
                 │ Contacts / Metadata│
                 └─────────────────────┘
```

The application separates the frontend from Zoho credentials, uses OAuth authentication, relies on metadata for CRM field API names, and provides a reusable API layer for the three implemented CRM modules.
