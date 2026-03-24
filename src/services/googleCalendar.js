/**
 * Creates an all-day event in the user's primary Google Calendar.
 *
 * @param {string} token  - The OAuth provider_token from the Supabase session.
 * @param {{ text: string, deadline: string }} task - The task to sync.
 * @param {string|number} supabaseId - The ID from Supabase to link the event.
 * @throws {Error} if the Google Calendar API returns a non-OK response.
 */
export async function createGoogleEvent(token, task, supabaseId) {
  if (!token) {
    throw new Error('No Google OAuth token available.');
  }

  const startDate = task.deadline;
  const endDate = getNextDay(startDate);

  const event = {
    summary: task.text,
    start: { date: startDate },
    end: { date: endDate },
    // Store Supabase ID in extended properties for later search
    extendedProperties: {
      shared: {
        supabaseTaskId: supabaseId.toString(),
      },
    },
  };

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData?.error?.message || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

/**
 * Finds a Google Calendar event ID by its linked Supabase Task ID.
 *
 * @param {string} token
 * @param {string|number} supabaseId
 * @returns {Promise<string|null>} GCal Event ID or null if not found
 */
export async function findGoogleEventId(token, supabaseId) {
  if (!token) return null;

  const query = new URLSearchParams({
    sharedExtendedProperty: `supabaseTaskId=${supabaseId}`,
  });

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${query}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) return null;

  const data = await response.json();
  return data.items?.[0]?.id || null;
}

/**
 * Updates an existing Google Calendar event.
 */
export async function updateGoogleEvent(token, gcalId, task) {
  const startDate = task.deadline;
  const endDate = getNextDay(startDate);

  const event = {
    summary: task.text,
    start: { date: startDate },
    end: { date: endDate },
  };

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${gcalId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData?.error?.message || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
}

/**
 * Deletes a Google Calendar event.
 */
export async function deleteGoogleEvent(token, gcalId) {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${gcalId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok && response.status !== 404) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `HTTP ${response.status}`);
  }
}

/**
 * Returns the next calendar day for a given YYYY-MM-DD string.
 */
function getNextDay(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  date.setDate(date.getDate() + 1);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// ==========================================
// SUBSCRIPTION SYNC FUNCS
// ==========================================

function getRecurrenceRule(cycle) {
  switch (cycle) {
    case 'yearly': return ['RRULE:FREQ=YEARLY'];
    case 'weekly': return ['RRULE:FREQ=WEEKLY'];
    case 'monthly':
    default:
      return ['RRULE:FREQ=MONTHLY'];
  }
}

/**
 * Creates an all-day recurring event for a subscription in Google Calendar.
 */
export async function createSubscriptionGoogleEvent(token, sub, supabaseId) {
  if (!token) throw new Error('No Google OAuth token available.');

  const startDate = sub.first_payment_date;
  const endDate = getNextDay(startDate);

  const event = {
    summary: `Tagihan: ${sub.name}`,
    start: { date: startDate },
    end: { date: endDate },
    recurrence: getRecurrenceRule(sub.cycle),
    extendedProperties: {
      shared: {
        supabaseSubscriptionId: supabaseId.toString(),
      },
    },
  };

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData?.error?.message || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

/**
 * Finds a Google Calendar event ID by its linked Supabase Subscription ID.
 */
export async function findSubscriptionGoogleEventId(token, supabaseId) {
  if (!token) return null;

  const query = new URLSearchParams({
    sharedExtendedProperty: `supabaseSubscriptionId=${supabaseId}`,
  });

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${query}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) return null;

  const data = await response.json();
  return data.items?.[0]?.id || null;
}

/**
 * Updates an existing Subscription Google Calendar event.
 */
export async function updateSubscriptionGoogleEvent(token, gcalId, sub) {
  const startDate = sub.first_payment_date;
  const endDate = getNextDay(startDate);

  const event = {
    summary: `Tagihan: ${sub.name}`,
    start: { date: startDate },
    end: { date: endDate },
    recurrence: getRecurrenceRule(sub.cycle),
  };

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${gcalId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData?.error?.message || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
}

/**
 * Deletes a Subscription Google Calendar event.
 */
export async function deleteSubscriptionGoogleEvent(token, gcalId) {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${gcalId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok && response.status !== 404) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `HTTP ${response.status}`);
  }
}

