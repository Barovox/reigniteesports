import { publicSupabase, supabase } from './supabase.js';
import { saveEventRecord, validateEventInput } from './event-service.js';

const translations = {
  'intro.skip': ['Skip Intro', 'Bỏ qua giới thiệu'],
  'intro.online': ['SYSTEM ONLINE', 'HỆ THỐNG ĐÃ SẴN SÀNG'],
  'nav.home': ['Home', 'Trang chủ'],
  'nav.homeAria': ['Reignite Esports Home', 'Trang chủ Reignite Esports'],
  'nav.about': ['About', 'Giới thiệu'],
  'nav.players': ['Players', 'Tuyển thủ'],
  'nav.creators': ['Content Creators', 'Nhà sáng tạo nội dung'],
  'nav.achievements': ['Achievements', 'Thành tích'],
  'nav.schedule': ['Schedule', 'Lịch thi đấu'],
  'nav.admin': ['Admin', 'Quản trị'],
  'hero.description': ['A competitive esports organization driven by passion, ambition, and the pursuit of excellence.', 'Tổ chức esports chuyên nghiệp được dẫn dắt bởi đam mê, khát vọng và tinh thần chinh phục những đỉnh cao.'],
  'hero.explore': ['Explore Our Team', 'Khám phá đội tuyển'],
  'hero.viewAchievements': ['View Achievements', 'Xem thành tích'],
  'hero.featured': ['FEATURED ACHIEVEMENT', 'THÀNH TÍCH NỔI BẬT'],
  'hero.place': ['4TH PLACE', 'HẠNG 4'],
  'about.eyebrow': ['ABOUT', 'VỀ CHÚNG TÔI'],
  'about.intro1': ['Reignite Esports (RN) was founded in April 2026 with a clear ambition: to become one of the leading esports organizations by building a competitive ecosystem that connects talented players, passionate fans, and the next generation of esports enthusiasts.', 'Reignite Esports (RN) được thành lập vào tháng 4 năm 2026 với khát vọng trở thành một trong những tổ chức esports hàng đầu, xây dựng hệ sinh thái thi đấu kết nối tuyển thủ tài năng, người hâm mộ nhiệt thành và thế hệ đam mê esports tiếp theo.'],
  'about.intro2': ['Our focus is on developing competitive talent, fostering a strong community, creating professional opportunities, and expanding into emerging esports titles with discipline and competitive excellence at the core.', 'Chúng tôi tập trung phát triển tài năng thi đấu, xây dựng cộng đồng vững mạnh, tạo cơ hội nghề nghiệp chuyên nghiệp và mở rộng sang các bộ môn esports tiềm năng, với kỷ luật và thành tích thi đấu làm nền tảng.'],
  'about.founded': ['Founded', 'Thành lập'],
  'about.primaryTitle': ['Primary Title', 'Bộ môn chính'],
  'about.organization': ['Organization', 'Tổ chức'],
  'about.vision': ['Vision', 'Tầm nhìn'],
  'about.visionText': ['To become one of the leading esports organizations in PUBG Mobile, building a competitive ecosystem that connects talented players, passionate fans, and the next generation of esports enthusiasts.', 'Trở thành một trong những tổ chức esports hàng đầu PUBG Mobile, xây dựng hệ sinh thái thi đấu kết nối tuyển thủ tài năng, người hâm mộ nhiệt thành và thế hệ đam mê esports tiếp theo.'],
  'about.mission': ['Mission', 'Sứ mệnh'],
  'about.mission1': ['Develop competitive esports talent.', 'Phát triển tài năng thi đấu esports.'],
  'about.mission2': ['Build a strong and passionate community.', 'Xây dựng cộng đồng vững mạnh và nhiệt huyết.'],
  'about.mission3': ['Create professional opportunities for players and content creators.', 'Tạo cơ hội nghề nghiệp chuyên nghiệp cho tuyển thủ và nhà sáng tạo nội dung.'],
  'about.mission4': ['Expand into other promising esports titles.', 'Mở rộng sang các bộ môn esports tiềm năng khác.'],
  'about.mission5': ['Establish a recognizable esports brand in the regional market.', 'Xây dựng thương hiệu esports có dấu ấn tại thị trường khu vực.'],
  'players.eyebrow': ['TEAM ROSTER', 'ĐỘI HÌNH'],
  'players.title': ['Players', 'Tuyển thủ'],
  'player.dob': ['DOB', 'Ngày sinh'],
  'player.dateOfBirth': ['Date of Birth:', 'Ngày sinh:'],
  'player.viewProfile': ['View Profile', 'Xem hồ sơ'],
  'player.openTiktok': ['Open TikTok', 'Mở TikTok'],
  'creators.eyebrow': ['CONTENT CREATOR', 'NHÀ SÁNG TẠO NỘI DUNG'],
  'creators.title': ['Official Media', 'Truyền thông chính thức'],
  'creators.role': ['Official Content Creator', 'Nhà sáng tạo nội dung chính thức'],
  'creators.tiktok': ['TikTok Profile', 'Trang TikTok'],
  'achievements.eyebrow': ['ACHIEVEMENTS', 'THÀNH TÍCH'],
  'achievements.title': ['Milestones', 'Dấu ấn'],
  'achievements.teamEyebrow': ['TEAM ACHIEVEMENT', 'THÀNH TÍCH ĐỘI TUYỂN'],
  'achievements.placement': ['Final Placement', 'Thứ hạng chung cuộc'],
  'achievements.team': ['Team Achievements', 'Thành tích đội tuyển'],
  'achievements.individual': ['Individual Achievements', 'Thành tích cá nhân'],
  'achievement.team1': ['4th Place – PUBG Mobile Pro League Vietnam Fall 2026', 'Hạng 4 – PUBG Mobile Pro League Việt Nam Mùa Thu 2026'],
  'achievement.master': ['Recognized Esports Master (Kiện Tướng Thể thao Điện tử)', 'Được công nhận danh hiệu Kiện Tướng Thể thao Điện tử'],
  'achievement.individual1': ['2nd Place – PUBG Mobile National Championship Vietnam 2024', 'Hạng 2 – Giải Vô địch Quốc gia PUBG Mobile Việt Nam 2024'],
  'achievement.individual2': ['2nd Place – PUBG Mobile National Championship Vietnam Fall 2025', 'Hạng 2 – Giải Vô địch Quốc gia PUBG Mobile Việt Nam Mùa Thu 2025'],
  'achievement.individual3': ['2nd Place – Vietnam National Esports Championship, Year-End Season 2025', 'Hạng 2 – Giải Vô địch Thể thao điện tử Quốc gia Việt Nam, Mùa cuối năm 2025'],
  'achievement.individual4': ['3rd Place – 31st Southeast Asian Games Vietnam Qualifier', 'Hạng 3 – Vòng tuyển chọn Việt Nam tại Đại hội Thể thao Đông Nam Á lần thứ 31'],
  'achievement.individual5': ['4th Place – PUBG Mobile Pro League Vietnam Spring 2022', 'Hạng 4 – PUBG Mobile Pro League Việt Nam Mùa Xuân 2022'],
  'achievement.individual6': ['4th Place – PUBG Mobile Pro League Vietnam Spring 2023', 'Hạng 4 – PUBG Mobile Pro League Việt Nam Mùa Xuân 2023'],
  'achievement.individual7': ['3rd Place – PUBG Mobile Premier Series 2023, Super Weekend 3', 'Hạng 3 – PUBG Mobile Premier Series 2023, Super Weekend 3'],
  'schedule.eyebrow': ['SCHEDULE', 'LỊCH TRÌNH'],
  'schedule.title': ['Event Calendar', 'Lịch sự kiện'],
  'schedule.callout': ['Public visitors can browse upcoming events. Administrators can manage schedule entries securely.', 'Mọi người có thể xem các sự kiện sắp tới. Quản trị viên có thể quản lý lịch trình an toàn.'],
  'schedule.openAdmin': ['Open Admin Dashboard', 'Mở trang quản trị'],
  'calendar.month': ['Month', 'Tháng'],
  'calendar.week': ['Week', 'Tuần'],
  'calendar.day': ['Day', 'Ngày'],
  'calendar.upcoming': ['Upcoming Events', 'Sự kiện sắp tới'],
  'calendar.previous': ['Previous period', 'Khoảng thời gian trước'],
  'calendar.next': ['Next period', 'Khoảng thời gian tiếp theo'],
  'calendar.noUpcoming': ['No upcoming events. Sign in as an authorized admin to schedule one.', 'Chưa có sự kiện sắp tới. Đăng nhập bằng tài khoản quản trị được cấp quyền để thêm sự kiện.'],
  'calendar.loading': ['Loading events…', 'Đang tải sự kiện…'],
  'calendar.weekdays': [['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']],
  'footer.description': ['Competitive esports organization built on passion, discipline, and ambition.', 'Tổ chức esports chuyên nghiệp được xây dựng trên đam mê, kỷ luật và khát vọng.'],
  'footer.links': ['Quick Links', 'Liên kết nhanh'],
  'footer.creator': ['Creator', 'Nhà sáng tạo'],
  'footer.copyright': ['© 2026 Reignite Esports. All Rights Reserved.', '© 2026 Reignite Esports. Bảo lưu mọi quyền.'],
  'modal.closeProfile': ['Close player profile', 'Đóng hồ sơ tuyển thủ'],
  'modal.closeLogin': ['Close admin login', 'Đóng đăng nhập quản trị'],
  'admin.access': ['Admin Access', 'Truy cập quản trị'],
  'admin.email': ['Email', 'Email'],
  'admin.password': ['Password', 'Mật khẩu'],
  'admin.signIn': ['Sign In', 'Đăng nhập'],
  'admin.dashboard': ['ADMIN DASHBOARD', 'TRANG QUẢN TRỊ'],
  'admin.management': ['Event Management', 'Quản lý sự kiện'],
  'admin.logout': ['Logout', 'Đăng xuất'],
  'admin.totalUpcoming': ['Total Upcoming Events', 'Tổng sự kiện sắp tới'],
  'admin.streams': ['Stream Events', 'Sự kiện phát trực tiếp'],
  'admin.tournaments': ['Tournament Events', 'Giải đấu'],
  'admin.createEvent': ['Create Event', 'Tạo sự kiện'],
  'admin.editEvent': ['Edit Event', 'Chỉnh sửa sự kiện'],
  'admin.category': ['Category', 'Danh mục'],
  'admin.title': ['Title', 'Tên sự kiện'],
  'admin.description': ['Description', 'Mô tả'],
  'admin.startDate': ['Start Date', 'Ngày bắt đầu'],
  'admin.endDate': ['End Date', 'Ngày kết thúc'],
  'admin.startTime': ['Start Time', 'Giờ bắt đầu'],
  'admin.endTime': ['End Time', 'Giờ kết thúc'],
  'admin.location': ['Location / Platform', 'Địa điểm / Nền tảng'],
  'admin.externalUrl': ['External URL', 'Liên kết bên ngoài'],
  'admin.save': ['Save Event', 'Lưu sự kiện'],
  'admin.reset': ['Reset', 'Làm mới'],
  'admin.records': ['Event Records', 'Danh sách sự kiện'],
  'admin.searchTitle': ['Search by title', 'Tìm theo tên sự kiện'],
  'admin.searchPlaceholder': ['Search events...', 'Tìm sự kiện...'],
  'admin.allCategories': ['All categories', 'Tất cả danh mục'],
  'admin.sortDate': ['Sort by date', 'Sắp xếp theo ngày'],
  'admin.earliest': ['Earliest first', 'Sớm nhất trước'],
  'admin.latest': ['Latest first', 'Muộn nhất trước'],
  'admin.noMatches': ['No events match these filters.', 'Không có sự kiện phù hợp với bộ lọc.'],
  'admin.loading': ['Loading events…', 'Đang tải sự kiện…'],
  'admin.tableCategory': ['Category', 'Danh mục'],
  'admin.tableTitle': ['Title', 'Tên sự kiện'],
  'admin.tableDescription': ['Description', 'Mô tả'],
  'admin.tableStart': ['Start', 'Bắt đầu'],
  'admin.tableEnd': ['End', 'Kết thúc'],
  'admin.tableLocation': ['Location', 'Địa điểm'],
  'admin.tableActions': ['Actions', 'Thao tác'],
  'admin.edit': ['Edit', 'Sửa'],
  'admin.delete': ['Delete', 'Xóa'],
  'admin.deleteConfirm': ['Delete this event?', 'Bạn có chắc muốn xóa sự kiện này không?'],
  'admin.errorTitle': ['Something went wrong', 'Đã xảy ra lỗi'],
  'admin.dismissError': ['OK', 'Đóng'],
  'admin.closeError': ['Close error message', 'Đóng thông báo lỗi'],
  'category.STREAM': ['STREAM', 'PHÁT TRỰC TIẾP'],
  'category.SCRIM': ['SCRIM', 'ĐẤU TẬP'],
  'category.TOURNAMENT': ['TOURNAMENT', 'GIẢI ĐẤU'],
  'category.ANNOUNCEMENT': ['ANNOUNCEMENT', 'THÔNG BÁO'],
  'category.COMMUNITY': ['COMMUNITY', 'CỘNG ĐỒNG']
};

