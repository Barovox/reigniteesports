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

export async function saveEventRecord(client, record, id) {
  const result = id
    ? await client.from('events').update(record).eq('id', id).select().single()
    : await client.from('events').insert(record).select().single();

  if (result.error) throw result.error;
  return result.data;
}
