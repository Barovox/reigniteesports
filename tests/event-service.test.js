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

const validInput = {
  title: 'League Scrim',
  startDate: '2026-11-10',
  startTime: '19:00',
  endDate: '2026-11-10',
  endTime: '20:00',
  externalUrl: '',
  category: 'SCRIM'
};

test('allows creating multiple events with overlapping schedule times', async () => {
  const client = createMemoryClient();
  const first = { ...validInput, id: 'first', title: 'Scrim A' };
  const second = { ...validInput, id: 'second', title: 'Scrim B', startTime: '19:30' };

  await saveEventRecord(client, first, '');
  await saveEventRecord(client, second, '');

  assert.equal(client.events.length, 2);
  assert.deepEqual(client.events.map(({ id }) => id), ['first', 'second']);
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
  const original = { ...validInput, id: 'existing' };
  await saveEventRecord(client, original, '');

  const updated = { ...original, title: 'Updated Scrim' };
  await saveEventRecord(client, updated, 'existing');

  assert.equal(client.events.length, 1);
  assert.equal(client.events[0].title, 'Updated Scrim');
});

test('surfaces errors returned by Supabase', async () => {
  const client = {
    from() {
      return {
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
