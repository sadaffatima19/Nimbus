/* ============================================================
   NIMBUS WEATHER APP — SCRIPT (Frontend only)
   ============================================================ */

const BASE_URL = '/api/weather';

/* ────────── DOM refs ────────── */
const cityInput     = document.getElementById('cityInput');
const searchBtn     = document.getElementById('searchBtn');
const geoBtn        = document.getElementById('geoBtn');
const errorMsg      = document.getElementById('errorMsg');
const loader        = document.getElementById('loader');
const weatherContent = document.getElementById('weatherContent');
const emptyState    = document.getElementById('emptyState');

/* ────────── Emoji weather icon map ────────── */
const iconMap = {
  '01d':'☀️','01n':'🌙',
  '02d':'🌤️','02n':'🌤️',
  '03d':'☁️','03n':'☁️',
  '04d':'☁️','04n':'☁️',
  '09d':'🌧️','09n':'🌧️',
  '10d':'🌦️','10n':'🌦️',
  '11d':'⛈️','11n':'⛈️',
  '13d':'❄️','13n':'❄️',
  '50d':'🌫️','50n':'🌫️',
};

/* ────────── 3D SVG icon builder for current weather ────────── */
const svg3dMap = {
  clear_day: `
    <svg viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg" width="130" height="130">
      <defs>
        <radialGradient id="sg" cx="40%" cy="40%">
          <stop offset="0%" stop-color="#fff176"/>
          <stop offset="60%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#d97706"/>
        </radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <circle cx="65" cy="65" r="38" fill="url(#sg)" filter="url(#glow)" opacity="0.85"/>
      <circle cx="65" cy="65" r="28" fill="url(#sg)"/>
      ${rays(65,65,38,50,8,14)}
    </svg>`,
  cloud: `
    <svg viewBox="0 0 130 100" xmlns="http://www.w3.org/2000/svg" width="130" height="100">
      <defs>
        <linearGradient id="cg" x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#c7ddf5"/>
        </linearGradient>
      </defs>
      <ellipse cx="65" cy="68" rx="50" ry="26" fill="url(#cg)"/>
      <circle cx="45" cy="55" r="22" fill="url(#cg)"/>
      <circle cx="72" cy="48" r="28" fill="url(#cg)"/>
      <circle cx="95" cy="57" r="18" fill="url(#cg)"/>
    </svg>`,
  rain: `
    <svg viewBox="0 0 130 120" xmlns="http://www.w3.org/2000/svg" width="130" height="120">
      <defs>
        <linearGradient id="rg" x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stop-color="#94b8d4"/>
          <stop offset="100%" stop-color="#6a97ba"/>
        </linearGradient>
      </defs>
      <ellipse cx="65" cy="58" rx="48" ry="22" fill="url(#rg)"/>
      <circle cx="45" cy="46" r="20" fill="url(#rg)"/>
      <circle cx="70" cy="40" r="26" fill="url(#rg)"/>
      <circle cx="93" cy="48" r="16" fill="url(#rg)"/>
      <line x1="40" y1="80" x2="34" y2="100" stroke="#5b9bd5" stroke-width="3" stroke-linecap="round"/>
      <line x1="56" y1="84" x2="50" y2="104" stroke="#5b9bd5" stroke-width="3" stroke-linecap="round"/>
      <line x1="72" y1="80" x2="66" y2="100" stroke="#5b9bd5" stroke-width="3" stroke-linecap="round"/>
      <line x1="88" y1="84" x2="82" y2="104" stroke="#5b9bd5" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  snow: `
    <svg viewBox="0 0 130 120" xmlns="http://www.w3.org/2000/svg" width="130" height="120">
      <defs>
        <linearGradient id="snwg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#e0efff"/>
          <stop offset="100%" stop-color="#b8cfea"/>
        </linearGradient>
      </defs>
      <ellipse cx="65" cy="56" rx="48" ry="22" fill="url(#snwg)"/>
      <circle cx="45" cy="44" r="20" fill="url(#snwg)"/>
      <circle cx="70" cy="38" r="26" fill="url(#snwg)"/>
      <circle cx="93" cy="46" r="16" fill="url(#snwg)"/>
      ${snowflakes()}
    </svg>`,
  storm: `
    <svg viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg" width="130" height="130">
      <defs>
        <linearGradient id="stg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#7a8fa3"/>
          <stop offset="100%" stop-color="#4a6178"/>
        </linearGradient>
      </defs>
      <ellipse cx="65" cy="52" rx="50" ry="24" fill="url(#stg)"/>
      <circle cx="43" cy="40" r="22" fill="url(#stg)"/>
      <circle cx="70" cy="34" r="28" fill="url(#stg)"/>
      <circle cx="96" cy="44" r="18" fill="url(#stg)"/>
      <polygon points="72,76 60,102 68,102 56,128 84,96 72,96 84,76" fill="#fde047" opacity="0.95"/>
    </svg>`,
  mist: `
    <svg viewBox="0 0 130 90" xmlns="http://www.w3.org/2000/svg" width="130" height="90">
      <line x1="15" y1="20" x2="115" y2="20" stroke="#b0c8de" stroke-width="8" stroke-linecap="round" opacity="0.7"/>
      <line x1="25" y1="38" x2="105" y2="38" stroke="#b0c8de" stroke-width="8" stroke-linecap="round" opacity="0.5"/>
      <line x1="10" y1="56" x2="120" y2="56" stroke="#b0c8de" stroke-width="8" stroke-linecap="round" opacity="0.6"/>
      <line x1="30" y1="74" x2="100" y2="74" stroke="#b0c8de" stroke-width="8" stroke-linecap="round" opacity="0.4"/>
    </svg>`,
  partly_cloudy: `
    <svg viewBox="0 0 140 110" xmlns="http://www.w3.org/2000/svg" width="140" height="110">
      <defs>
        <radialGradient id="psg" cx="40%" cy="40%">
          <stop offset="0%" stop-color="#fff176"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </radialGradient>
        <linearGradient id="pcg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#d0e8f8"/>
        </linearGradient>
      </defs>
      <circle cx="42" cy="42" r="30" fill="url(#psg)" opacity="0.9"/>
      ${rays(42,42,30,44,6,12)}
      <ellipse cx="85" cy="78" rx="44" ry="22" fill="url(#pcg)"/>
      <circle cx="65" cy="66" r="20" fill="url(#pcg)"/>
      <circle cx="88" cy="60" r="26" fill="url(#pcg)"/>
      <circle cx="110" cy="68" r="17" fill="url(#pcg)"/>
    </svg>`,
};

function rays(cx, cy, r1, r2, count, len) {
  let d = '';
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + Math.cos(angle) * (r1 + 6);
    const y1 = cy + Math.sin(angle) * (r1 + 6);
    const x2 = cx + Math.cos(angle) * (r1 + len);
    const y2 = cy + Math.sin(angle) * (r1 + len);
    d += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" opacity="0.85"/>`;
  }
  return d;
}

