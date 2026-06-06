# Advanced Control Room Features Guide

## Overview

The Support Bot now includes a powerful Admin Control Room that allows you to manage bot responses directly from the app without manual code edits.

## Features

### 1. Password-Protected Access
- Admin login with password protection (default: `admin123`)
- Session-based authentication with 24-hour timeout
- Secure logout functionality

### 2. Response Management

#### Add New Responses
- Create custom bot responses with keywords
- Categorize responses by topic
- Add multiple keywords for better matching

#### Edit Existing Responses
- Modify response text
- Update keywords and categories
- Real-time updates to the chat system

#### Delete Responses
- Remove unwanted responses
- Confirmation dialog prevents accidental deletion

#### Search & Filter
- Search responses by keywords or text
- Filter by category
- View response statistics

### 3. Import/Export

#### Export Responses
- Download all bot responses as JSON
- Create backups of your response database
- Share response templates

#### Import Responses
- Upload JSON files with new responses
- Batch add multiple responses
- Validate imported data

### 4. Data Persistence

All responses are stored in IndexedDB on the user's device:
- Responses persist across sessions
- No server required for local management
- Fast local search and retrieval

## How to Use

### Accessing the Control Room

1. Open the chat app
2. Click the Settings button (gear icon)
3. Click "Admin Control Room"
4. Enter the admin password (default: `admin123`)

### Adding a Response

1. Click "Add New Response"
2. Select a category
3. Enter the response text
4. Add at least one keyword (e.g., "password reset", "account help")
5. Click "Create Response"

### Editing a Response

1. Search for the response in the list
2. Click the edit icon (pencil)
3. Modify the text, keywords, or category
4. Click "Update Response"

### Exporting Your Data

1. Click "Export All" to download a JSON file
2. Save this file as a backup
3. Share it with team members or import it elsewhere

### Importing Responses

1. Click "Import JSON"
2. Select a JSON file with bot responses
3. Confirm the import
4. New responses will be added to your database

## Response JSON Format

When exporting or importing responses, use this format:

```json
[
  {
    "id": "unique-id",
    "keywords": ["password", "reset", "forgot"],
    "response": "To reset your password, click Forgot Password on the login page.",
    "category": "password",
    "createdAt": 1234567890,
    "updatedAt": 1234567890
  }
]
```

## Security Notes

- All responses are stored locally in IndexedDB
- Admin sessions expire after 24 hours
- Change the default password in production (`lib/admin-auth.ts`)
- For production, implement proper backend authentication

## Customization

### Change Admin Password

Edit `lib/admin-auth.ts`:

```typescript
const ADMIN_PASSWORD = 'your-new-password'; // Change this
```

### Add New Categories

Edit the `DEFAULT_CATEGORIES` in `components/response-editor.tsx`:

```typescript
const DEFAULT_CATEGORIES = [
  'account',
  'password',
  'billing',
  'your-new-category', // Add here
];
```

## Troubleshooting

### Responses Not Showing
- Clear browser cache
- Check if responses were imported correctly
- Verify keywords match user queries

### Can't Access Control Room
- Verify the admin password is correct
- Check if session has expired (after 24 hours)
- Clear sessionStorage if needed

### Import Failing
- Ensure JSON format is correct
- Check that all required fields are present
- Verify file encoding is UTF-8

## Best Practices

1. Regular backups - Export responses weekly
2. Clear categories - Keep categories organized
3. Descriptive keywords - Use keywords users would actually search
4. Test responses - Try responses in the chat to ensure they work
5. Review analytics - Monitor which responses are being used most
