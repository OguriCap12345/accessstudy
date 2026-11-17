import { useMemo, useState } from 'react';
import './App.css';

const campusLocations = [
  { id: 'hoofdingang', name: 'Hoofdingang', zone: 'Ovaal', icon: '🏫' },
  { id: 'receptie', name: 'Receptie / Beveiliging', zone: 'Ovaal', icon: '🛡️' },
  { id: 'ovaal', name: 'Ovaal centraal punt', zone: 'Ovaal', icon: '🟠' },
  { id: 'bibliotheek', name: 'Bibliotheek', zone: 'Slinger', icon: '📚' },
  { id: 'central_restaurant', name: 'Central Restaurant', zone: 'Strip', icon: '🍽️' },
  { id: 'aula', name: 'Aula', zone: 'Strip', icon: '🎤' },
  { id: 'sporthal', name: 'Sporthal + Fitness', zone: 'Sporthal', icon: '🏀' },
  { id: 'studentpsycholoog', name: 'Studentpsycholoog / Ovaal 4.28', zone: 'Ovaal', icon: '💬' },
  { id: 'csi', name: 'CSI / International Office', zone: 'Ovaal', icon: '🌍' },
  { id: 'rugzak1', name: 'Rugzak 1', zone: 'Rugzak', icon: '🟩' },
  { id: 'rugzak2', name: 'Rugzak 2', zone: 'Rugzak', icon: '🟩' },
  { id: 'lift_ovaal', name: 'Lift Ovaal', zone: 'Ovaal', icon: '🛗' },
  { id: 'lift_slinger', name: 'Lift Slinger', zone: 'Slinger', icon: '🛗' },
  { id: 'lift_strip', name: 'Lift Strip', zone: 'Strip', icon: '🛗' },
  { id: 'lift_sporthal', name: 'Lift Sporthal', zone: 'Sporthal', icon: '🛗' },
  { id: 'brug_rugzak', name: 'Bridge naar Rugzak', zone: 'Slinger / Rugzak', icon: '🌉' },
];

const predefinedRoutes = [
  {
    id: 'route-hoofdingang-bibliotheek',
    from: 'hoofdingang',
    to: 'bibliotheek',
    title: 'Hoofdingang naar Bibliotheek',
    timeMinutes: 5,
    distance: '280 m',
    crowdLevel: 'Rustig',
    accessibility: 'Volledig rolstoeltoegankelijk',
    path: ['hoofdingang', 'receptie', 'lift_slinger', 'bibliotheek'],
    steps: [
      'Start bij de Hoofdingang.',
      'Ga richting Receptie / Beveiliging.',
      'Volg de route naar de Slinger-zone.',
      'Gebruik Lift Slinger indien je naar een andere verdieping moet.',
      'Ga door naar de Bibliotheek.',
    ],
  },
  {
    id: 'route-hoofdingang-central-restaurant',
    from: 'hoofdingang',
    to: 'central_restaurant',
    title: 'Hoofdingang naar Central Restaurant',
    timeMinutes: 7,
    distance: '410 m',
    crowdLevel: 'Gemiddeld',
    accessibility: 'Rolstoeltoegankelijk via Ovaal en Strip',
    path: ['hoofdingang', 'ovaal', 'lift_ovaal', 'lift_strip', 'central_restaurant'],
    steps: [
      'Start bij de Hoofdingang.',
      'Ga naar het centrale punt in de Ovaal.',
      'Gebruik Lift Ovaal indien nodig.',
      'Volg de route richting de Strip.',
      'Ga door naar het Central Restaurant.',
    ],
  },
  {
    id: 'route-hoofdingang-aula',
    from: 'hoofdingang',
    to: 'aula',
    title: 'Hoofdingang naar Aula',
    timeMinutes: 8,
    distance: '480 m',
    crowdLevel: 'Druk',
    accessibility: 'Rolstoeltoegankelijk via Ovaal en Strip',
    path: ['hoofdingang', 'ovaal', 'lift_strip', 'aula'],
    steps: [
      'Start bij de Hoofdingang.',
      'Ga via de Ovaal richting de Strip.',
      'Gebruik Lift Strip als verdieping wisselen nodig is.',
      'Ga door naar de Aula.',
    ],
  },
  {
    id: 'route-hoofdingang-sporthal',
    from: 'hoofdingang',
    to: 'sporthal',
    title: 'Hoofdingang naar Sporthal + Fitness',
    timeMinutes: 9,
    distance: '520 m',
    crowdLevel: 'Rustig',
    accessibility: 'Rolstoeltoegankelijk via Ovaal en Sporthal-route',
    path: ['hoofdingang', 'ovaal', 'lift_sporthal', 'sporthal'],
    steps: [
      'Start bij de Hoofdingang.',
      'Ga naar het centrale punt in de Ovaal.',
      'Volg de route richting de paarse Sporthal-zone.',
      'Gebruik Lift Sporthal indien nodig.',
      'Je bereikt Sporthal + Fitness.',
    ],
  },
  {
    id: 'route-hoofdingang-studentpsycholoog',
    from: 'hoofdingang',
    to: 'studentpsycholoog',
    title: 'Hoofdingang naar Studentpsycholoog',
    timeMinutes: 4,
    distance: '180 m',
    crowdLevel: 'Rustig',
    accessibility: 'Kortste toegankelijke route binnen Ovaal',
    path: ['hoofdingang', 'ovaal', 'lift_ovaal', 'studentpsycholoog'],
    steps: [
      'Start bij de Hoofdingang.',
      'Ga naar het centrale punt in de Ovaal.',
      'Gebruik Lift Ovaal naar de juiste verdieping.',
      'Ga door naar Studentpsycholoog / Ovaal 4.28.',
    ],
  },
  {
    id: 'route-hoofdingang-rugzak1',
    from: 'hoofdingang',
    to: 'rugzak1',
    title: 'Hoofdingang naar Rugzak 1',
    timeMinutes: 7,
    distance: '390 m',
    crowdLevel: 'Gemiddeld',
    accessibility: 'Rolstoeltoegankelijk via Slinger en Bridge',
    path: ['hoofdingang', 'receptie', 'lift_slinger', 'brug_rugzak', 'rugzak1'],
    steps: [
      'Start bij de Hoofdingang.',
      'Ga richting Receptie / Beveiliging.',
      'Volg de Slinger-zone.',
      'Gebruik de Bridge richting Rugzak.',
      'Je bereikt Rugzak 1.',
    ],
  },
  {
    id: 'route-hoofdingang-rugzak2',
    from: 'hoofdingang',
    to: 'rugzak2',
    title: 'Hoofdingang naar Rugzak 2',
    timeMinutes: 8,
    distance: '430 m',
    crowdLevel: 'Gemiddeld',
    accessibility: 'Rolstoeltoegankelijk via Slinger en Bridge',
    path: ['hoofdingang', 'receptie', 'lift_slinger', 'brug_rugzak', 'rugzak2'],
    steps: [
      'Start bij de Hoofdingang.',
      'Ga richting Receptie / Beveiliging.',
      'Volg de Slinger-zone.',
      'Gebruik de Bridge richting Rugzak.',
      'Ga door naar Rugzak 2.',
    ],
  },
  {
    id: 'route-hoofdingang-csi',
    from: 'hoofdingang',
    to: 'csi',
    title: 'Hoofdingang naar CSI / International Office',
    timeMinutes: 3,
    distance: '120 m',
    crowdLevel: 'Rustig',
    accessibility: 'Korte toegankelijke route bij de ingang',
    path: ['hoofdingang', 'ovaal', 'csi'],
    steps: [
      'Start bij de Hoofdingang.',
      'Ga de Ovaal binnen.',
      'Volg de route naar CSI / International Office.',
    ],
  },
];