const playerTranslations = {
  tuan18: {
    role: 'Đội trưởng (IGL)',
    summary: 'Thủ lĩnh chiến thuật dẫn dắt đội tuyển bằng sự bình tĩnh và khả năng vận hành chính xác.'
  },
  nomk3: {
    role: 'Hỗ trợ',
    summary: 'Tuyển thủ hỗ trợ ổn định với khả năng chọn vị trí kỷ luật và đóng góp hiệu quả cho đội.'
  },
  boyti: {
    role: 'Xạ thủ',
    summary: 'Tuyển thủ mở giao tranh bùng nổ, tạo áp lực mạnh và duy trì nhịp độ quyết liệt.'
  },
  longh: {
    role: 'Xạ thủ',
    summary: 'Tuyển thủ tạo áp lực mở giao tranh và xử lý quyết đoán ở những thời điểm then chốt.'
  }
};

const vietnameseMonths = {
  January: '1', February: '2', March: '3', April: '4', May: '5', June: '6',
  July: '7', August: '8', September: '9', October: '10', November: '11', December: '12'
};

let currentLanguage = localStorage.getItem('reignite-language') === 'vi' ? 'vi' : 'en';

function t(key) {
  const entry = translations[key];
  if (!entry) return key;
  return entry[currentLanguage === 'vi' ? 1 : 0];
}

