import { publicSupabase, supabase } from './supabase.js';

const players = [
  {
    id: 'tuan18',
    name: 'TUAN18',
    role: 'IGL (In-Game Leader)',
    dob: 'October 18',
    summary: 'Strategic leader guiding the squad with composure and tactical precision.',
    achievements: [
      'Recognized Esports Master (Kiện Tướng Thể thao Điện tử).',
      '2nd Place – PUBG Mobile National Championship Vietnam 2024.',
      '2nd Place – PUBG Mobile National Championship Vietnam Fall 2025.',
      '2nd Place – Vietnam National Esports Championship, Year-End Season 2025.',
      '4th Place – PUBG Mobile Pro League Vietnam Fall 2026.'
    ],
    tiktok: 'https://www.tiktok.com/@tuanm1369?lang=en',
    image: new URL('../image/Tuan18.jpg', import.meta.url).href,
    initials: 'T18'
  },
  {
    id: 'nomk3',
    name: 'NOMK3',
    role: 'Support',
    dob: 'November 14',
    summary: 'Steady support specialist known for disciplined positioning and team impact.',
    achievements: [
      'Recognized Esports Master (Kiện Tướng Thể thao Điện tử).',
      '2nd Place – PUBG Mobile National Championship Vietnam 2024.',
      '2nd Place – PUBG Mobile National Championship Vietnam Fall 2025.',
      '2nd Place – Vietnam National Esports Championship, Year-End Season 2025.',
      '4th Place – PUBG Mobile Pro League Vietnam Fall 2026.'
    ],
    tiktok: 'https://www.tiktok.com/@nomkarba?lang=en',
    image: new URL('../image/NomK3.jpg', import.meta.url).href,
    initials: 'N3'
  },
  {
    id: 'boyti',
    name: 'BOYTI',
    role: 'Fragger',
    dob: 'August 5',
    summary: 'Explosive entry fragger with aggressive pressure and relentless tempo.',
    achievements: [
      'Recognized Esports Master (Kiện Tướng Thể thao Điện tử).',
      '3rd Place – 31st Southeast Asian Games Vietnam Qualifier.',
      '4th Place – PUBG Mobile Pro League Vietnam Spring 2022.',
      '4th Place – PUBG Mobile Pro League Vietnam Spring 2023.',
      '3rd Place – PUBG Mobile Premier Series 2023, Super Weekend 3.',
      '2nd Place – PUBG Mobile National Championship Vietnam 2024.',
      '2nd Place – PUBG Mobile National Championship Vietnam Fall 2025.',
      '2nd Place – Vietnam National Esports Championship, Year-End Season 2025.',
      '4th Place – PUBG Mobile Pro League Vietnam Fall 2026.'
    ],
    tiktok: 'https://www.tiktok.com/@boy050824?lang=en',
    image: new URL('../image/BoyTi.jpg', import.meta.url).href,
    initials: 'B'
  },
  {
    id: 'longh',
    name: 'LONGH',
    role: 'Fragger',
    dob: 'January 1',
    summary: 'High-impact fragger delivering crucial entry pressure and decisive plays.',
    achievements: [
      '4th Place – PUBG Mobile Pro League Vietnam Fall 2026.'
    ],
    tiktok: 'https://www.tiktok.com/@longh111107?lang=en',
    image: new URL('../image/LongH.jpg', import.meta.url).href,
    initials: 'L'
  }
];

const appState = {
  activeView: 'month',
  selectedDate: new Date(),
  currentMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  adminLoggedIn: false,
  adminUserId: null,
  events: [],
  eventsLoaded: false,
  eventError: '',
  eventFilters: {
    query: '',
    category: 'ALL',
    dateSort: 'asc'
  }
};

const EVENT_VIEW_MAP = {
  month: 'Month',
  week: 'Week',
  day: 'Day'
};

async function initApp() {
  setupIntro();
  setupHeader();
  renderPlayers();
  bindCalendarControls();
  bindAdminControls();
  bindPlayerModal();
  bindNavLinks();
  syncAdminVisibility();
  initEventForm();
  await restoreAdminSession();
  await loadEvents();
}