const alternativeRoutes = [
  {
    blockedLocation: 'lift_slinger',
    affectedTo: ['bibliotheek', 'rugzak1', 'rugzak2'],
    reason: 'Lift Slinger is gemeld als obstakel.',
    alternativePath: ['hoofdingang', 'ovaal', 'lift_ovaal', 'brug_rugzak', 'bibliotheek'],
    message: 'Gebruik de route via de Ovaal en Bridge in plaats van Lift Slinger.',
    extraMinutes: 3,
  },
  {
    blockedLocation: 'lift_strip',
    affectedTo: ['aula', 'central_restaurant'],
    reason: 'Lift Strip is gemeld als obstakel.',
    alternativePath: ['hoofdingang', 'ovaal', 'lift_ovaal', 'central_restaurant'],
    message: 'Gebruik Lift Ovaal en ga daarna richting de Strip.',
    extraMinutes: 4,
  },
  {
    blockedLocation: 'lift_ovaal',
    affectedTo: ['studentpsycholoog', 'central_restaurant'],
    reason: 'Lift Ovaal is gemeld als obstakel.',
    alternativePath: ['hoofdingang', 'receptie', 'lift_slinger', 'ovaal', 'studentpsycholoog'],
    message: 'Gebruik Lift Slinger als alternatief en ga daarna terug richting Ovaal.',
    extraMinutes: 5,
  },
  {
    blockedLocation: 'brug_rugzak',
    affectedTo: ['rugzak1', 'rugzak2'],
    reason: 'Bridge naar Rugzak is gemeld als obstakel.',
    alternativePath: ['hoofdingang', 'receptie', 'lift_slinger', 'rugzak1'],
    message: 'Volg de Slinger-route en vermijd de Bridge.',
    extraMinutes: 4,
  },
];

const defaultObstacles = [
  {
    id: 1,
    locationId: 'lift_slinger',
    type: 'Lift kapot',
    severity: 'Hoog',
    description: 'Lift Slinger is tijdelijk buiten gebruik.',
    active: true,
    reportedBy: '3 studenten',
    updatedAt: '09:14',
  },
  {
    id: 2,
    locationId: 'brug_rugzak',
    type: 'Doorgang geblokkeerd',
    severity: 'Gemiddeld',
    description: 'Bridge naar Rugzak is deels geblokkeerd door onderhoud.',
    active: true,
    reportedBy: 'Facilitair',
    updatedAt: '08:40',
  },
];