function snowflakes() {
  const positions = [[40,82],[56,90],[72,82],[88,90]];
  return positions.map(([x, y]) => `
    <g transform="translate(${x},${y})">
      <line x1="0" y1="-9" x2="0" y2="9" stroke="#a0c4e0" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="-8" y1="-4.5" x2="8" y2="4.5" stroke="#a0c4e0" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="8" y1="-4.5" x2="-8" y2="4.5" stroke="#a0c4e0" stroke-width="2.5" stroke-linecap="round"/>
    </g>`).join('');
}

function get3dIcon(iconCode) {
  if (!iconCode) return svg3dMap.cloud;
  const c = iconCode.slice(0, 2);
  const d = iconCode.slice(-1) === 'd';
  if (c === '01') return d ? svg3dMap.clear_day : svg3dMap.clear_day;
  if (c === '02') return svg3dMap.partly_cloudy;
  if (c === '03' || c === '04') return svg3dMap.cloud;
  if (c === '09' || c === '10') return svg3dMap.rain;
  if (c === '11') return svg3dMap.storm;
  if (c === '13') return svg3dMap.snow;
  if (c === '50') return svg3dMap.mist;
  return svg3dMap.cloud;
}

/* ────────── Particle system ────────── */
function initParticles() {
  const container = document.getElementById('particles');
  container.innerHTML = '';
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 5 + 2;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 30}%;
      width: ${size}px; height: ${size}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }
}

/* ────────── Utility ────────── */
const formatDate = (dt, tz) => {
  const d = new Date((dt + tz) * 1000);
  return d.toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric', timeZone:'UTC' });
};
const shortDay = (dt, tz) => {
  const d = new Date((dt + tz) * 1000);
  return d.toLocaleDateString('en-US', { weekday:'short', timeZone:'UTC' });
};
const shortTime = (dt, tz) => {
  const d = new Date((dt + tz) * 1000);
  return d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:true, timeZone:'UTC' });
};
const toC = k => (k - 273.15).toFixed(0);
const kmh = ms => (ms * 3.6).toFixed(0) + ' km/h';

