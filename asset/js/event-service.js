const EVENT_CATEGORIES = ['STREAM', 'SCRIM', 'TOURNAMENT', 'ANNOUNCEMENT', 'COMMUNITY'];

export function validateEventInput({ title, startDate, startTime, endDate, endTime, externalUrl, category }) {
  if (!title || !startDate || !startTime || !endDate || !endTime) {
    return 'Enter an event title, start date and time, and end date and time.';
  }

  if (`${endDate}T${endTime}` <= `${startDate}T${startTime}`) {
    return 'End date and time must be later than the start date and time.';
  }

  if (externalUrl) {
    try {
      const url = new URL(externalUrl);
      if (!['http:', 'https:'].includes(url.protocol)) {
        return 'Enter a valid external URL starting with http:// or https://.';
      }
    } catch {
      return 'Enter a valid external URL starting with http:// or https://.';
    }
  }

  if (!EVENT_CATEGORIES.includes(category)) {
    return 'Select a valid event category.';
  }

  return '';
}

function eventDateTime(date, time) {
  return `${date}T${time.slice(0, 5)}`;
}

function eventsOverlap(first, second) {
  const firstStart = eventDateTime(first.start_date, first.start_time);
  const firstEnd = eventDateTime(first.end_date, first.end_time);
  const secondStart = eventDateTime(second.start_date, second.start_time);
  const secondEnd = eventDateTime(second.end_date, second.end_time);

  return firstStart < secondEnd && firstEnd > secondStart;
}

export async function saveEventRecord(client, record, id) {
  const { data: events, error: loadError } = await client
    .from('events')
    .select('id, start_date, start_time, end_date, end_time');

  if (loadError) throw loadError;

  const conflict = (events || []).find((event) => event.id !== id && eventsOverlap(record, event));
  if (conflict) {
    throw new Error('This event overlaps another event. Choose a different date or time.');
  }

  const result = id
    ? await client.from('events').update(record).eq('id', id).select().single()
    : await client.from('events').insert(record).select().single();

  if (result.error?.code === '23P01') {
    throw new Error('This event overlaps another event. Choose a different date or time.');
  }
  if (result.error) throw result.error;
  return result.data;
}