const initialRequests = [
  {
    id: 1,
    title: 'Extra tijd toets',
    status: 'Goedgekeurd',
    meta: 'Toetsweek · Lokaal T2.04 · 25% extra tijd',
    date: 'Vandaag',
  },
  {
    id: 2,
    title: 'Aangepaste tafel Ovaal 1.02',
    status: 'In behandeling',
    meta: 'Aangevraagd voor maandag 09:00',
    date: 'Gisteren',
  },
  {
    id: 3,
    title: 'Hulp bij vervoer',
    status: 'Aanpassen nodig',
    meta: 'Extra informatie nodig over gewenste dagen',
    date: '2 dagen geleden',
  },
];

function getLocation(locationId) {
  return campusLocations.find((location) => location.id === locationId);
}

function getLocationName(locationId) {
  return getLocation(locationId)?.name || locationId;
}

function calculateAccessibleRoute(from, to, activeObstacles = [], preferences = {}) {
  const route = predefinedRoutes.find((item) => item.from === from && item.to === to);

  if (!route) {
    return {
      found: false,
      message: 'Geen route gevonden voor deze combinatie. Kies een ander vertrekpunt of bestemming.',
    };
  }

  const blockedNode = route.path.find((node) =>
    activeObstacles.some((obstacle) => obstacle.locationId === node && obstacle.active)
  );

  const preferenceNote = preferences.quiet
    ? 'Ik geef extra voorkeur aan een rustige route met minder drukke zones.'
    : 'Ik kies de beste toegankelijke route op basis van actuele meldingen.';

  if (!blockedNode) {
    return {
      found: true,
      adjusted: false,
      route,
      aiMessage: `${preferenceNote} Deze route bevat geen actieve obstakels en is geschikt als toegankelijke route.`,
    };
  }

  const alternative = alternativeRoutes.find(
    (item) => item.blockedLocation === blockedNode && item.affectedTo.includes(to)
  );

  if (!alternative) {
    return {
      found: true,
      adjusted: true,
      route,
      blockedNode,
      aiMessage: `${getLocationName(blockedNode)} is gemeld als obstakel. Er is nog geen alternatief ingesteld voor deze route.`,
    };
  }

  return {
    found: true,
    adjusted: true,
    originalRoute: route,
    alternativeRoute: {
      ...route,
      id: `${route.id}-alternative`,
      title: `${route.title} — aangepaste route`,
      timeMinutes: route.timeMinutes + alternative.extraMinutes,
      distance: `${parseInt(route.distance, 10) + 110} m`,
      crowdLevel: preferences.quiet ? 'Rustig' : route.crowdLevel,
      path: alternative.alternativePath,
      accessibility: 'Aangepaste route, volledig toegankelijk',
      steps: [
        'De oorspronkelijke route bevat een gemeld obstakel.',
        alternative.message,
        'Volg de groene alternatieve route op de kaart.',
      ],
    },
    blockedNode,
    reason: alternative.reason,
    aiMessage: `${alternative.reason} Daarom stel ik een alternatieve route voor. Deze duurt ongeveer ${alternative.extraMinutes} minuten langer, maar vermijdt het obstakel en blijft toegankelijk.`,
  };
}