function setupIntro() {
  const overlay = document.getElementById('introOverlay');
  const skipBtn = document.getElementById('skipIntroBtn');
  if (!overlay || !skipBtn) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasSeenIntro = sessionStorage.getItem('reignite-intro-seen') === 'true';

  if (hasSeenIntro || reducedMotion) {
    overlay.classList.add('hidden');
    return;
  }

  sessionStorage.setItem('reignite-intro-seen', 'true');
  const finishIntro = () => {
    if (overlay.classList.contains('hidden') || overlay.classList.contains('is-exiting')) return;
    overlay.classList.add('is-exiting');
    window.setTimeout(() => overlay.classList.add('hidden'), 850);
  };

  window.setTimeout(finishIntro, 5600);
  skipBtn.addEventListener('click', finishIntro);
}

function setupHeader() {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }
}

function bindNavLinks() {
  const navLinks = document.querySelectorAll('.main-nav a');
  const sections = [...document.querySelectorAll('main section[id]')];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          const hash = link.getAttribute('href');
          link.classList.toggle('active', hash === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.45 });

  sections.forEach((section) => observer.observe(section));
}

function renderPlayers() {
  const grid = document.getElementById('playersGrid');
  if (!grid) return;

  grid.innerHTML = players.map((player) => `
    <article class="player-card" data-player-id="${player.id}">
      <div class="player-photo">
        <img class="player-avatar" src="${player.image}" alt="${player.name} player portrait" loading="lazy" decoding="async" />
        <span class="player-photo-tag">${player.name}</span>
      </div>
      <div class="player-card-content">
        <h3 class="player-name">${player.name}</h3>
        <div class="player-role">${player.role}</div>
        <div class="player-meta">
          <span>DOB</span>
          <strong>${player.dob}</strong>
        </div>
        <p class="player-summary">${player.summary}</p>
        <div class="player-actions">
          <a class="social-link" href="${player.tiktok}" target="_blank" rel="noreferrer">TikTok</a>
          <button class="player-view-btn" type="button" data-player-id="${player.id}">View Profile</button>
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.player-view-btn').forEach((button) => {
    button.addEventListener('click', () => openPlayerModal(button.dataset.playerId));
  });
}

function openPlayerModal(playerId) {
  const player = players.find((item) => item.id === playerId);
  const modal = document.getElementById('playerModal');
  const content = document.getElementById('playerModalContent');
  if (!player || !modal || !content) return;

  content.innerHTML = `
    <div class="player-modal-body">
      <div class="player-modal-visual">
        <img src="${player.image}" alt="${player.name} player portrait" />
      </div>
      <div class="player-modal-content">
        <h3>${player.name}</h3>
        <div class="player-modal-role">${player.role}</div>
        <div class="player-meta-block">
          <div><strong>Date of Birth:</strong> ${player.dob}</div>
        </div>
        <a class="social-link" href="${player.tiktok}" target="_blank" rel="noreferrer">Open TikTok</a>
        <ul>
          ${player.achievements.map((achievement) => `<li>${achievement}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;

  modal.setAttribute('aria-hidden', 'false');
}

function bindPlayerModal() {
  const modal = document.getElementById('playerModal');
  const closeBtn = modal?.querySelector('.modal-close');
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', () => modal.setAttribute('aria-hidden', 'true'));
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.setAttribute('aria-hidden', 'true');
  });
}

function getEvents() {
  return appState.events;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function safeExternalUrl(value) {
  if (!value) return '';

  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

async function loadEvents() {
  if (!supabase) {
    appState.eventError = 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local.';
    appState.eventsLoaded = true;
    renderCalendar();
    return false;
  }

  appState.eventsLoaded = false;
  appState.eventError = '';
  renderCalendar();

  let data;
  let error;
  try {
    ({ data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true })
      .order('start_time', { ascending: true }));
  } catch (loadError) {
    appState.eventError = `Unable to load events: ${loadError.message}`;
    appState.events = [];
    appState.eventsLoaded = true;
    renderCalendar();
    if (appState.adminLoggedIn) renderAdminEvents();
    return false;
  }

  if (error) {
    if (error.code === 'PGRST205') {
      appState.eventError = 'Supabase cannot find schedule.events. Expose the schedule schema in the Supabase API settings and run supabase/schema.sql.';
    } else if (error.code === '42501' || error.code === 'PGRST106') {
      appState.eventError = 'Supabase denied access to the schedule schema. Add schedule to Exposed schemas and run supabase/schema.sql to apply grants and RLS policies.';
    } else {
      appState.eventError = `Unable to load events: ${error.message}`;
    }
    appState.events = [];
  } else {
    appState.events = data || [];
  }

  appState.eventsLoaded = true;
  renderCalendar();
  if (appState.adminLoggedIn) renderAdminEvents();
  return !appState.eventError;
}

function sortEvents(events) {
  return [...events].sort((a, b) => {
    const dateOrder = a.start_date.localeCompare(b.start_date);
    if (dateOrder !== 0) return dateOrder;
    return (a.start_time || '').localeCompare(b.start_time || '');
  });
}

function formatDate(dateString, options = { month: 'short', day: 'numeric' }) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

function formatEventDateRange(event) {
  const sameDay = event.start_date === event.end_date;
  const startTime = (event.start_time || '').slice(0, 5);
  const endTime = (event.end_time || '').slice(0, 5);
  if (sameDay) {
    return `${formatDate(event.start_date, { month: 'short', day: 'numeric' })} • ${startTime} - ${endTime}`;
  }
  return `${formatDate(event.start_date, { month: 'short', day: 'numeric' })} ${startTime} - ${formatDate(event.end_date, { month: 'short', day: 'numeric' })} ${endTime}`;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function eventOccursOnDate(event, dateKey) {
  return event.start_date <= dateKey && event.end_date >= dateKey;
}

function isUpcoming(event) {
  const today = toDateKey(new Date());
  if (event.end_date < today) return false;
  if (event.start_date > today) return true;
  if (event.end_date > today) return true;
  const currentTime = new Date().toTimeString().slice(0, 5);
  return (event.end_time || '00:00').slice(0, 5) >= currentTime;
}

function renderCalendar() {
  const calendarGrid = document.getElementById('calendarGrid');
  const eventList = document.getElementById('eventList');
  const label = document.getElementById('calendarLabel');

  if (!calendarGrid || !eventList || !label) return;

  label.textContent = `${EVENT_VIEW_MAP[appState.activeView]} • ${new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(appState.currentMonth)}`;

  const events = sortEvents(getEvents());
  const upcoming = events.filter(isUpcoming);

  if (appState.activeView === 'month') {
    const startOfMonth = new Date(appState.currentMonth.getFullYear(), appState.currentMonth.getMonth(), 1);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - ((startOfMonth.getDay() + 6) % 7));

    const weekHeader = `
      <div class="calendar-weekdays">
        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
      </div>
    `;

    const cells = [];
    for (let i = 0; i < 42; i += 1) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateKey = toDateKey(date);
      const dayEvents = events.filter((event) => eventOccursOnDate(event, dateKey));
      const classes = ['calendar-day'];
      if (date.getMonth() !== appState.currentMonth.getMonth()) classes.push('is-other-month');
      if (toDateKey(new Date()) === dateKey) classes.push('is-today');
      if (toDateKey(appState.selectedDate) === dateKey) classes.push('selected');

      const labels = dayEvents.slice(0, 2).map((event) => `
        <span class="day-event-type">${escapeHtml(event.title)}</span>
      `).join('');

      cells.push(`
        <button type="button" class="${classes.join(' ')}" data-date="${dateKey}" aria-label="Select ${dateKey}">
          <span class="day-number">${date.getDate()}</span>
          ${dayEvents.length ? '<span class="day-event-dot"></span>' : ''}
          ${labels}
        </button>
      `);
    }

    calendarGrid.innerHTML = `${weekHeader}<div class="calendar-row">${cells.join('')}</div>`;
  } else {
    const range = getVisibleDatesForView();
    const items = range.map((date) => {
      const dateKey = toDateKey(date);
      const dayEvents = events.filter((event) => eventOccursOnDate(event, dateKey));
      const classes = ['calendar-day'];
      if (toDateKey(appState.selectedDate) === dateKey) classes.push('selected');

      return `
        <button type="button" class="${classes.join(' ')}" data-date="${dateKey}" aria-label="Select ${dateKey}">
          <span class="day-number">${date.getDate()}</span>
          ${dayEvents.length ? '<span class="day-event-dot"></span>' : ''}
          ${dayEvents.slice(0, 2).map((event) => `<span class="day-event-type">${escapeHtml(event.title)}</span>`).join('')}
        </button>
      `;
    }).join('');

    calendarGrid.innerHTML = `<div class="calendar-row">${items}</div>`;
  }

  const selectedDateKey = toDateKey(appState.selectedDate);
  const selectedEvents = events.filter((event) => eventOccursOnDate(event, selectedDateKey));

  const list = selectedEvents.length ? selectedEvents : upcoming.slice(0, 4);
  if (!appState.eventsLoaded) {
    eventList.innerHTML = '<div class="empty-state loading-state" role="status" aria-live="polite">Loading events…</div>';
  } else if (appState.eventError) {
    eventList.innerHTML = `<div class="empty-state error-state" role="alert">${escapeHtml(appState.eventError)}</div>`;
  } else if (!list.length) {
    eventList.innerHTML = '<div class="empty-state">No upcoming events. Sign in as an authorized admin to schedule one.</div>';
  } else {
    eventList.innerHTML = list.map((event) => `
      <article class="event-item">
        <div class="event-item-header">
          <span class="event-badge ${escapeHtml(event.category.toLowerCase())}">${escapeHtml(event.category)}</span>
        </div>
        <h4>${escapeHtml(event.title)}</h4>
        <p>${escapeHtml(event.description)}</p>
        <p>${escapeHtml(formatEventDateRange(event))}</p>
        <p>${escapeHtml(event.location)}</p>
        ${safeExternalUrl(event.external_url) ? `<a href="${escapeHtml(safeExternalUrl(event.external_url))}" target="_blank" rel="noreferrer">Open Link</a>` : ''}
      </article>
    `).join('');
  }

  updateDashboardStats();
  bindDateButtons();
}

function getVisibleDatesForView() {
  if (appState.activeView === 'week') {
    const day = new Date(appState.selectedDate);
    const diff = (day.getDay() + 6) % 7;
    const start = new Date(day);
    start.setDate(day.getDate() - diff);
    return Array.from({ length: 7 }, (_, index) => {
      const next = new Date(start);
      next.setDate(start.getDate() + index);
      return next;
    });
  }

  if (appState.activeView === 'day') {
    return [new Date(appState.selectedDate)];
  }

  return [];
}

function bindDateButtons() {
  document.querySelectorAll('.calendar-day').forEach((button) => {
    button.addEventListener('click', () => {
      appState.selectedDate = new Date(`${button.dataset.date}T12:00:00`);
      renderCalendar();
    });
  });
}

function bindCalendarControls() {
  document.querySelectorAll('.view-btn').forEach((button) => {
    button.addEventListener('click', () => {
      appState.activeView = button.dataset.view;
      document.querySelectorAll('.view-btn').forEach((item) => item.classList.toggle('active', item === button));
      renderCalendar();
    });
  });

  document.getElementById('prevPeriodBtn')?.addEventListener('click', () => {
    if (appState.activeView === 'month') {
      appState.currentMonth = new Date(appState.currentMonth.getFullYear(), appState.currentMonth.getMonth() - 1, 1);
    } else {
      const offset = appState.activeView === 'week' ? 7 : 1;
      appState.selectedDate = new Date(appState.selectedDate.getTime());
      appState.selectedDate.setDate(appState.selectedDate.getDate() - offset);
    }
    renderCalendar();
  });

  document.getElementById('nextPeriodBtn')?.addEventListener('click', () => {
    if (appState.activeView === 'month') {
      appState.currentMonth = new Date(appState.currentMonth.getFullYear(), appState.currentMonth.getMonth() + 1, 1);
    } else {
      const offset = appState.activeView === 'week' ? 7 : 1;
      appState.selectedDate = new Date(appState.selectedDate.getTime());
      appState.selectedDate.setDate(appState.selectedDate.getDate() + offset);
    }
    renderCalendar();
  });

  document.getElementById('openAdminFromSchedule')?.addEventListener('click', () => openAdmin());
}

function updateDashboardStats() {
  const events = getEvents();
  const upcoming = events.filter(isUpcoming);

  const totalUpcomingCount = document.getElementById('totalUpcomingCount');
  const streamCount = document.getElementById('streamCount');
  const tournamentCount = document.getElementById('tournamentCount');

  if (totalUpcomingCount) totalUpcomingCount.textContent = String(upcoming.length);
  if (streamCount) streamCount.textContent = String(upcoming.filter((event) => event.category === 'STREAM').length);
  if (tournamentCount) tournamentCount.textContent = String(upcoming.filter((event) => event.category === 'TOURNAMENT').length);
}

function initEventForm() {
  const form = document.getElementById('eventForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!appState.adminLoggedIn || !supabase) {
      setAdminStatus('Sign in with an authorized admin account to manage events.', true);
      return;
    }

    const id = document.getElementById('eventId').value;
    const title = document.getElementById('eventTitle').value.trim();
    const description = document.getElementById('eventDescription').value.trim();
    const category = document.getElementById('eventCategory').value;
    const startDate = document.getElementById('eventStartDate').value;
    const endDate = document.getElementById('eventEndDate').value;
    const startTime = document.getElementById('eventStartTime').value;
    const endTime = document.getElementById('eventEndTime').value;
    const location = document.getElementById('eventLocation').value.trim();
    const externalUrl = document.getElementById('eventExternalUrl').value.trim();
    const validationStatus = 'eventValidation';
    setAdminStatus('');

    if (!title || !startDate || !startTime || !endDate || !endTime) {
      setAdminStatus('Enter an event title, start date and time, and end date and time.', true, validationStatus);
      return;
    }

    if (`${endDate}T${endTime}` <= `${startDate}T${startTime}`) {
      setAdminStatus('End date and time must be later than the start date and time.', true, validationStatus);
      return;
    }

    if (externalUrl && !safeExternalUrl(externalUrl)) {
      setAdminStatus('Enter a valid external URL starting with http:// or https://.', true, validationStatus);
      return;
    }

    if (!['STREAM', 'TOURNAMENT', 'ANNOUNCEMENT', 'COMMUNITY'].includes(category)) {
      setAdminStatus('Select a valid event category.', true, validationStatus);
      return;
    }

    const record = {
      title,
      description: description || '',
      category,
      id: id || crypto.randomUUID(),
      start_date: startDate,
      start_time: startTime,
      end_date: endDate,
      end_time: endTime,
      location: location || '',
      external_url: externalUrl
    };

    const saveButton = form.querySelector('button[type="submit"]');
    if (saveButton.disabled) return;
    saveButton.disabled = true;
    setAdminStatus(id ? 'Updating event…' : 'Creating event...');

    let result;
    try {
      result = id
        ? await supabase.from('events').update(record).eq('id', id).select().single()
        : await supabase.from('events').insert(record).select().single();
    } catch (saveError) {
      saveButton.disabled = false;
      setAdminStatus(`Unable to save event: ${saveError.message}`, true);
      return;
    }

    saveButton.disabled = false;
    if (result.error) {
      setAdminStatus(`Unable to save event: ${result.error.message}`, true);
      return;
    }

    const refreshed = await loadEvents();
    if (refreshed) {
      setAdminStatus(id ? 'Event updated successfully.' : 'Event created successfully.');
    } else {
      setAdminStatus(`Event was saved, but the list could not be refreshed: ${appState.eventError}`, true);
    }
    resetEventForm();
  });

  document.getElementById('resetEventFormBtn')?.addEventListener('click', resetEventForm);
  document.getElementById('eventSearch')?.addEventListener('input', (event) => {
    appState.eventFilters.query = event.target.value.trim().toLowerCase();
    renderAdminEvents();
  });
  document.getElementById('eventCategoryFilter')?.addEventListener('change', (event) => {
    appState.eventFilters.category = event.target.value;
    renderAdminEvents();
  });
  document.getElementById('eventDateSort')?.addEventListener('change', (event) => {
    appState.eventFilters.dateSort = event.target.value;
    renderAdminEvents();
  });
}

function resetEventForm() {
  const form = document.getElementById('eventForm');
  if (!form) return;
  form.reset();
  document.getElementById('eventId').value = '';
  document.getElementById('eventFormTitle').textContent = 'Create Event';
  document.getElementById('eventCategory').value = 'STREAM';
  setAdminStatus('', false, 'eventValidation');
}

function renderAdminEvents() {
  const tableWrap = document.getElementById('adminEventTable');
  if (!tableWrap) return;

  const { query, category, dateSort } = appState.eventFilters;
  const events = sortEvents(getEvents())
    .filter((event) => !query || event.title.toLowerCase().includes(query))
    .filter((event) => category === 'ALL' || event.category === category);
  if (dateSort === 'desc') events.reverse();

  if (!appState.eventsLoaded && !appState.eventError) {
    tableWrap.innerHTML = '<div class="empty-state loading-state" role="status" aria-live="polite">Loading events…</div>';
    return;
  }

  if (appState.eventError) {
    tableWrap.innerHTML = `<div class="empty-state error-state" role="alert">${escapeHtml(appState.eventError)}</div>`;
    return;
  }

  if (!events.length) {
    tableWrap.innerHTML = '<div class="empty-state">No events match these filters.</div>';
    return;
  }

  tableWrap.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Title</th>
          <th>Description</th>
          <th>Start</th>
          <th>End</th>
          <th>Location</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${events.map((event) => `
          <tr>
            <td>${escapeHtml(event.category)}</td>
            <td>${escapeHtml(event.title)}</td>
            <td class="admin-event-description">${escapeHtml(event.description || '—')}</td>
            <td>${escapeHtml(formatDate(event.start_date, { year: 'numeric', month: 'short', day: 'numeric' }))} ${escapeHtml((event.start_time || '').slice(0, 5))}</td>
            <td>${escapeHtml(formatDate(event.end_date, { year: 'numeric', month: 'short', day: 'numeric' }))} ${escapeHtml((event.end_time || '').slice(0, 5))}</td>
            <td>${escapeHtml(event.location)}</td>
            <td class="table-actions">
              <button class="small-btn" type="button" data-edit-event="${escapeHtml(event.id)}">Edit</button>
              <button class="small-btn danger" type="button" data-delete-event="${escapeHtml(event.id)}">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  tableWrap.querySelectorAll('[data-edit-event]').forEach((button) => {
    button.addEventListener('click', () => {
      loadEventForEdit(button.dataset.editEvent);
      document.getElementById('eventFormTitle').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  tableWrap.querySelectorAll('[data-delete-event]').forEach((button) => {
    button.addEventListener('click', () => deleteEvent(button.dataset.deleteEvent));
  });
}

function loadEventForEdit(id) {
  const event = getEvents().find((item) => item.id === id);
  if (!event) return;

  document.getElementById('eventId').value = event.id;
  document.getElementById('eventFormTitle').textContent = 'Edit Event';
  document.getElementById('eventCategory').value = event.category;
  document.getElementById('eventTitle').value = event.title;
  document.getElementById('eventDescription').value = event.description || '';
  document.getElementById('eventStartDate').value = event.start_date;
  document.getElementById('eventEndDate').value = event.end_date;
  document.getElementById('eventStartTime').value = event.start_time;
  document.getElementById('eventEndTime').value = event.end_time;
  document.getElementById('eventLocation').value = event.location || '';
  document.getElementById('eventExternalUrl').value = event.external_url || '';
  setAdminStatus('');
  document.getElementById('eventForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function deleteEvent(id) {
  if (!window.confirm('Delete this event?')) return;

  const deleteButton = document.querySelector(`[data-delete-event="${CSS.escape(id)}"]`);
  if (deleteButton?.disabled) return;
  if (deleteButton) deleteButton.disabled = true;

  let error;
  try {
    ({ error } = await supabase.from('events').delete().eq('id', id));
  } catch (deleteError) {
    if (deleteButton) deleteButton.disabled = false;
    setAdminStatus(`Unable to delete event: ${deleteError.message}`, true);
    return;
  }
  if (error) {
    if (deleteButton) deleteButton.disabled = false;
    setAdminStatus(`Unable to delete event: ${error.message}`, true);
    return;
  }

  const refreshed = await loadEvents();
  if (refreshed) {
    setAdminStatus('Event deleted.');
  } else {
    setAdminStatus(`Event was deleted, but the list could not be refreshed: ${appState.eventError}`, true);
  }
  if (document.getElementById('eventId').value === id) resetEventForm();
}

function setAdminStatus(message, isError = false, targetId = 'adminStatus') {
  const status = document.getElementById(targetId);
  if (!status) return;
  status.textContent = message;
  status.classList.toggle('error-state', isError);
  status.classList.toggle('success-state', Boolean(message) && !isError);
}

async function checkEventAdmin(userId) {
  try {
    const { data, error } = await publicSupabase
      .from('event_admins')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();

    return { isAdmin: Boolean(data), error };
  } catch (error) {
    return {
      isAdmin: false,
      error: error instanceof Error ? error : new Error('Unable to verify admin access.')
    };
  }
}

async function restoreAdminSession() {
  if (!supabase) return;

  let data;
  let error;
  try {
    ({ data, error } = await supabase.auth.getSession());
  } catch (sessionError) {
    setAdminStatus(`Unable to restore admin session: ${sessionError.message}`, true, 'loginStatus');
    return;
  }
  if (error) {
    setAdminStatus(`Unable to restore admin session: ${error.message}`, true, 'loginStatus');
    return;
  }
  if (!data.session?.user) return;

  const { isAdmin, error: roleError } = await checkEventAdmin(data.session.user.id);
  if (roleError) {
    setAdminStatus(`Unable to verify admin access: ${roleError.message}`, true, 'loginStatus');
    return;
  }
  if (!isAdmin) {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setAdminStatus(`This account is not an event admin, and sign out failed: ${signOutError.message}`, true, 'loginStatus');
    }
    return;
  }

  appState.adminLoggedIn = true;
  appState.adminUserId = data.session.user.id;
  syncAdminVisibility();
}

function bindAdminControls() {
  const adminBtn = document.getElementById('adminOpenBtn');
  const loginModal = document.getElementById('loginModal');
  const closeLogin = loginModal?.querySelector('.modal-close');
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutAdminBtn');

  adminBtn?.addEventListener('click', () => openAdmin());

  closeLogin?.addEventListener('click', () => loginModal.setAttribute('aria-hidden', 'true'));
  loginModal?.addEventListener('click', (event) => {
    if (event.target === loginModal) loginModal.setAttribute('aria-hidden', 'true');
  });

  loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!supabase) {
      setAdminStatus('Supabase is not configured. Add the required VITE_SUPABASE_* values.', true, 'loginStatus');
      return;
    }

    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value.trim();

    const submitButton = loginForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    setAdminStatus('Signing in…', false, 'loginStatus');

    let data;
    let error;
    try {
      ({ data, error } = await supabase.auth.signInWithPassword({ email, password }));
    } catch (signInError) {
      submitButton.disabled = false;
      setAdminStatus(`Unable to sign in: ${signInError.message}`, true, 'loginStatus');
      return;
    }
    if (error) {
      submitButton.disabled = false;
      setAdminStatus(error.message, true, 'loginStatus');
      return;
    }

    const { isAdmin, error: roleError } = await checkEventAdmin(data.user.id);
    if (roleError || !isAdmin) {
      const { error: signOutError } = await supabase.auth.signOut();
      submitButton.disabled = false;
      setAdminStatus(
        roleError
          ? `Unable to verify admin access: ${roleError.message}${signOutError ? ` Sign out failed: ${signOutError.message}` : ''}`
          : `This account does not have event admin access.${signOutError ? ` Sign out failed: ${signOutError.message}` : ''}`,
        true,
        'loginStatus'
      );
      return;
    }

    appState.adminLoggedIn = true;
    appState.adminUserId = data.user.id;
    syncAdminVisibility();
    loginModal.setAttribute('aria-hidden', 'true');
    loginForm.reset();
    submitButton.disabled = false;
    setAdminStatus('');
    setAdminStatus('Signed in. Event management is ready.');
  });

  logoutBtn?.addEventListener('click', async () => {
    let error;
    try {
      ({ error } = await supabase.auth.signOut());
    } catch (signOutError) {
      setAdminStatus(`Unable to sign out: ${signOutError.message}`, true);
      return;
    }
    if (error) {
      setAdminStatus(`Unable to sign out: ${error.message}`, true);
      return;
    }

    appState.adminLoggedIn = false;
    appState.adminUserId = null;
    syncAdminVisibility();
    renderCalendar();
    setAdminStatus('');
  });
}

function syncAdminVisibility() {
  const adminPanel = document.getElementById('adminPanel');
  const loginModal = document.getElementById('loginModal');

  if (appState.adminLoggedIn) {
    adminPanel?.classList.add('visible');
    adminPanel?.classList.remove('hidden');
    loginModal?.setAttribute('aria-hidden', 'true');
    renderAdminEvents();
  } else {
    adminPanel?.classList.remove('visible');
    adminPanel?.classList.add('hidden');
  }
}

function openAdmin() {
  if (appState.adminLoggedIn) {
    const adminPanel = document.getElementById('adminPanel');
    adminPanel?.classList.remove('hidden');
    adminPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    renderAdminEvents();
    return;
  }

  const modal = document.getElementById('loginModal');
  if (modal) modal.setAttribute('aria-hidden', 'false');
}

window.addEventListener('DOMContentLoaded', initApp);
