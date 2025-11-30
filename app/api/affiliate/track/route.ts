/**
 * Affiliate Click Tracking API
 * Records affiliate link clicks for analytics and conversion tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { hashIp, AFFILIATE_PROGRAMS } from '@/lib/affiliate';

interface TrackingEvent {
  event: 'click' | 'impression' | 'conversion';
  programId: string;
  productName?: string;
  category?: string;
  url: string;
  sessionId: string;
  referrer?: string;
  timestamp: string;
  conversionValue?: number;
}

// In-memory store for development (replace with PostgreSQL in production)
const clickEvents: Array<TrackingEvent & { ipHash: string; userAgent: string }> = [];

export async function POST(request: NextRequest) {
  try {
    const body: TrackingEvent = await request.json();
    const headersList = await headers();

    // Validate required fields
    if (!body.event || !body.programId || !body.sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate program ID
    if (!AFFILIATE_PROGRAMS[body.programId as keyof typeof AFFILIATE_PROGRAMS]) {
      // Allow unknown programs but log warning
      console.warn(`Unknown affiliate program: ${body.programId}`);
    }

    // Get and hash IP for privacy-compliant storage
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0] ||
               headersList.get('x-real-ip') ||
               'unknown';
    const ipHash = await hashIp(ip);

    // Get user agent
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Create tracking record
    const trackingRecord = {
      ...body,
      ipHash,
      userAgent,
      timestamp: body.timestamp || new Date().toISOString(),
    };

    // Store event (in production, insert into PostgreSQL)
    if (process.env.NODE_ENV === 'development') {
      clickEvents.push(trackingRecord);
      console.log('Affiliate tracking event:', JSON.stringify(trackingRecord, null, 2));
    } else {
      // TODO: Insert into PostgreSQL
      // await insertAffiliateEvent(trackingRecord);
    }

    // Return 1x1 transparent pixel for img-based tracking
    return NextResponse.json(
      { success: true, eventId: `evt_${Date.now()}` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Affiliate tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for conversion webhook callbacks
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const programId = searchParams.get('program');
  const sessionId = searchParams.get('session');
  const orderId = searchParams.get('order');
  const amount = searchParams.get('amount');

  if (!programId || !sessionId) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  // Record conversion event
  const conversionEvent: TrackingEvent = {
    event: 'conversion',
    programId,
    sessionId,
    url: '',
    timestamp: new Date().toISOString(),
    conversionValue: amount ? parseFloat(amount) : undefined,
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('Affiliate conversion:', JSON.stringify(conversionEvent, null, 2));
  }

  // Return transparent 1x1 gif for pixel-based conversion tracking
  const gif = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
  );

  return new NextResponse(gif, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