function translateAchievement(achievement) {
  const translation = Object.entries(translations).find(([key, value]) => key.startsWith('achievement.') && value[0] === achievement);
  return translation ? t(translation[0]) : achievement;
}

function categoryLabel(category) {
  return t(`category.${category}`) || category;
}

function formatDob(dob) {
  if (currentLanguage !== 'vi') return dob;
  const match = dob.match(/^([A-Za-z]+) (\d+)$/);
  return match ? `${match[2]} tháng ${vietnameseMonths[match[1]]}` : dob;
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll('.form-status[data-original-message]').forEach((element) => {
    element.textContent = localizeAdminStatus(element.dataset.originalMessage);
  });
  const errorMessage = document.getElementById('errorModalMessage');
  if (errorMessage?.dataset.originalMessage) {
    errorMessage.textContent = localizeAdminStatus(errorMessage.dataset.originalMessage);
  }
  const languageToggle = document.getElementById('languageToggle');
  if (languageToggle) {
    languageToggle.textContent = currentLanguage === 'vi' ? 'English' : 'Tiếng Việt';
    languageToggle.setAttribute('aria-label', currentLanguage === 'vi' ? 'Chuyển sang tiếng Anh' : 'Switch to Vietnamese');
  }
  const formTitle = document.getElementById('eventFormTitle');
  if (formTitle && document.getElementById('eventId')?.value) {
    formTitle.textContent = t('admin.editEvent');
  }
}

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
  month: 'calendar.month',
  week: 'calendar.week',
  day: 'calendar.day'
};

