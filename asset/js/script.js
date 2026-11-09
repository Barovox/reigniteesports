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
    image: 'asset/image/Tuan18.png',
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
    image: 'asset/image/NomK3.png',
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
    image: 'asset/image/BoyTi.png',
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
    image: 'asset/image/LongH.png',
    initials: 'L'
  }
];

const EVENT_STORAGE_KEY = 'reignite-events';
const ADMIN_SESSION_KEY = 'reignite-admin-session';

const defaultEvents = [
  {
    id: 'evt-1',
    title: 'RN Community Stream',
    description: 'Community showcase and team updates with match analysis.',
    category: 'STREAM',
    start_date: '2026-11-12',
    start_time: '19:00',
    end_date: '2026-11-12',
    end_time: '20:30',
    location: 'Twitch',
    external_url: 'https://www.twitch.tv/',
    created_at: '2026-11-10T09:00:00.000Z',
    updated_at: '2026-11-10T09:00:00.000Z'
  },
  {
    id: 'evt-2',
    title: 'PUBG Mobile Scrim vs. Rising Stars',
    description: 'Official scrim and team performance review ahead of the next qualifier.',
    category: 'TOURNAMENT',
    start_date: '2026-11-18',
    start_time: '18:00',
    end_date: '2026-11-18',
    end_time: '21:00',
    location: 'RN Training Facility',
    external_url: '',
    created_at: '2026-11-10T09:15:00.000Z',
    updated_at: '2026-11-10T09:15:00.000Z'
  }
];

const appState = {
  activeView: 'month',
  selectedDate: new Date(),
  currentMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  adminLoggedIn: localStorage.getItem(ADMIN_SESSION_KEY) === 'true'
};

const EVENT_VIEW_MAP = {
  month: 'Month',
  week: 'Week',
  day: 'Day'
};

function initApp() {
  setupIntro();
  setupHeader();
  renderPlayers();
  renderCalendar();
  bindCalendarControls();
  bindAdminControls();
  bindPlayerModal();
  bindNavLinks();
  syncAdminVisibility();
  initEventForm();
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
  try {
    const stored = localStorage.getItem(EVENT_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(defaultEvents));
      return [...defaultEvents];
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : [...defaultEvents];
  } catch {
    localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(defaultEvents));
    return [...defaultEvents];
  }
}

function sortEvents(events) {
  return [...events].sort((a, b) => {
    const aDateTime = new Date(`${a.start_date}T${a.start_time || '00:00'}`);
    const bDateTime = new Date(`${b.start_date}T${b.start_time || '00:00'}`);
    return aDateTime - bDateTime;
  });
}

function formatDate(dateString, options = { month: 'short', day: 'numeric' }) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

