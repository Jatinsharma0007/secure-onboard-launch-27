# Setting Up Google OAuth for Your Application

This guide will help you properly configure Google OAuth for your Supabase application to fix the "Error 400: redirect_uri_mismatch" issue.

## Step 1: Get Your Application's URL

First, identify the exact URL where your application is running:

- Development: `http://localhost:8080` (or whatever port you're using)
- Production: Your actual domain, e.g., `https://your-app-domain.com`

## Step 2: Configure Google OAuth in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to "Authentication" → "Providers" → "Google"
4. Enable Google authentication
5. Add the following redirect URLs (add both to ensure it works in all environments):
   - `http://localhost:8080/dashboard`
   - `https://your-app-domain.com/dashboard` (if you have a production site)
   - Your development URL with the path: `http://localhost:8080/auth/callback`
   - Your production URL with the path: `https://your-app-domain.com/auth/callback`

## Step 3: Configure Google Cloud Console

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Go to "APIs & Services" → "Credentials"
4. Find your OAuth 2.0 Client ID or create a new one:
   - Click "Create Credentials" → "OAuth client ID"
   - Select "Web application" as the application type
   - Add the following Authorized JavaScript origins:
     - `http://localhost:8080`
     - `https://your-app-domain.com` (if applicable)
   - Add the following Authorized redirect URIs:
     - `http://localhost:8080/dashboard`
     - `https://your-app-domain.com/dashboard` (if applicable)
     - `https://efevsodqbptyduwokjyd.supabase.co/auth/v1/callback`
     - `http://localhost:8080/auth/callback`
     - `https://your-app-domain.com/auth/callback` (if applicable)

5. Click "Save"
6. Copy the "Client ID" and "Client Secret"

## Step 4: Update Supabase with Google Credentials

1. Go back to Supabase Authentication settings
2. Enter the Client ID and Client Secret from Google Cloud Console
3. Save the settings

## Step 5: Test Your Authentication

1. Run your application
2. Try to sign in with Google
3. The authentication should now work without the redirect_uri_mismatch error

## Troubleshooting

If you still encounter issues:

1. Check browser console for detailed error messages
2. Verify that the redirect URIs in Google Cloud Console exactly match what Supabase is sending
3. Make sure you've added all possible redirect URLs to both Google Cloud Console and Supabase
4. Try clearing your browser cache and cookies before testing again
5. Check that your application is using the correct Supabase project

Remember that changes in Google Cloud Console can take a few minutes to propagate. 