async function initApp() {
  applyTranslations();
  bindLanguageToggle();
  setupIntro();
  setupHeader();
  renderPlayers();
  bindCalendarControls();
  bindAdminControls();
  bindPlayerModal();
  bindErrorModal();
  bindNavLinks();
  syncAdminVisibility();
  initEventForm();
  await restoreAdminSession();
  await loadEvents();
}

function bindLanguageToggle() {
  document.getElementById('languageToggle')?.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'en' ? 'vi' : 'en';
    localStorage.setItem('reignite-language', currentLanguage);
    applyTranslations();
    renderPlayers();
    renderCalendar();
    renderAdminEvents();
    const activePlayerId = document.getElementById('playerModalContent')?.dataset.playerId;
    if (activePlayerId && document.getElementById('playerModal')?.getAttribute('aria-hidden') === 'false') {
      openPlayerModal(activePlayerId);
    }
  });
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

  grid.innerHTML = players.map((player) => {
    const localized = currentLanguage === 'vi' ? playerTranslations[player.id] : null;
    return `
    <article class="player-card" data-player-id="${player.id}">
      <div class="player-photo">
        <img class="player-avatar" src="${player.image}" alt="${player.name} player portrait" loading="lazy" decoding="async" />
        <span class="player-photo-tag">${player.name}</span>
      </div>
      <div class="player-card-content">
        <h3 class="player-name">${player.name}</h3>
        <div class="player-role">${localized?.role || player.role}</div>
        <div class="player-meta">
          <span>${t('player.dob')}</span>
          <strong>${formatDob(player.dob)}</strong>
        </div>
        <p class="player-summary">${localized?.summary || player.summary}</p>
        <div class="player-actions">
          <a class="social-link" href="${player.tiktok}" target="_blank" rel="noreferrer">TikTok</a>
          <button class="player-view-btn" type="button" data-player-id="${player.id}">${t('player.viewProfile')}</button>
        </div>
      </div>
    </article>
  `;
  }).join('');

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
        <div class="player-modal-role">${currentLanguage === 'vi' ? playerTranslations[player.id].role : player.role}</div>
        <div class="player-meta-block">
          <div><strong>${t('player.dateOfBirth')}</strong> ${formatDob(player.dob)}</div>
        </div>
        <a class="social-link" href="${player.tiktok}" target="_blank" rel="noreferrer">${t('player.openTiktok')}</a>
        <ul>
          ${player.achievements.map((achievement) => `<li>${escapeHtml(translateAchievement(achievement))}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
  content.dataset.playerId = player.id;

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

function bindErrorModal() {
  const modal = document.getElementById('errorModal');
  const closeButtons = modal?.querySelectorAll('#errorModalClose, #errorModalConfirm');
  if (!modal || !closeButtons?.length) return;

  closeButtons.forEach((button) => {
    button.addEventListener('click', () => modal.setAttribute('aria-hidden', 'true'));
  });
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.setAttribute('aria-hidden', 'true');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      modal.setAttribute('aria-hidden', 'true');
    }
  });
}

function showErrorModal(message) {
  const modal = document.getElementById('errorModal');
  const messageElement = document.getElementById('errorModalMessage');
  if (!modal || !messageElement) return;

  messageElement.dataset.originalMessage = message;
  messageElement.textContent = localizeAdminStatus(message);
  modal.setAttribute('aria-hidden', 'false');
  document.getElementById('errorModalClose')?.focus();
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

function prioritizeTournamentEvents(events) {
  return [...events].sort((a, b) => Number(b.category === 'TOURNAMENT') - Number(a.category === 'TOURNAMENT'));
}

function formatDate(dateString, options = { month: 'short', day: 'numeric' }) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat(currentLanguage === 'vi' ? 'vi-VN' : 'en-US', options).format(date);
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

function renderCalendarEventLabel(event) {
  const startTime = (event.start_time || '').slice(0, 5);
  return `
    <span class="day-event-type">
      <span class="day-event-title">${escapeHtml(event.title)}</span>
      ${startTime ? `<span class="day-event-time">${escapeHtml(startTime)}</span>` : ''}
    </span>
  `;
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

  label.textContent = `${t(EVENT_VIEW_MAP[appState.activeView])} • ${new Intl.DateTimeFormat(currentLanguage === 'vi' ? 'vi-VN' : 'en-US', { month: 'long', year: 'numeric' }).format(appState.currentMonth)}`;

  const events = sortEvents(getEvents());
  const upcoming = events.filter(isUpcoming);

  if (appState.activeView === 'month') {
    const startOfMonth = new Date(appState.currentMonth.getFullYear(), appState.currentMonth.getMonth(), 1);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - ((startOfMonth.getDay() + 6) % 7));

    const weekHeader = `
      <div class="calendar-weekdays">
        ${t('calendar.weekdays').map((day) => `<span>${day}</span>`).join('')}
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

      const labels = dayEvents.slice(0, 2).map(renderCalendarEventLabel).join('');

      cells.push(`
        <button type="button" class="${classes.join(' ')}" data-date="${dateKey}" aria-label="${currentLanguage === 'vi' ? 'Chọn ngày' : 'Select'} ${dateKey}">
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
        <button type="button" class="${classes.join(' ')}" data-date="${dateKey}" aria-label="${currentLanguage === 'vi' ? 'Chọn ngày' : 'Select'} ${dateKey}">
          <span class="day-number">${date.getDate()}</span>
          ${dayEvents.length ? '<span class="day-event-dot"></span>' : ''}
          ${dayEvents.slice(0, 2).map(renderCalendarEventLabel).join('')}
        </button>
      `;
    }).join('');

    calendarGrid.innerHTML = `<div class="calendar-row">${items}</div>`;
  }

  const selectedDateKey = toDateKey(appState.selectedDate);
  const selectedEvents = events.filter((event) => eventOccursOnDate(event, selectedDateKey));

  const list = selectedEvents.length
    ? prioritizeTournamentEvents(selectedEvents)
    : prioritizeTournamentEvents(upcoming).slice(0, 4);
  if (!appState.eventsLoaded) {
    eventList.innerHTML = `<div class="empty-state loading-state" role="status" aria-live="polite">${t('calendar.loading')}</div>`;
  } else if (appState.eventError) {
    eventList.innerHTML = `<div class="empty-state error-state" role="alert">${escapeHtml(localizeAdminStatus(appState.eventError))}</div>`;
  } else if (!list.length) {
    eventList.innerHTML = `<div class="empty-state">${t('calendar.noUpcoming')}</div>`;
  } else {
    eventList.innerHTML = list.map((event) => `
      <article class="event-item ${event.category === 'TOURNAMENT' ? 'is-tournament' : ''}">
        <div class="event-item-header">
          <span class="event-badge ${escapeHtml(event.category.toLowerCase())}">${escapeHtml(categoryLabel(event.category))}</span>
        </div>
        <h4>
          ${escapeHtml(event.title)}
          ${(event.start_time || '').slice(0, 5) ? `<time class="event-item-time" datetime="${escapeHtml((event.start_time || '').slice(0, 5))}">${escapeHtml((event.start_time || '').slice(0, 5))}</time>` : ''}
        </h4>
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
    setAdminStatus('');

    const validationError = validateEventInput({
      title,
      startDate,
      startTime,
      endDate,
      endTime,
      externalUrl,
      category
    });
    if (validationError) {
      setAdminStatus(validationError, true);
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

    try {
      await saveEventRecord(supabase, record, id);
    } catch (saveError) {
      saveButton.disabled = false;
      setAdminStatus(`Unable to save event: ${saveError.message}`, true);
      return;
    }

    saveButton.disabled = false;

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
  document.getElementById('eventFormTitle').textContent = t('admin.createEvent');
  document.getElementById('eventCategory').value = 'STREAM';
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
    tableWrap.innerHTML = `<div class="empty-state loading-state" role="status" aria-live="polite">${t('admin.loading')}</div>`;
    return;
  }

  if (appState.eventError) {
    tableWrap.innerHTML = `<div class="empty-state error-state" role="alert">${escapeHtml(localizeAdminStatus(appState.eventError))}</div>`;
    return;
  }

  if (!events.length) {
    tableWrap.innerHTML = `<div class="empty-state">${t('admin.noMatches')}</div>`;
    return;
  }

  tableWrap.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>${t('admin.tableCategory')}</th>
          <th>${t('admin.tableTitle')}</th>
          <th>${t('admin.tableDescription')}</th>
          <th>${t('admin.tableStart')}</th>
          <th>${t('admin.tableEnd')}</th>
          <th>${t('admin.tableLocation')}</th>
          <th>${t('admin.tableActions')}</th>
        </tr>
      </thead>
      <tbody>
        ${events.map((event) => `
          <tr>
            <td>${escapeHtml(categoryLabel(event.category))}</td>
            <td>${escapeHtml(event.title)}</td>
            <td class="admin-event-description">${escapeHtml(event.description || '—')}</td>
            <td>${escapeHtml(formatDate(event.start_date, { year: 'numeric', month: 'short', day: 'numeric' }))} ${escapeHtml((event.start_time || '').slice(0, 5))}</td>
            <td>${escapeHtml(formatDate(event.end_date, { year: 'numeric', month: 'short', day: 'numeric' }))} ${escapeHtml((event.end_time || '').slice(0, 5))}</td>
            <td>${escapeHtml(event.location)}</td>
            <td class="table-actions">
              <button class="small-btn" type="button" data-edit-event="${escapeHtml(event.id)}">${t('admin.edit')}</button>
              <button class="small-btn danger" type="button" data-delete-event="${escapeHtml(event.id)}">${t('admin.delete')}</button>
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
  document.getElementById('eventFormTitle').textContent = t('admin.editEvent');
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
  if (!window.confirm(t('admin.deleteConfirm'))) return;

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
  if (isError && message) {
    status.dataset.originalMessage = '';
    status.textContent = '';
    status.classList.remove('error-state', 'success-state');
    showErrorModal(message);
    return;
  }
  status.dataset.originalMessage = message;
  status.textContent = localizeAdminStatus(message);
  status.classList.remove('error-state');
  status.classList.toggle('success-state', Boolean(message));
}

function localizeAdminStatus(message) {
  if (currentLanguage !== 'vi' || !message) return message;
  const exactMessages = {
    'Sign in with an authorized admin account to manage events.': 'Vui lòng đăng nhập bằng tài khoản quản trị được cấp quyền để quản lý sự kiện.',
    'Enter an event title, start date and time, and end date and time.': 'Vui lòng nhập tên sự kiện, ngày và giờ bắt đầu, ngày và giờ kết thúc.',
    'End date and time must be later than the start date and time.': 'Ngày và giờ kết thúc phải sau ngày và giờ bắt đầu.',
    'Enter a valid external URL starting with http:// or https://.': 'Vui lòng nhập URL hợp lệ bắt đầu bằng http:// hoặc https://.',
    'Select a valid event category.': 'Vui lòng chọn danh mục sự kiện hợp lệ.',
    'This event overlaps another event. Choose a different date or time.': 'Lịch này bị trùng với một sự kiện khác. Vui lòng chọn ngày hoặc giờ khác.',
    'Event schedule conflicts with an existing event.': 'Lịch này bị trùng với một sự kiện khác. Vui lòng chọn ngày hoặc giờ khác.',
    'Creating event...': 'Đang tạo sự kiện...',
    'Updating event…': 'Đang cập nhật sự kiện…',
    'Event updated successfully.': 'Cập nhật sự kiện thành công.',
    'Event created successfully.': 'Tạo sự kiện thành công.',
    'Event deleted.': 'Đã xóa sự kiện.',
    'Signing in…': 'Đang đăng nhập…',
    'Signed in. Event management is ready.': 'Đăng nhập thành công. Có thể quản lý sự kiện.',
    'Supabase is not configured. Add the required VITE_SUPABASE_* values.': 'Supabase chưa được cấu hình. Hãy thêm các giá trị VITE_SUPABASE_* cần thiết.',
    'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local.': 'Supabase chưa được cấu hình. Hãy khai báo VITE_SUPABASE_URL và VITE_SUPABASE_PUBLISHABLE_KEY trong .env.local.'
  };
  if (exactMessages[message]) return exactMessages[message];
  const prefixes = [
    ['Unable to save event: ', 'Không thể lưu sự kiện: '],
    ['Unable to delete event: ', 'Không thể xóa sự kiện: '],
    ['Unable to sign in: ', 'Không thể đăng nhập: '],
    ['Unable to sign out: ', 'Không thể đăng xuất: '],
    ['Unable to restore admin session: ', 'Không thể khôi phục phiên quản trị: '],
    ['Unable to verify admin access: ', 'Không thể xác minh quyền quản trị: '],
    ['Unable to load events: ', 'Không thể tải sự kiện: '],
    ['Event was saved, but the list could not be refreshed: ', 'Đã lưu sự kiện nhưng không thể tải lại danh sách: '],
    ['Event was deleted, but the list could not be refreshed: ', 'Đã xóa sự kiện nhưng không thể tải lại danh sách: ']
  ];
  const prefix = prefixes.find(([english]) => message.startsWith(english));
  if (!prefix) return message;
  const detail = message.slice(prefix[0].length);
  return `${prefix[1]}${exactMessages[detail] || detail}`;
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