function formatEventDateRange(event) {
  const sameDay = event.start_date === event.end_date;
  if (sameDay) {
    return `${formatDate(event.start_date, { month: 'short', day: 'numeric' })} • ${event.start_time} - ${event.end_time}`;
  }
  return `${formatDate(event.start_date, { month: 'short', day: 'numeric' })} - ${formatDate(event.end_date, { month: 'short', day: 'numeric' })}`;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function renderCalendar() {
  const calendarGrid = document.getElementById('calendarGrid');
  const eventList = document.getElementById('eventList');
  const label = document.getElementById('calendarLabel');

  if (!calendarGrid || !eventList || !label) return;

  label.textContent = `${EVENT_VIEW_MAP[appState.activeView]} • ${new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(appState.currentMonth)}`;

  const events = sortEvents(getEvents());
  const upcoming = events.filter((event) => new Date(`${event.start_date}T${event.start_time || '00:00'}`) >= new Date(new Date().setHours(0, 0, 0, 0)));

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
      const dayEvents = events.filter((event) => {
        const eventStart = new Date(`${event.start_date}T00:00:00`);
        const eventEnd = new Date(`${event.end_date}T23:59:59`);
        return date >= eventStart && date <= eventEnd;
      });
      const classes = ['calendar-day'];
      if (date.getMonth() !== appState.currentMonth.getMonth()) classes.push('is-other-month');
      if (toDateKey(new Date()) === dateKey) classes.push('is-today');
      if (toDateKey(appState.selectedDate) === dateKey) classes.push('selected');

      const labels = dayEvents.slice(0, 2).map((event) => `
        <span class="day-event-type">${event.title}</span>
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
      const dayEvents = events.filter((event) => {
        const eventStart = new Date(`${event.start_date}T00:00:00`);
        const eventEnd = new Date(`${event.end_date}T23:59:59`);
        return date >= eventStart && date <= eventEnd;
      });
      const classes = ['calendar-day'];
      if (toDateKey(appState.selectedDate) === dateKey) classes.push('selected');

      return `
        <button type="button" class="${classes.join(' ')}" data-date="${dateKey}" aria-label="Select ${dateKey}">
          <span class="day-number">${date.getDate()}</span>
          ${dayEvents.length ? '<span class="day-event-dot"></span>' : ''}
          ${dayEvents.slice(0, 2).map((event) => `<span class="day-event-type">${event.title}</span>`).join('')}
        </button>
      `;
    }).join('');

    calendarGrid.innerHTML = `<div class="calendar-row">${items}</div>`;
  }

  const selectedDateKey = toDateKey(appState.selectedDate);
  const selectedEvents = events.filter((event) => {
    const start = new Date(`${event.start_date}T00:00:00`);
    const end = new Date(`${event.end_date}T23:59:59`);
    const selected = new Date(`${selectedDateKey}T12:00:00`);
    return selected >= start && selected <= end;
  });

  const list = selectedEvents.length ? selectedEvents : upcoming.slice(0, 4);
  if (!list.length) {
    eventList.innerHTML = '<div class="empty-state">No events scheduled. Log in as admin to create one.</div>';
  } else {
    eventList.innerHTML = list.map((event) => `
      <article class="event-item">
        <div class="event-item-header">
          <span class="event-badge ${event.category.toLowerCase()}">${event.category}</span>
        </div>
        <h4>${event.title}</h4>
        <p>${event.description}</p>
        <p>${formatEventDateRange(event)}</p>
        <p>${event.location}</p>
        ${event.external_url ? `<a href="${event.external_url}" target="_blank" rel="noreferrer">Open Link</a>` : ''}
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
  const upcoming = events.filter((event) => new Date(`${event.start_date}T${event.start_time || '00:00'}`) >= new Date(new Date().setHours(0, 0, 0, 0)));

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

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!appState.adminLoggedIn) {
      alert('Please sign in to manage events.');
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

    if (!title || !description || !startDate || !endDate || !startTime || !endTime || !location) {
      alert('Please complete all required fields.');
      return;
    }

    if (new Date(`${startDate}T${startTime}`) > new Date(`${endDate}T${endTime}`)) {
      alert('End date and time must be after start date and time.');
      return;
    }

    const now = new Date().toISOString();
    const events = getEvents();
    const record = {
      id: id || `evt-${Date.now()}`,
      title,
      description,
      category,
      start_date: startDate,
      start_time: startTime,
      end_date: endDate,
      end_time: endTime,
      location,
      external_url: externalUrl,
      created_at: id ? events.find((item) => item.id === id)?.created_at || now : now,
      updated_at: now
    };

    const nextEvents = id ? events.map((item) => (item.id === id ? record : item)) : [...events, record];
    localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(sortEvents(nextEvents)));
    renderCalendar();
    renderAdminEvents();
    resetEventForm();
  });

  document.getElementById('resetEventFormBtn')?.addEventListener('click', resetEventForm);
}

function resetEventForm() {
  const form = document.getElementById('eventForm');
  if (!form) return;
  form.reset();
  document.getElementById('eventId').value = '';
  document.getElementById('eventFormTitle').textContent = 'Create Event';
  document.getElementById('eventCategory').value = 'STREAM';
}

function renderAdminEvents() {
  const tableWrap = document.getElementById('adminEventTable');
  if (!tableWrap) return;

  const events = sortEvents(getEvents());
  if (!events.length) {
    tableWrap.innerHTML = '<div class="empty-state">No events found.</div>';
    return;
  }

  tableWrap.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Title</th>
          <th>Date</th>
          <th>Location</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${events.map((event) => `
          <tr>
            <td>${event.category}</td>
            <td>${event.title}</td>
            <td>${formatEventDateRange(event)}</td>
            <td>${event.location}</td>
            <td class="table-actions">
              <button class="small-btn" type="button" data-edit-event="${event.id}">Edit</button>
              <button class="small-btn danger" type="button" data-delete-event="${event.id}">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  tableWrap.querySelectorAll('[data-edit-event]').forEach((button) => {
    button.addEventListener('click', () => loadEventForEdit(button.dataset.editEvent));
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
  document.getElementById('eventDescription').value = event.description;
  document.getElementById('eventStartDate').value = event.start_date;
  document.getElementById('eventEndDate').value = event.end_date;
  document.getElementById('eventStartTime').value = event.start_time;
  document.getElementById('eventEndTime').value = event.end_time;
  document.getElementById('eventLocation').value = event.location;
  document.getElementById('eventExternalUrl').value = event.external_url || '';
  document.getElementById('eventForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteEvent(id) {
  if (!window.confirm('Delete this event?')) return;

  const nextEvents = getEvents().filter((event) => event.id !== id);
  localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(sortEvents(nextEvents)));
  renderCalendar();
  renderAdminEvents();
  if (document.getElementById('eventId').value === id) resetEventForm();
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

  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value.trim();

    if (email === 'admin@reigniteesports.com' && password === 'reignite2026') {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      appState.adminLoggedIn = true;
      syncAdminVisibility();
      loginModal.setAttribute('aria-hidden', 'true');
      document.getElementById('loginForm').reset();
      renderAdminEvents();
    } else {
      alert('Invalid credentials.');
    }
  });

  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    appState.adminLoggedIn = false;
    syncAdminVisibility();
    renderCalendar();
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