function RoutePath({ title, path, type }) {
  return (
    <div className={`route-path ${type}`}>
      <strong>{title}</strong>
      <div className="route-node-row">
        {path.map((node, index) => {
          const location = getLocation(node);
          return (
            <span className="route-node" key={`${node}-${index}`}>
              <span aria-hidden="true">{location?.icon || '📍'}</span>
              {getLocationName(node)}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function AppHeader({ screen, setScreen, highContrast, setHighContrast }) {
  const showNavigation = !['welcome', 'login', 'register', 'forgot'].includes(screen);

  if (!showNavigation) return null;

  return (
    <header className="app-header">
      <button className="brand-button" onClick={() => setScreen('dashboard')} aria-label="Ga naar dashboard">
        <span className="brand-mark">AS</span>
        <span>
          <strong>AccessStudy</strong>
          <small>Inclusief campusplatform</small>
        </span>
      </button>
      <nav className="top-nav" aria-label="Hoofdnavigatie">
        <button className={screen === 'dashboard' ? 'active' : ''} onClick={() => setScreen('dashboard')}>Home</button>
        <button className={screen === 'route' ? 'active' : ''} onClick={() => setScreen('route')}>Route</button>
        <button className={screen === 'requests' ? 'active' : ''} onClick={() => setScreen('requests')}>Aanvragen</button>
        <button className={screen === 'contact' ? 'active' : ''} onClick={() => setScreen('contact')}>Contact</button>
      </nav>
      <div className="header-actions">
        <button className="icon-button" onClick={() => setHighContrast(!highContrast)} title="Hoog contrast wisselen">
          {highContrast ? '☀️' : '◐'}
        </button>
        <button className="avatar-button" onClick={() => setScreen('settings')}>FD</button>
      </div>
    </header>
  );
}

function BottomNavigation({ screen, setScreen }) {
  if (['welcome', 'login', 'register', 'forgot'].includes(screen)) return null;

  const items = [
    ['dashboard', '⌂', 'Home'],
    ['route', '🧭', 'Route'],
    ['report', '⚠️', 'Melden'],
    ['requests', '📄', 'Aanvragen'],
  ];

  return (
    <nav className="bottom-nav" aria-label="Mobiele navigatie">
      {items.map(([id, icon, label]) => (
        <button key={id} className={screen === id ? 'active' : ''} onClick={() => setScreen(id)}>
          <span>{icon}</span>
          {label}
        </button>
      ))}
    </nav>
  );
}

function App() {
  const [screen, setScreen] = useState('welcome');
  const [email, setEmail] = useState('frank@student.hhs.nl');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [from, setFrom] = useState('hoofdingang');
  const [to, setTo] = useState('bibliotheek');
  const [routeResult, setRouteResult] = useState(null);
  const [obstacles, setObstacles] = useState(defaultObstacles);
  const [requests, setRequests] = useState(initialRequests);
  const [toast, setToast] = useState('');
  const [highContrast, setHighContrast] = useState(false);
  const [preferences, setPreferences] = useState({
    avoidStairs: true,
    elevators: true,
    avoidObstacles: true,
    quiet: false,
    restSpots: true,
  });
  const [newObstacle, setNewObstacle] = useState({
    locationId: 'lift_slinger',
    type: 'Lift kapot',
    severity: 'Hoog',
    description: '',
  });
  const [supportRequest, setSupportRequest] = useState({
    title: 'Aangepaste tafel',
    date: '',
    location: '',
    description: '',
  });

  const activeObstacles = useMemo(
    () => obstacles.filter((obstacle) => obstacle.active),
    [obstacles]
  );

  const destinationOptions = campusLocations.filter((location) =>
    predefinedRoutes.some((route) => route.from === from && route.to === location.id)
  );

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  }

  function handleLogin(event) {
    event.preventDefault();
    if (!email || !password) {
      setLoginError('Controleer je e-mailadres of wachtwoord. Voor de demo mag je elk wachtwoord invullen.');
      return;
    }
    setLoginError('');
    setScreen('dashboard');
    showToast('Welkom terug, Frank. Je campusinformatie is bijgewerkt.');
  }

  function calculateRoute() {
    const result = calculateAccessibleRoute(from, to, activeObstacles, preferences);
    setRouteResult(result);
  }

  function addObstacle(event) {
    event.preventDefault();
    setObstacles([
      ...obstacles,
      {
        id: Date.now(),
        ...newObstacle,
        active: true,
        reportedBy: 'Frank',
        updatedAt: 'Zojuist',
      },
    ]);
    setRouteResult(null);
    setNewObstacle({ ...newObstacle, description: '' });
    setScreen('route');
    showToast('Melding opgeslagen. Routes worden nu opnieuw gecontroleerd.');
  }

  function removeObstacle(id) {
    setObstacles(obstacles.map((obstacle) =>
      obstacle.id === id ? { ...obstacle, active: false } : obstacle
    ));
    setRouteResult(null);
    showToast('Obstakel gemarkeerd als opgelost.');
  }

  function submitSupportRequest(event) {
    event.preventDefault();
    const request = {
      id: Date.now(),
      title: supportRequest.title,
      status: 'In behandeling',
      meta: `${supportRequest.location || 'Locatie nog onbekend'} · ${supportRequest.description || 'Geen extra toelichting'}`,
      date: 'Zojuist',
    };
    setRequests([request, ...requests]);
    setSupportRequest({ title: 'Aangepaste tafel', date: '', location: '', description: '' });
    setScreen('requests');
    showToast('Je voorziening is aangevraagd.');
  }

  const currentRoute = routeResult?.alternativeRoute || routeResult?.route;

  return (
    <div className={highContrast ? 'app high-contrast' : 'app'}>
      <AppHeader screen={screen} setScreen={setScreen} highContrast={highContrast} setHighContrast={setHighContrast} />
      {toast && <div className="toast" role="status">{toast}</div>}

      <main className="app-shell">
        {screen === 'welcome' && (
          <section className="auth-layout">
            <div className="auth-copy">
              <span className="pill">SDG 4 · Inclusief onderwijs</span>
              <h1>Studeren zonder onnodige drempels.</h1>
              <p>AccessStudy helpt studenten met een fysieke beperking met toegankelijke routes, live obstakelmeldingen en ondersteuning vanuit de opleiding.</p>
              <div className="auth-highlights">
                <span>🧭 Slimme routehulp</span>
                <span>⚠️ Live meldingen</span>
                <span>📄 Voorzieningen aanvragen</span>
              </div>
            </div>
            <div className="auth-card glass-card">
              <div className="logo-mark">AS</div>
              <h2>AccessStudy</h2>
              <p className="subtitle">Toegankelijke campusapp voor De Haagse Hogeschool</p>
              <button onClick={() => setScreen('login')}>Inloggen</button>
              <button className="secondary" onClick={() => setScreen('register')}>Account aanmaken</button>
              <button className="link-button" onClick={() => setScreen('forgot')}>Wachtwoord vergeten?</button>
            </div>
          </section>
        )}

        {screen === 'login' && (
          <section className="center-page">
            <form onSubmit={handleLogin} className="card form-card">
              <button type="button" className="back" onClick={() => setScreen('welcome')}>← Terug</button>
              <span className="pill">Veilig inloggen</span>
              <h1>Welkom terug</h1>
              <p className="subtitle">Gebruik je schoolmail of gebruikersnaam. Voor deze demo mag ieder wachtwoord.</p>
              <label>
                Gebruikersnaam of e-mailadres
                <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="naam@student.hhs.nl" />
              </label>
              <label>
                Wachtwoord
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Vul je wachtwoord in" />
              </label>
              {loginError && <p className="error-message">{loginError}</p>}
              <button type="submit">Inloggen</button>
              <div className="form-links">
                <button type="button" className="link-button" onClick={() => setScreen('forgot')}>Wachtwoord vergeten?</button>
                <button type="button" className="link-button" onClick={() => setScreen('register')}>Nog geen account?</button>
              </div>
            </form>
          </section>
        )}

        {screen === 'register' && (
          <section className="center-page">
            <div className="card form-card">
              <button className="back" onClick={() => setScreen('welcome')}>← Terug</button>
              <span className="pill">Nieuw account</span>
              <h1>Account aanmaken</h1>
              <div className="form-grid two-columns">
                <label>Naam<input placeholder="Frank de Vries" /></label>
                <label>E-mailadres<input placeholder="frank@student.hhs.nl" /></label>
                <label>Wachtwoord<input placeholder="Minimaal 8 tekens" type="password" /></label>
                <label>Wachtwoord bevestigen<input placeholder="Herhaal wachtwoord" type="password" /></label>
                <label>Onderwijsinstelling<input placeholder="De Haagse Hogeschool" /></label>
                <label>Studentnummer<input placeholder="Optioneel" /></label>
                <label className="checkbox full-width"><input type="checkbox" /> Ik ga akkoord met de privacyvoorwaarden</label>
                <button className="full-width" onClick={() => { setScreen('dashboard'); showToast('Account aangemaakt. Welkom bij AccessStudy.'); }}>Account aanmaken</button>
              </div>
              <button className="link-button" onClick={() => setScreen('login')}>Heb je al een account? Log in</button>
            </div>
          </section>
        )}

        {screen === 'forgot' && (
          <section className="center-page">
            <div className="card form-card">
              <button className="back" onClick={() => setScreen('login')}>← Terug naar inloggen</button>
              <span className="pill">Account herstellen</span>
              <h1>Wachtwoord vergeten</h1>
              <p className="subtitle">Vul je e-mailadres in om een herstel-link te ontvangen.</p>
              <label>E-mailadres<input placeholder="naam@student.hhs.nl" /></label>
              <button onClick={() => showToast('Als dit e-mailadres bekend is, ontvang je een herstel-link.')}>Herstel-link versturen</button>
            </div>
          </section>
        )}

        {screen === 'dashboard' && (
          <section className="dashboard-page">
            <div className="dashboard-hero">
              <div>
                <span className="pill">Goedemorgen Frank</span>
                <h1>Waar wil je naartoe?</h1>
                <p>Je routes, meldingen en ondersteuningsaanvragen staan overzichtelijk op één plek.</p>
                <div className="hero-actions">
                  <button onClick={() => setScreen('route')}>Route zoeken</button>
                  <button className="secondary" onClick={() => setScreen('report')}>Drempel melden</button>
                </div>
              </div>
              <div className="hero-phone-card">
                <span>Vandaag</span>
                <strong>{activeObstacles.length}</strong>
                <p>actieve campusmeldingen</p>
              </div>
            </div>

            <div className="stats-grid">
              <article><strong>{activeObstacles.length}</strong><span>Actieve obstakels</span></article>
              <article><strong>{requests.filter((request) => request.status === 'Goedgekeurd').length}</strong><span>Goedgekeurd</span></article>
              <article><strong>{requests.filter((request) => request.status === 'In behandeling').length}</strong><span>In behandeling</span></article>
              <article><strong>24/7</strong><span>PWA beschikbaar</span></article>
            </div>

            <div className="dashboard-grid">
              <button className="feature-card primary-feature" onClick={() => setScreen('route')}>
                <span>🧭</span>
                <h2>Toegankelijke route zoeken</h2>
                <p>Vind een route die liften, obstakels en rustpunten meeneemt.</p>
              </button>
              <button className="feature-card" onClick={() => setScreen('support')}>
                <span>📄</span>
                <h2>Voorziening aanvragen</h2>
                <p>Vraag extra tijd, aangepaste tafels of begeleiding aan.</p>
              </button>
              <button className="feature-card" onClick={() => setScreen('requests')}>
                <span>✅</span>
                <h2>Mijn aanvragen</h2>
                <p>Bekijk statussen en wat je nog moet aanvullen.</p>
              </button>
              <button className="feature-card" onClick={() => setScreen('rights')}>
                <span>⚖️</span>
                <h2>Rechten & regelingen</h2>
                <p>Lees kort wat je mag verwachten van passend onderwijs.</p>
              </button>
              <button className="feature-card" onClick={() => setScreen('contact')}>
                <span>💬</span>
                <h2>Contactpersoon</h2>
                <p>Stuur een bericht of plan een afspraak met begeleiding.</p>
              </button>
              <button className="feature-card alert-feature" onClick={() => setScreen('report')}>
                <span>⚠️</span>
                <h2>Drempel melden</h2>
                <p>Help anderen door kapotte liften of blokkades te melden.</p>
              </button>
            </div>
          </section>
        )}

        {screen === 'route' && (
          <section className="route-page">
            <div className="page-title-row">
              <div>
                <span className="pill">Toegankelijke navigatie</span>
                <h1>Route zoeken</h1>
                <p>Zoals een navigatie-app: kies je bestemming, controleer live meldingen en ontvang direct een alternatieve route.</p>
              </div>
              <button className="secondary" onClick={() => setScreen('dashboard')}>← Dashboard</button>
            </div>

            <div className="route-shell">
              <div className="route-main-column">
                <div className="route-planner-card">
                  <div className="route-input-row">
                    <label>
                      Van
                      <select value={from} onChange={(event) => { setFrom(event.target.value); setTo('bibliotheek'); setRouteResult(null); }}>
                        <option value="hoofdingang">Hoofdingang</option>
                      </select>
                    </label>
                    <div className="route-swap" aria-hidden="true">→</div>
                    <label>
                      Naar
                      <select value={to} onChange={(event) => { setTo(event.target.value); setRouteResult(null); }}>
                        {destinationOptions.map((location) => (
                          <option key={location.id} value={location.id}>{location.name}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="route-chips" aria-label="Toegankelijkheidsvoorkeuren">
                    {[
                      ['avoidStairs', '♿ Vermijd trappen'],
                      ['elevators', '🛗 Liften controleren'],
                      ['avoidObstacles', '🚧 Obstakels vermijden'],
                      ['quiet', '🌿 Rustige route'],
                      ['restSpots', '🪑 Rustplekken tonen'],
                    ].map(([key, label]) => (
                      <button
                        key={key}
                        className={preferences[key] ? 'chip active' : 'chip'}
                        onClick={() => setPreferences({ ...preferences, [key]: !preferences[key] })}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <button className="primary-route-button" onClick={calculateRoute}>Route berekenen</button>
                </div>

                <div className="map-card">
                  <div className="map-card-header">
                    <h2>Campuskaart</h2>
                    <div className="map-legend">
                      <span><i className="legend-dot blue"></i>Normaal</span>
                      <span><i className="legend-dot green"></i>Aangepast</span>
                      <span><i className="legend-dot red"></i>Obstakel</span>
                    </div>
                  </div>
                  <div className={`campus-map improved-map ${routeResult?.adjusted ? 'has-alternative-route' : ''} ${routeResult?.found && !routeResult.adjusted ? 'has-normal-route' : ''}`} aria-label="Prototype campuskaart gebaseerd op De Haagse Hogeschool">
                    <div className="route-line normal-line"></div>
                    <div className="route-line alt-line-one"></div>
                    <div className="route-line alt-line-two"></div>
                    <div className="zone strip">Strip</div>
                    <div className="zone sporthal">Sporthal</div>
                    <div className="zone ovaal">Ovaal<br /><small>Hoofdingang</small></div>
                    <div className="zone slinger">Slinger<br /><small>Bibliotheek</small></div>
                    <div className="zone rugzak rugzak-one">Rugzak 1</div>
                    <div className="zone rugzak rugzak-two">Rugzak 2</div>
                    {activeObstacles.some((obstacle) => obstacle.locationId === 'lift_slinger') && <div className="map-marker marker-lift-slinger">⚠ Lift Slinger</div>}
                    {activeObstacles.some((obstacle) => obstacle.locationId === 'brug_rugzak') && <div className="map-marker marker-bridge">⚠ Bridge</div>}
                  </div>
                </div>

                {routeResult && !routeResult.found && (
                  <div className="route-result-sheet">
                    <h2>Geen route gevonden</h2>
                    <p>{routeResult.message}</p>
                  </div>
                )}

                {currentRoute && (
                  <div className={routeResult?.adjusted ? 'route-result-sheet warning-sheet' : 'route-result-sheet success-sheet'}>
                    <div className="result-sheet-header">
                      <div>
                        <span className="pill">{routeResult.adjusted ? 'Aangepaste route' : 'Routeadvies'}</span>
                        <h2>{currentRoute.title}</h2>
                      </div>
                      <div className="route-metrics">
                        <strong>{currentRoute.timeMinutes} min</strong>
                        <span>{currentRoute.distance}</span>
                      </div>
                    </div>
                    {routeResult.adjusted && <p className="warning">Let op: {getLocationName(routeResult.blockedNode)} is gemeld als obstakel. De route is automatisch aangepast.</p>}
                    {!routeResult.adjusted && <p className="success-message">Deze route is toegankelijk en bevat geen actieve obstakels.</p>}
                    {routeResult.adjusted && routeResult.alternativeRoute && (
                      <div className="route-comparison">
                        <RoutePath title={`Oude route · ${routeResult.originalRoute.timeMinutes} min · niet beschikbaar`} path={routeResult.originalRoute.path} type="blocked" />
                        <RoutePath title={`Nieuwe route · ${routeResult.alternativeRoute.timeMinutes} min · volledig toegankelijk`} path={routeResult.alternativeRoute.path} type="alternative" />
                      </div>
                    )}
                    {!routeResult.adjusted && <RoutePath title="Route in stappen" path={currentRoute.path} type="normal" />}
                    <ol className="step-list">
                      {currentRoute.steps.map((step) => <li key={step}>{step}</li>)}
                    </ol>
                    <div className="ai-card"><strong>AccessStudy AI-routeassistent</strong><p>{routeResult.aiMessage}</p></div>
                  </div>
                )}
              </div>

              <aside className="route-side-panel">
                <div className="side-card live-card">
                  <h2>Live meldingen</h2>
                  <p>{activeObstacles.length} actieve meldingen beïnvloeden routes.</p>
                </div>
                {activeObstacles.length === 0 && <p className="empty-state">Er zijn geen actieve obstakels gemeld.</p>}
                {activeObstacles.map((obstacle) => (
                  <div className={`compact-obstacle severity-${obstacle.severity.toLowerCase()}`} key={obstacle.id}>
                    <div>
                      <strong>{getLocationName(obstacle.locationId)}</strong>
                      <p>{obstacle.type} · {obstacle.severity}</p>
                      <small>{obstacle.reportedBy} · {obstacle.updatedAt}</small>
                    </div>
                    <button className="secondary small-button" onClick={() => removeObstacle(obstacle.id)}>Opgelost</button>
                  </div>
                ))}
                <button className="secondary" onClick={() => setScreen('report')}>+ Obstakel melden</button>
              </aside>
            </div>
          </section>
        )}

        {screen === 'report' && (
          <section className="split-page">
            <div>
              <span className="pill">Campus verbeteren</span>
              <h1>Drempel melden</h1>
              <p>Meld een probleem zodat AccessStudy routes direct kan aanpassen voor andere studenten.</p>
              <div className="tip-card">Tip: hoe specifieker de locatie, hoe beter de routeplanner kan omleiden.</div>
            </div>
            <form onSubmit={addObstacle} className="card form-card">
              <button type="button" className="back" onClick={() => setScreen('dashboard')}>← Dashboard</button>
              <label>
                Locatie
                <select value={newObstacle.locationId} onChange={(event) => setNewObstacle({ ...newObstacle, locationId: event.target.value })}>
                  {campusLocations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
                </select>
              </label>
              <label>
                Type obstakel
                <select value={newObstacle.type} onChange={(event) => setNewObstacle({ ...newObstacle, type: event.target.value })}>
                  <option>Lift kapot</option>
                  <option>Deur geblokkeerd</option>
                  <option>Gang te smal</option>
                  <option>Bridge geblokkeerd</option>
                  <option>Geen aangepaste tafel aanwezig</option>
                  <option>Rolstoeltoilet buiten gebruik</option>
                </select>
              </label>
              <label>
                Ernst
                <select value={newObstacle.severity} onChange={(event) => setNewObstacle({ ...newObstacle, severity: event.target.value })}>
                  <option>Laag</option>
                  <option>Gemiddeld</option>
                  <option>Hoog</option>
                </select>
              </label>
              <label>
                Korte beschrijving
                <textarea placeholder="Beschrijf wat er aan de hand is." value={newObstacle.description} onChange={(event) => setNewObstacle({ ...newObstacle, description: event.target.value })} />
              </label>
              <label>
                Foto toevoegen
                <input type="file" />
              </label>
              <button type="submit">Probleem melden</button>
            </form>
          </section>
        )}

        {screen === 'support' && (
          <section className="support-page">
            <div className="page-title-row">
              <div>
                <span className="pill">Ondersteuning</span>
                <h1>Voorziening aanvragen</h1>
                <p>Vraag snel ondersteuning aan die je nodig hebt om goed te kunnen studeren.</p>
              </div>
              <button className="secondary" onClick={() => setScreen('dashboard')}>← Dashboard</button>
            </div>
            <form onSubmit={submitSupportRequest} className="card wide-form-card">
              <div className="support-grid">
                {['Aangepaste tafel', 'Extra tijd bij toetsen', 'Hulp bij vervoer', 'Toegankelijke toetsruimte', 'Begeleiding vanuit de opleiding'].map((option) => (
                  <label className={supportRequest.title === option ? 'option-card selected' : 'option-card'} key={option}>
                    <input type="radio" checked={supportRequest.title === option} onChange={() => setSupportRequest({ ...supportRequest, title: option })} />
                    {option}
                  </label>
                ))}
              </div>
              <div className="form-grid two-columns">
                <label>Datum<input type="date" value={supportRequest.date} onChange={(event) => setSupportRequest({ ...supportRequest, date: event.target.value })} /></label>
                <label>Locatie<input placeholder="Bijvoorbeeld Ovaal 1.02" value={supportRequest.location} onChange={(event) => setSupportRequest({ ...supportRequest, location: event.target.value })} /></label>
                <label className="full-width">Korte toelichting<textarea placeholder="Beschrijf kort welke ondersteuning je nodig hebt." value={supportRequest.description} onChange={(event) => setSupportRequest({ ...supportRequest, description: event.target.value })} /></label>
              </div>
              <button type="submit">Aanvraag versturen</button>
            </form>
          </section>
        )}

        {screen === 'requests' && (
          <section className="requests-page">
            <div className="page-title-row">
              <div>
                <span className="pill">Overzicht</span>
                <h1>Mijn aanvragen</h1>
                <p>Bekijk de status van je ondersteuningsaanvragen.</p>
              </div>
              <button className="secondary" onClick={() => setScreen('support')}>Nieuwe aanvraag</button>
            </div>
            <div className="request-summary">
              <article><strong>{requests.length}</strong><span>Totaal</span></article>
              <article><strong>{requests.filter((request) => request.status === 'Goedgekeurd').length}</strong><span>Goedgekeurd</span></article>
              <article><strong>{requests.filter((request) => request.status === 'In behandeling').length}</strong><span>In behandeling</span></article>
            </div>
            <div className="list-stack">
              {requests.map((request) => (
                <article className={`request-card ${request.status === 'Goedgekeurd' ? 'approved' : request.status === 'In behandeling' ? 'pending' : 'rejected'}`} key={request.id}>
                  <div>
                    <span className="status-badge">{request.status}</span>
                    <h2>{request.title}</h2>
                    <p>{request.meta}</p>
                  </div>
                  <small>{request.date}</small>
                </article>
              ))}
            </div>
          </section>
        )}

        {screen === 'rights' && (
          <section className="rights-page">
            <div className="page-title-row">
              <div>
                <span className="pill">Informatie</span>
                <h1>Rechten & regelingen</h1>
                <p>Korte en duidelijke uitleg, geïnspireerd op overzichtelijke overheidswebsites.</p>
              </div>
              <button className="secondary" onClick={() => setScreen('dashboard')}>← Dashboard</button>
            </div>
            <div className="info-grid">
              <article className="info-card"><span>⚖️</span><h2>Recht op passende ondersteuning</h2><p>Je opleiding moet redelijke aanpassingen bieden wanneer je door een beperking extra ondersteuning nodig hebt.</p><button className="link-button" onClick={() => setScreen('contact')}>Vraag hulp</button></article>
              <article className="info-card"><span>👥</span><h2>Studentendecaan</h2><p>De studentendecaan helpt bij regelingen, begeleiding en contact met je opleiding.</p><button className="link-button" onClick={() => setScreen('contact')}>Plan gesprek</button></article>
              <article className="info-card"><span>📝</span><h2>Toetsvoorzieningen</h2><p>Denk aan extra tijd, een rustige toetsruimte, aangepaste tafel of digitale hulpmiddelen.</p><button className="link-button" onClick={() => setScreen('support')}>Aanvragen</button></article>
              <article className="info-card"><span>🏫</span><h2>Toegankelijkheid gebouwen</h2><p>Je kunt drempels melden, zoals kapotte liften, te smalle deuren of lokalen die niet bereikbaar zijn.</p><button className="link-button" onClick={() => setScreen('report')}>Meld drempel</button></article>
            </div>
          </section>
        )}

        {screen === 'contact' && (
          <section className="contact-page">
            <div className="contact-card card">
              <button className="back" onClick={() => setScreen('dashboard')}>← Dashboard</button>
              <div className="profile-card premium-profile">
                <div className="avatar">MB</div>
                <div>
                  <span className="pill">Vandaag beschikbaar</span>
                  <h1>M. van der Berg</h1>
                  <p>Studentbegeleider HHS · Beschikbaar tot 16:30</p>
                </div>
              </div>
              <div className="contact-actions">
                <button onClick={() => showToast('Bericht verstuurd naar studentbegeleider.')}>Bericht sturen</button>
                <button className="secondary" onClick={() => showToast('Afspraakverzoek ingepland.')}>Afspraak maken</button>
                <button className="secondary" onClick={() => showToast('Uploadfunctie geopend in prototype.')}>Document uploaden</button>
              </div>
            </div>
          </section>
        )}

        {screen === 'settings' && (
          <section className="settings-page">
            <div className="card form-card">
              <button className="back" onClick={() => setScreen('dashboard')}>← Dashboard</button>
              <span className="pill">Profiel</span>
              <h1>Instellingen</h1>
              <label className="checkbox"><input type="checkbox" checked={highContrast} onChange={() => setHighContrast(!highContrast)} /> Hoog contrast gebruiken</label>
              <label className="checkbox"><input type="checkbox" defaultChecked /> Grote knoppen tonen</label>
              <label className="checkbox"><input type="checkbox" defaultChecked /> Routewaarschuwingen hardop tonen</label>
              <button onClick={() => showToast('Instellingen opgeslagen.')}>Instellingen opslaan</button>
            </div>
          </section>
        )}
      </main>
      <BottomNavigation screen={screen} setScreen={setScreen} />
    </div>
  );
}

export default App;
