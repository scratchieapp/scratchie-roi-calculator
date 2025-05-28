# Scratchie ROI Calculator

A React-based ROI calculator for Scratchie's workplace safety platform. This application helps potential customers calculate the return on investment for implementing Scratchie in their organization.

## Features

- Multi-step form with industry-specific defaults
- Real-time ROI calculations
- Email capture with PDF generation
- Automatic email delivery with PDF attachment
- HubSpot CRM integration for lead management
- Responsive design with Tailwind CSS

## Environment Variables

To run this project, you'll need to set up the following environment variables:

### Required for Email Functionality
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
Get your API key from [Resend](https://resend.com/)

### Required for HubSpot Integration
```
HUBSPOT_API_KEY=pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```
Get your private app access token from the HubSpot Developer Portal

**Required HubSpot Scopes:**
- `crm.objects.contacts.read`
- `crm.objects.contacts.write`
- `crm.objects.custom.write`

### For Vercel Deployment
Make sure to add these environment variables to your Vercel project settings.

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables (create a `.env` file)
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

This project is configured for deployment on Vercel with serverless functions for email and HubSpot integration.

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- jsPDF for PDF generation
- Resend for email delivery
- HubSpot API for CRM integration
