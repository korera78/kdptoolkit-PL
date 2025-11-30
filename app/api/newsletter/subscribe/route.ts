/**
 * Newsletter Subscription API Route
 * Proxies subscription requests to Listmonk with GDPR compliance
 */

import { NextRequest, NextResponse } from 'next/server';

// Language to Listmonk list UUID mapping
// These should be configured in .env or Listmonk configuration
const LIST_UUIDS: Record<string, string> = {
  en: process.env.LISTMONK_LIST_UUID_EN || process.env.NEXT_PUBLIC_LISTMONK_LIST_UUID || '',
  de: process.env.LISTMONK_LIST_UUID_DE || process.env.NEXT_PUBLIC_LISTMONK_LIST_UUID || '',
  es: process.env.LISTMONK_LIST_UUID_ES || process.env.NEXT_PUBLIC_LISTMONK_LIST_UUID || '',
  fr: process.env.LISTMONK_LIST_UUID_FR || process.env.NEXT_PUBLIC_LISTMONK_LIST_UUID || '',
  pl: process.env.LISTMONK_LIST_UUID_PL || process.env.NEXT_PUBLIC_LISTMONK_LIST_UUID || '',
};

interface SubscribeRequestBody {
  email: string;
  name?: string;
  language: string;
  gdprConsent: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscribeRequestBody = await request.json();
    const { email, name, language, gdprConsent } = body;

    // Validate required fields
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // GDPR consent is required
    if (!gdprConsent) {
      return NextResponse.json(
        { error: 'GDPR consent is required' },
        { status: 400 }
      );
    }

    // Get Listmonk configuration
    const listmonkUrl = process.env.LISTMONK_URL || process.env.NEXT_PUBLIC_LISTMONK_URL;
    const listmonkUsername = process.env.LISTMONK_USERNAME;
    const listmonkPassword = process.env.LISTMONK_PASSWORD;

    if (!listmonkUrl) {
      console.error('Listmonk URL not configured');
      return NextResponse.json(
        { error: 'Newsletter service not configured' },
        { status: 500 }
      );
    }

    // Get the appropriate list UUID for the language
    const validLanguage = ['en', 'de', 'es', 'fr', 'pl'].includes(language) ? language : 'en';
    const listUuid = LIST_UUIDS[validLanguage];

    if (!listUuid) {
      console.error(`List UUID not configured for language: ${validLanguage}`);
      return NextResponse.json(
        { error: 'Newsletter list not configured' },
        { status: 500 }
      );
    }

    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add basic auth if credentials are provided (for API access)
    if (listmonkUsername && listmonkPassword) {
      const credentials = Buffer.from(`${listmonkUsername}:${listmonkPassword}`).toString('base64');
      headers['Authorization'] = `Basic ${credentials}`;
    }

    // Listmonk public subscription endpoint
    const subscriptionPayload = {
      email: email.toLowerCase().trim(),
      name: name?.trim() || '',
      list_uuids: [listUuid],
      // Store GDPR consent timestamp as attribute
      attribs: {
        gdpr_consent: true,
        gdpr_consent_date: new Date().toISOString(),
        language: validLanguage,
        source: 'website',
      },
    };

    // Try the public subscription endpoint first
    const response = await fetch(`${listmonkUrl}/subscription/form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionPayload),
    });

    // If public endpoint fails and we have API credentials, try API endpoint
    if (!response.ok && listmonkUsername && listmonkPassword) {
      const apiResponse = await fetch(`${listmonkUrl}/api/subscribers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          name: name?.trim() || '',
          status: 'enabled',
          lists: [parseInt(listUuid) || 1], // API uses list IDs, not UUIDs
          attribs: subscriptionPayload.attribs,
        }),
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error('Listmonk API error:', errorText);

        // Check for duplicate subscriber
        if (apiResponse.status === 409 || errorText.includes('duplicate')) {
          return NextResponse.json(
            { error: 'This email is already subscribed' },
            { status: 409 }
          );
        }

        return NextResponse.json(
          { error: 'Failed to subscribe. Please try again.' },
          { status: 500 }
        );
      }
    } else if (!response.ok) {
      const errorText = await response.text();
      console.error('Listmonk subscription error:', errorText);

      // Check for duplicate subscriber
      if (response.status === 409 || errorText.includes('duplicate')) {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    // Log successful subscription (without PII in production)
    console.log(`Newsletter subscription successful for language: ${validLanguage}`);

    return NextResponse.json({
      success: true,
      message: 'Subscription successful. Please check your email to confirm.',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