/* ────────── UI state helpers ────────── */
function showLoader()  { loader.style.display='flex'; weatherContent.style.display='none'; emptyState.style.display='none'; setError(''); }
function showWeather() { loader.style.display='none'; weatherContent.style.display='block'; emptyState.style.display='none'; }
function showEmpty()   { loader.style.display='none'; weatherContent.style.display='none'; emptyState.style.display='flex'; }
function setError(msg) { errorMsg.textContent = msg; }

/* ────────── Updated fetch helpers (calling Vercel) ────────── */
async function fetchWeatherData(type, params) {
  const queryParams = new URLSearchParams({ type, ...params }).toString();
  const response = await fetch(`${BASE_URL}?${queryParams}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch weather data');
  }
  return data;
}

async function loadByCity(city) {
  showLoader();
  try {
    const [current, forecast] = await Promise.all([
      fetchWeatherData('current', { city }),
      fetchWeatherData('forecast', { city }),
    ]);
    renderCurrent(current);
    renderForecast(forecast, current.timezone);
    renderHourly(forecast, current.timezone);
    showWeather();
  } catch (e) {
    setError('❌ ' + (e.message === 'city not found' ? 'City not found. Try another name.' : e.message));
    showEmpty();
  }
}

async function loadByCoords(lat, lon) {
  showLoader();
  try {
    const [current, forecast] = await Promise.all([
      fetchWeatherData('current', { lat, lon }),
      fetchWeatherData('forecast', { lat, lon }),
    ]);
    renderCurrent(current);
    renderForecast(forecast, current.timezone);
    renderHourly(forecast, current.timezone);
    showWeather();
  } catch (e) {
    setError('❌ ' + e.message);
    showEmpty();
  }
}

/* ────────── Render current weather ────────── */
function renderCurrent(d) {
  document.getElementById('cityName').textContent    = d.name;
  document.getElementById('countryCode').textContent = d.sys.country;
  document.getElementById('currentDate').textContent = formatDate(d.dt, d.timezone);
  document.getElementById('weatherDesc').textContent = d.weather[0].description;
  document.getElementById('tempValue').textContent   = toC(d.main.temp);
  document.getElementById('feelsLike').textContent   = toC(d.main.feels_like);
  document.getElementById('humidity').textContent    = d.main.humidity + '%';
  document.getElementById('windSpeed').textContent   = kmh(d.wind.speed);
  document.getElementById('pressure').textContent    = d.main.pressure + ' hPa';
  document.getElementById('visibility').textContent  = d.visibility ? (d.visibility / 1000).toFixed(1) + ' km' : 'N/A';

  // 3D icon
  document.getElementById('iconScene').innerHTML = get3dIcon(d.weather[0].icon);
}

/* ────────── Render 5-day forecast ────────── */
function renderForecast(data, tz) {
  // Pick one reading per day (noon-ish)
  const days = {};
  data.list.forEach(item => {
    const day = shortDay(item.dt, tz);
    if (!days[day]) days[day] = item;
  });

  const grid = document.getElementById('forecastGrid');
  grid.innerHTML = '';
  Object.values(days).slice(0, 5).forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.style.animationDelay = `${i * 0.08}s`;
    card.innerHTML = `
      <div class="forecast-day">${shortDay(item.dt, tz)}</div>
      <span class="forecast-icon">${iconMap[item.weather[0].icon] || '🌡️'}</span>
      <div class="forecast-temp-high">${toC(item.main.temp_max)}°</div>
      <div class="forecast-temp-low">${toC(item.main.temp_min)}°</div>
      <div class="forecast-desc">${item.weather[0].description}</div>
    `;
    grid.appendChild(card);
  });
}

/* ────────── Render hourly strip ────────── */
function renderHourly(data, tz) {
  const strip = document.getElementById('hourlyStrip');
  strip.innerHTML = '';
  data.list.slice(0, 8).forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'hourly-item';
    el.style.animationDelay = `${i * 0.06}s`;
    el.innerHTML = `
      <div class="hourly-time">${shortTime(item.dt, tz)}</div>
      <span class="hourly-icon">${iconMap[item.weather[0].icon] || '🌡️'}</span>
      <div class="hourly-temp">${toC(item.main.temp)}°</div>
    `;
    strip.appendChild(el);
  });
}

/* ────────── Event listeners ────────── */
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) loadByCity(city);
  else setError('Please enter a city name.');
});

cityInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') searchBtn.click();
});

geoBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    setError('Geolocation is not supported by your browser.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => loadByCoords(pos.coords.latitude, pos.coords.longitude),
    ()  => setError('Location access denied. Please search by city name.')
  );
});

/* ────────── Init ────────── */
initParticles();
showEmpty();