# Listmonk Newsletter Configuration Guide

This guide explains how to configure Listmonk for the KDP Toolkit newsletter system across all 5 language sites.

## Prerequisites

- Listmonk running at http://84.247.188.99:9000
- Admin access to Listmonk dashboard
- Access to `.env` files for each language site

## Step 1: Create Language-Specific Lists

Create a separate mailing list for each language in Listmonk:

1. Log into Listmonk at http://84.247.188.99:9000
2. Go to **Lists** → **New List**
3. Create the following lists:

| List Name | Type | Description |
|-----------|------|-------------|
| KDP Toolkit EN | Public | English newsletter subscribers |
| KDP Toolkit DE | Public | German newsletter subscribers |
| KDP Toolkit ES | Public | Spanish newsletter subscribers |
| KDP Toolkit FR | Public | French newsletter subscribers |
| KDP Toolkit PL | Public | Polish newsletter subscribers |

For each list, configure:
- **Name**: e.g., "KDP Toolkit EN"
- **Type**: Public (allows subscription via API)
- **Opt-in**: Double opt-in (GDPR compliant)
- **Description**: Brief description in the list's language

## Step 2: Get List UUIDs

After creating each list:

1. Go to **Lists** in the sidebar
2. Click on each list to view its details
3. Copy the **UUID** from the URL or list details
4. Note down each UUID for configuration

Example UUIDs (replace with your actual values):
```
EN: a1b2c3d4-e5f6-7890-abcd-ef1234567890
DE: b2c3d4e5-f6a7-8901-bcde-f12345678901
ES: c3d4e5f6-a7b8-9012-cdef-123456789012
FR: d4e5f6a7-b8c9-0123-defa-234567890123
PL: e5f6a7b8-c9d0-1234-efab-345678901234
```

## Step 3: Configure Environment Variables

### For Each Language Site

Update the `.env` file in each language site directory:

#### English Site (kdptoolkit-EN/.env)
```env
LISTMONK_URL=http://84.247.188.99:9000
LISTMONK_USERNAME=admin
LISTMONK_PASSWORD=your-password
LISTMONK_LIST_UUID_EN=your-english-list-uuid
```

#### German Site (kdptoolkit-DE/.env)
```env
LISTMONK_URL=http://84.247.188.99:9000
LISTMONK_USERNAME=admin
LISTMONK_PASSWORD=your-password
LISTMONK_LIST_UUID_DE=your-german-list-uuid
```

Repeat for ES, FR, PL sites with their respective UUIDs.

### Vercel Environment Variables

If deploying to Vercel, add these environment variables in the Vercel dashboard:

1. Go to your project → Settings → Environment Variables
2. Add each variable for the appropriate environment (Production/Preview/Development)

## Step 4: Enable Public Subscription

In Listmonk settings:

1. Go to **Settings** → **General**
2. Enable **Public subscriptions**
3. Configure the **Root URL** to your Listmonk instance
4. Set up email templates for:
   - Welcome email (per language)
   - Confirmation email (per language)
   - Unsubscribe confirmation (per language)

## Step 5: Create Email Templates

Create language-specific templates for each notification type:

### Welcome Email Template (English)
```
Subject: Welcome to KDP Toolkit Newsletter!

Body:
Hello {{ .Subscriber.Name }},

Thank you for subscribing to the KDP Toolkit newsletter!

You'll receive:
- Weekly tool reviews and comparisons
- Publishing tips and strategies
- Exclusive deals and discounts

Best regards,
The KDP Toolkit Team

---
Unsubscribe: {{ .UnsubscribeURL }}
```

Create similar templates for DE, ES, FR, PL languages.

## Step 6: Configure Double Opt-in (GDPR)

For GDPR compliance, ensure double opt-in is enabled:

1. Go to **Settings** → **Subscribers**
2. Set **Default subscriber status** to `unconfirmed`
3. Enable **Send opt-in confirmation**
4. Configure confirmation email templates

## Step 7: Test the Integration

### Test via Website
1. Go to any page with the newsletter form
2. Enter a test email
3. Check the GDPR consent box
4. Submit the form
5. Verify:
   - Success message appears
   - Confirmation email received
   - Subscriber appears in Listmonk (status: unconfirmed)
   - After clicking confirmation link, status changes to enabled

### Test via API
```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "language": "en",
    "gdprConsent": true
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Subscription successful. Please check your email to confirm."
}
```

## Subscriber Attributes

The newsletter system stores the following attributes for each subscriber:

| Attribute | Description |
|-----------|-------------|
| gdpr_consent | Boolean: true if consent given |
| gdpr_consent_date | ISO timestamp of consent |
| language | Subscriber's language preference |
| source | Always "website" for web signups |

These can be used for:
- GDPR compliance audits
- Segmentation by language
- Analytics

## Troubleshooting

### Common Issues

**1. "Newsletter service not configured" error**
- Check `LISTMONK_URL` is set in `.env`
- Verify Listmonk is running and accessible

**2. "Newsletter list not configured" error**
- Verify `LISTMONK_LIST_UUID_*` is set for the language
- Check the UUID matches an existing list in Listmonk

**3. Subscription succeeds but no email**
- Check Listmonk email settings (SMTP)
- Verify email templates are configured
- Check spam folder

**4. CORS errors**
- The API route should handle CORS automatically
- If using direct Listmonk access, configure CORS in Listmonk settings

### Checking Listmonk Logs

```bash
ssh root@84.247.188.99 "docker logs listmonk 2>&1 | tail -50"
```

### Verifying Subscribers

```bash
curl -u "admin:password" http://84.247.188.99:9000/api/subscribers
```

## Security Considerations

1. **Never expose Listmonk credentials client-side**
   - Use `LISTMONK_URL` (server-side) not `NEXT_PUBLIC_LISTMONK_URL`
   - API route handles all Listmonk communication

2. **GDPR Compliance**
   - GDPR consent checkbox is mandatory
   - Consent timestamp is recorded
   - Double opt-in enabled
   - Unsubscribe link in all emails

3. **Rate Limiting**
   - Consider adding rate limiting to the API route
   - Listmonk has built-in rate limiting for email sending

## Maintenance

### Regular Tasks
- Monitor subscriber growth per list
- Check bounce rates and clean lists
- Update email templates as needed
- Review GDPR consent logs periodically

### Backup
Listmonk stores data in PostgreSQL. Ensure database backups include:
- `subscribers` table
- `lists` table
- `subscriber_lists` table
- `campaigns` table (if sending newsletters)
