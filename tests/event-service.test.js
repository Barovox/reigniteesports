import test from 'node:test';
import assert from 'node:assert/strict';
import { saveEventRecord, validateEventInput } from '../asset/js/event-service.js';

function createMemoryClient() {
  const events = [];
  return {
    events,
    from(table) {
      assert.equal(table, 'events');
      return {
        select() {
          return Promise.resolve({ data: events, error: null });
        },
        insert(record) {
          events.push(record);
          return {
            select() {
              return {
                single: async () => ({ data: record, error: null })
              };
            }
          };
        },
        update(record) {
          return {
            eq(_column, id) {
              const index = events.findIndex((event) => event.id === id);
              if (index >= 0) events[index] = record;
              return {
                select() {
                  return {
                    single: async () => ({
                      data: events[index] || null,
                      error: index >= 0 ? null : new Error('Event not found.')
                    })
                  };
                }
              };
            }
          };
        }
      };
    }
  };
}

function makeEvent(id, startTime, endTime, startDate = '2026-11-10', endDate = startDate) {
  return {
    ...validInput,
    id,
    startDate,
    endDate,
    startTime,
    endTime,
    start_date: startDate,
    end_date: endDate,
    start_time: startTime,
    end_time: endTime
  };
}

const validInput = {
  title: 'League Scrim',
  startDate: '2026-11-10',
  startTime: '19:00',
  endDate: '2026-11-10',
  endTime: '20:00',
  externalUrl: '',
  category: 'SCRIM'
};

test('rejects events whose schedule overlaps an existing event', async () => {
  const client = createMemoryClient();
  const first = makeEvent('first', '19:00', '21:00');
  const second = { ...makeEvent('second', '20:30', '22:30'), title: 'Scrim B' };

  await saveEventRecord(client, first, '');

  await assert.rejects(
    saveEventRecord(client, second, ''),
    /This event overlaps another event/
  );
  assert.equal(client.events.length, 1);
});

test('allows back-to-back events and events on separate dates', async () => {
  const client = createMemoryClient();
  await saveEventRecord(client, makeEvent('first', '19:00', '20:00'), '');

  await saveEventRecord(client, makeEvent('second', '20:00', '21:00'), '');
  await saveEventRecord(client, makeEvent('third', '19:00', '20:00', '2026-11-11'), '');

  assert.equal(client.events.length, 3);
});

test('rejects events whose end time is not after their start time', () => {
  assert.equal(
    validateEventInput({ ...validInput, endTime: '19:00' }),
    'End date and time must be later than the start date and time.'
  );
  assert.equal(
    validateEventInput({ ...validInput, startDate: '2026-11-11', endDate: '2026-11-10' }),
    'End date and time must be later than the start date and time.'
  );
});

test('rejects invalid URLs and unsupported categories', () => {
  assert.match(validateEventInput({ ...validInput, externalUrl: 'javascript:alert(1)' }), /valid external URL/);
  assert.match(validateEventInput({ ...validInput, category: 'OTHER' }), /valid event category/);
});

test('updates an existing event rather than creating a duplicate', async () => {
  const client = createMemoryClient();
  const original = { ...makeEvent('existing', '19:00', '20:00') };
  await saveEventRecord(client, original, '');

  const updated = { ...original, title: 'Updated Scrim', start_time: '18:30', end_time: '20:30' };
  await saveEventRecord(client, updated, 'existing');

  assert.equal(client.events.length, 1);
  assert.equal(client.events[0].title, 'Updated Scrim');
});

test('surfaces errors returned by Supabase', async () => {
  const client = {
    from() {
      return {
        select() {
          return Promise.resolve({ data: [], error: null });
        },
        insert() {
          return {
            select() {
              return {
                single: async () => ({ data: null, error: new Error('Database rejected event.') })
              };
            }
          };
        }
      };
    }
  };

  await assert.rejects(saveEventRecord(client, { ...validInput, id: 'failed' }, ''), /Database rejected event/);
});
