import { useMemo, useState } from 'react';
import './App.css';

const campusLocations = [
  { id: 'hoofdingang', name: 'Hoofdingang / Entrance', zone: 'Ovaal', accessible: true },
  { id: 'receptie', name: 'Receptie / Beveiliging', zone: 'Ovaal / Slinger', accessible: true },
  { id: 'ovaal', name: 'Ovaal centraal punt', zone: 'Ovaal', accessible: true },
  { id: 'bibliotheek', name: 'Bibliotheek', zone: 'Slinger', accessible: true },
  { id: 'central_restaurant', name: 'Central Restaurant', zone: 'Strip', accessible: true },
  { id: 'copijshop', name: 'Copyshop / Strip 0.76', zone: 'Strip', accessible: true },
  { id: 'floweroffice', name: 'FlowerOffice F211 / Ovaal 1.67', zone: 'Ovaal', accessible: true },
  { id: 'aula', name: 'Aula', zone: 'Strip', accessible: true },
  { id: 'speakers_corner', name: 'Speakers’ Corner', zone: 'Strip', accessible: true },
  { id: 'sporthal', name: 'Sporthal + Fitness', zone: 'Sporthal', accessible: true },
  { id: 'studentpsycholoog', name: 'Studentpsycholoog / Ovaal 4.28', zone: 'Ovaal', accessible: true },
  { id: 'lighthouse_cafe', name: 'Lighthouse Café', zone: 'Ovaal', accessible: true },
  { id: 'csi', name: 'CSI / Ovaal 1.02', zone: 'Ovaal', accessible: true },
  { id: 'rugzak1', name: 'Rugzak 1', zone: 'Rugzak', accessible: true },
  { id: 'rugzak2', name: 'Rugzak 2', zone: 'Rugzak', accessible: true },
  { id: 'lift_ovaal', name: 'Lift Ovaal', zone: 'Ovaal', accessible: true },
  { id: 'lift_slinger', name: 'Lift Slinger', zone: 'Slinger', accessible: true },
  { id: 'lift_strip', name: 'Lift Strip', zone: 'Strip', accessible: true },
  { id: 'lift_sporthal', name: 'Lift Sporthal', zone: 'Sporthal', accessible: true },
  { id: 'brug_rugzak', name: 'Bridge naar Rugzak', zone: 'Slinger / Rugzak', accessible: true },
];

const predefinedRoutes = [
  {
    id: 'route-hoofdingang-bibliotheek',
    from: 'hoofdingang',
    to: 'bibliotheek',
    title: 'Hoofdingang naar Bibliotheek',
    timeMinutes: 5,
    accessibility: 'Volledig rolstoeltoegankelijk',
    path: ['hoofdingang', 'receptie', 'lift_slinger', 'bibliotheek'],
    steps: [
      'Start bij de Hoofdingang / Entrance.',
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
    accessibility: 'Rolstoeltoegankelijk via Ovaal en Strip',
    path: ['hoofdingang', 'ovaal', 'lift_ovaal', 'lift_strip', 'central_restaurant'],
    steps: [
      'Start bij de Hoofdingang / Entrance.',
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
    accessibility: 'Rolstoeltoegankelijk via Ovaal en Strip',
    path: ['hoofdingang', 'ovaal', 'lift_strip', 'speakers_corner', 'aula'],
    steps: [
      'Start bij de Hoofdingang / Entrance.',
      'Ga via de Ovaal richting de Strip.',
      'Gebruik Lift Strip als verdieping wisselen nodig is.',
      'Passeer Speakers’ Corner.',
      'Ga door naar de Aula.',
    ],
  },
  {
    id: 'route-hoofdingang-sporthal',
    from: 'hoofdingang',
    to: 'sporthal',
    title: 'Hoofdingang naar Sporthal + Fitness',
    timeMinutes: 9,
    accessibility: 'Rolstoeltoegankelijk via Ovaal en Sporthal-route',
    path: ['hoofdingang', 'ovaal', 'lift_sporthal', 'sporthal'],
    steps: [
      'Start bij de Hoofdingang / Entrance.',
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
    title: 'Hoofdingang naar Studentpsycholoog / Ovaal 4.28',
    timeMinutes: 4,
    accessibility: 'Kortste toegankelijke route binnen Ovaal',
    path: ['hoofdingang', 'ovaal', 'lift_ovaal', 'studentpsycholoog'],
    steps: [
      'Start bij de Hoofdingang / Entrance.',
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
    accessibility: 'Rolstoeltoegankelijk via Slinger en Bridge',
    path: ['hoofdingang', 'receptie', 'lift_slinger', 'brug_rugzak', 'rugzak1'],
    steps: [
      'Start bij de Hoofdingang / Entrance.',
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
    accessibility: 'Rolstoeltoegankelijk via Slinger en Bridge',
    path: ['hoofdingang', 'receptie', 'lift_slinger', 'brug_rugzak', 'rugzak2'],
    steps: [
      'Start bij de Hoofdingang / Entrance.',
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
    accessibility: 'Korte toegankelijke route bij de ingang',
    path: ['hoofdingang', 'ovaal', 'csi'],
    steps: [
      'Start bij de Hoofdingang / Entrance.',
      'Ga de Ovaal binnen.',
      'Volg de route naar CSI / International Office / Ovaal 1.02.',
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
    affectedTo: ['aula', 'central_restaurant', 'copijshop'],
    reason: 'Lift Strip is gemeld als obstakel.',
    alternativePath: ['hoofdingang', 'ovaal', 'lift_ovaal', 'central_restaurant'],
    message: 'Gebruik Lift Ovaal en ga daarna richting de Strip.',
    extraMinutes: 4,
  },
  {
    blockedLocation: 'lift_ovaal',
    affectedTo: ['studentpsycholoog', 'floweroffice', 'central_restaurant'],
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
  },
  {
    id: 2,
    locationId: 'brug_rugzak',
    type: 'Doorgang geblokkeerd',
    severity: 'Gemiddeld',
    description: 'Bridge naar Rugzak is deels geblokkeerd door onderhoud.',
    active: true,
  },
];

function getLocationName(locationId) {
  return campusLocations.find((location) => location.id === locationId)?.name || locationId;
}

function calculateAccessibleRoute(from, to, activeObstacles = []) {
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

  if (!blockedNode) {
    return {
      found: true,
      adjusted: false,
      route,
      aiMessage: 'Deze route bevat geen actieve obstakels en is geschikt als toegankelijke route.',
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
        {path.map((node, index) => (
          <span className="route-node" key={`${node}-${index}`}>
            {getLocationName(node)}
          </span>
        ))}
      </div>
    </div>
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
  const [newObstacle, setNewObstacle] = useState({
    locationId: 'lift_slinger',
    type: 'Lift kapot',
    severity: 'Hoog',
    description: '',
  });

  const activeObstacles = useMemo(
    () => obstacles.filter((obstacle) => obstacle.active),
    [obstacles]
  );

  const destinationOptions = campusLocations.filter((location) =>
    predefinedRoutes.some((route) => route.from === from && route.to === location.id)
  );

  function handleLogin(event) {
    event.preventDefault();
    if (!email || !password) {
      setLoginError('Controleer je e-mailadres of wachtwoord.');
      return;
    }
    setLoginError('');
    setScreen('dashboard');
  }

  function calculateRoute() {
    const result = calculateAccessibleRoute(from, to, activeObstacles);
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
      },
    ]);
    setRouteResult(null);
    setScreen('route');
  }

  function removeObstacle(id) {
    setObstacles(obstacles.map((obstacle) =>
      obstacle.id === id ? { ...obstacle, active: false } : obstacle
    ));
    setRouteResult(null);
  }

  return (
    <main className="app-shell">
      {screen === 'welcome' && (
        <section className="card hero-card">
          <div className="logo-mark">♿</div>
          <p className="eyebrow">SDG 4 · Inclusief onderwijs</p>
          <h1>AccessStudy</h1>
          <p className="subtitle">Studeren zonder onnodige drempels</p>
          <div className="hero-illustration">Toegankelijke routehulp voor De Haagse Hogeschool</div>
          <button onClick={() => setScreen('login')}>Inloggen</button>
          <button className="secondary" onClick={() => setScreen('register')}>Account aanmaken</button>
          <button className="link-button" onClick={() => setScreen('forgot')}>Wachtwoord vergeten?</button>
        </section>
      )}

      {screen === 'login' && (
        <section className="card">
          <button className="back" onClick={() => setScreen('welcome')}>← Terug</button>
          <h1>Inloggen</h1>
          <form onSubmit={handleLogin} className="form-grid">
            <label>
              Gebruikersnaam of e-mailadres
              <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="naam@student.nl" />
            </label>
            <label>
              Wachtwoord
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Vul je wachtwoord in" />
            </label>
            {loginError && <p className="error-message">{loginError}</p>}
            <button type="submit">Inloggen</button>
          </form>
          <button className="link-button" onClick={() => setScreen('forgot')}>Wachtwoord vergeten?</button>
          <button className="link-button" onClick={() => setScreen('register')}>Nog geen account? Registreer hier</button>
        </section>
      )}

      {screen === 'register' && (
        <section className="card">
          <button className="back" onClick={() => setScreen('welcome')}>← Terug</button>
          <h1>Account aanmaken</h1>
          <div className="form-grid">
            <input placeholder="Naam" />
            <input placeholder="E-mailadres" />
            <input placeholder="Wachtwoord" type="password" />
            <input placeholder="Wachtwoord bevestigen" type="password" />
            <input placeholder="Onderwijsinstelling" />
            <input placeholder="Studentnummer optioneel" />
            <label className="checkbox"><input type="checkbox" /> Ik ga akkoord met de privacyvoorwaarden</label>
            <button onClick={() => setScreen('dashboard')}>Account aanmaken</button>
          </div>
          <button className="link-button" onClick={() => setScreen('login')}>Heb je al een account? Log in</button>
        </section>
      )}

      {screen === 'forgot' && (
        <section className="card">
          <button className="back" onClick={() => setScreen('login')}>← Terug naar inloggen</button>
          <h1>Wachtwoord vergeten</h1>
          <p>Vul je e-mailadres in om een herstel-link te ontvangen.</p>
          <input placeholder="E-mailadres" />
          <button>Herstel-link versturen</button>
          <p className="success-message">Als dit e-mailadres bekend is, ontvang je een herstel-link.</p>
        </section>
      )}

      {screen === 'dashboard' && (
        <section className="card wide-card">
          <h1>Welkom, Frank</h1>
          <p className="subtitle">Wat wil je vandaag doen?</p>
          <div className="tile-grid">
            <button onClick={() => setScreen('route')}>Toegankelijke route zoeken</button>
            <button onClick={() => setScreen('support')}>Voorziening aanvragen</button>
            <button onClick={() => setScreen('requests')}>Mijn aanvragen</button>
            <button onClick={() => setScreen('rights')}>Rechten & regelingen</button>
            <button onClick={() => setScreen('contact')}>Contactpersoon</button>
            <button onClick={() => setScreen('report')}>Drempel melden</button>
          </div>
        </section>
      )}

      {screen === 'route' && (
        <section className="card wide-card">
          <button className="back" onClick={() => setScreen('dashboard')}>← Dashboard</button>
          <h1>Toegankelijke route zoeken</h1>
          <p className="subtitle">Routes gebaseerd op de TH-plattegrond met Ovaal, Slinger, Strip, Sporthal en Rugzak.</p>

          <div className="route-controls">
            <label>
              Vertrekpunt
              <select value={from} onChange={(event) => {
                setFrom(event.target.value);
                setTo('bibliotheek');
                setRouteResult(null);
              }}>
                <option value="hoofdingang">Hoofdingang / Entrance</option>
              </select>
            </label>
            <label>
              Bestemming
              <select value={to} onChange={(event) => {
                setTo(event.target.value);
                setRouteResult(null);
              }}>
                {destinationOptions.map((location) => (
                  <option key={location.id} value={location.id}>{location.name}</option>
                ))}
              </select>
            </label>
            <button onClick={calculateRoute}>Route berekenen</button>
          </div>

          <div className="preference-list">
            <span>✓ Vermijd trappen</span>
            <span>✓ Alleen toegankelijke routes</span>
            <span>✓ Liften controleren</span>
            <span>✓ Obstakels vermijden</span>
          </div>

          <div className="campus-map" aria-label="Prototype campuskaart gebaseerd op de plattegrond">
            <div className="zone strip">Strip</div>
            <div className="zone sporthal">Sporthal</div>
            <div className="zone ovaal">Ovaal<br /><small>Hoofdingang</small></div>
            <div className="zone slinger">Slinger<br /><small>Bibliotheek</small></div>
            <div className="zone rugzak rugzak-one">Rugzak 1</div>
            <div className="zone rugzak rugzak-two">Rugzak 2</div>
            <div className="map-marker marker-lift-slinger">⚠ Lift Slinger</div>
            <div className="map-marker marker-bridge">⚠ Bridge</div>
          </div>

          {routeResult && !routeResult.found && (
            <div className="result-card">
              <h2>Geen route gevonden</h2>
              <p>{routeResult.message}</p>
            </div>
          )}

          {routeResult?.found && !routeResult.adjusted && (
            <div className="result-card">
              <h2>Routeadvies</h2>
              <p className="success-message">Deze route is volledig toegankelijk.</p>
              <RoutePath title={`${routeResult.route.title} · ${routeResult.route.timeMinutes} minuten`} path={routeResult.route.path} type="normal" />
              <ol>
                {routeResult.route.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
              <p className="ai-box">AccessStudy AI: {routeResult.aiMessage}</p>
            </div>
          )}

          {routeResult?.found && routeResult.adjusted && routeResult.alternativeRoute && (
            <div className="result-card">
              <h2>Route automatisch aangepast</h2>
              <p className="warning">Let op: {getLocationName(routeResult.blockedNode)} is gemeld als obstakel.</p>
              <RoutePath title={`Oude route · ${routeResult.originalRoute.timeMinutes} minuten · niet beschikbaar`} path={routeResult.originalRoute.path} type="blocked" />
              <RoutePath title={`Nieuwe route · ${routeResult.alternativeRoute.timeMinutes} minuten · volledig toegankelijk`} path={routeResult.alternativeRoute.path} type="alternative" />
              <ol>
                {routeResult.alternativeRoute.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
              <p className="ai-box">AccessStudy AI: {routeResult.aiMessage}</p>
            </div>
          )}

          {routeResult?.found && routeResult.adjusted && !routeResult.alternativeRoute && (
            <div className="result-card">
              <h2>Route bevat obstakel</h2>
              <p className="warning">{routeResult.aiMessage}</p>
              <button onClick={() => setScreen('contact')}>Neem contact op met begeleiding</button>
            </div>
          )}

          <div className="obstacle-list">
            <h2>Actieve meldingen op de campus</h2>
            {activeObstacles.length === 0 && <p>Er zijn op dit moment geen actieve obstakels gemeld.</p>}
            {activeObstacles.map((obstacle) => (
              <div className="obstacle-item" key={obstacle.id}>
                <div>
                  <strong>{getLocationName(obstacle.locationId)}</strong>
                  <p>{obstacle.type} · Ernst: {obstacle.severity}</p>
                  {obstacle.description && <p>{obstacle.description}</p>}
                </div>
                <button className="secondary small-button" onClick={() => removeObstacle(obstacle.id)}>Opgelost</button>
              </div>
            ))}
            <button className="secondary" onClick={() => setScreen('report')}>Nieuw obstakel melden</button>
          </div>
        </section>
      )}

      {screen === 'report' && (
        <section className="card">
          <button className="back" onClick={() => setScreen('dashboard')}>← Dashboard</button>
          <h1>Drempel melden</h1>
          <form onSubmit={addObstacle} className="form-grid">
            <label>
              Locatie
              <select value={newObstacle.locationId} onChange={(event) => setNewObstacle({ ...newObstacle, locationId: event.target.value })}>
                {campusLocations.map((location) => (
                  <option key={location.id} value={location.id}>{location.name}</option>
                ))}
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
            <button type="submit">Probleem melden</button>
          </form>
          <p className="success-message">Je melding wordt meegenomen bij het berekenen van toegankelijke routes.</p>
        </section>
      )}

      {screen === 'support' && (
        <section className="card wide-card">
          <button className="back" onClick={() => setScreen('dashboard')}>← Dashboard</button>
          <h1>Voorziening aanvragen</h1>
          <p className="subtitle">Vraag snel ondersteuning aan die je nodig hebt om goed te kunnen studeren.</p>
          <div className="support-grid">
            <label className="option-card"><input type="checkbox" /> Aangepaste tafel</label>
            <label className="option-card"><input type="checkbox" /> Extra tijd bij toetsen</label>
            <label className="option-card"><input type="checkbox" /> Hulp bij vervoer</label>
            <label className="option-card"><input type="checkbox" /> Toegankelijke toetsruimte</label>
            <label className="option-card"><input type="checkbox" /> Begeleiding vanuit de opleiding</label>
          </div>
          <div className="form-grid two-columns">
            <label>Datum<input type="date" /></label>
            <label>Locatie<input placeholder="Bijvoorbeeld Ovaal 1.02" /></label>
            <label className="full-width">Korte toelichting<textarea placeholder="Beschrijf kort welke ondersteuning je nodig hebt." /></label>
          </div>
          <button onClick={() => setScreen('requests')}>Aanvraag versturen</button>
          <p className="success-message">Na versturen verschijnt je aanvraag bij “Mijn aanvragen”.</p>
        </section>
      )}

      {screen === 'requests' && (
        <section className="card wide-card">
          <button className="back" onClick={() => setScreen('dashboard')}>← Dashboard</button>
          <h1>Mijn aanvragen</h1>
          <p className="subtitle">Bekijk de status van je ondersteuningsaanvragen.</p>
          <div className="request-summary">
            <div><strong>3</strong><span>Totaal</span></div>
            <div><strong>1</strong><span>Goedgekeurd</span></div>
            <div><strong>1</strong><span>In behandeling</span></div>
          </div>
          <div className="list-stack">
            <div className="request-card approved"><span className="status-badge">Goedgekeurd</span><h2>Extra tijd toets</h2><p>Toetsweek · Lokaal T2.04 · 25% extra tijd</p></div>
            <div className="request-card pending"><span className="status-badge">In behandeling</span><h2>Aangepaste tafel Ovaal 1.02</h2><p>Aangevraagd voor maandag 09:00.</p></div>
            <div className="request-card rejected"><span className="status-badge">Aanpassen nodig</span><h2>Hulp bij vervoer</h2><p>Er is extra informatie nodig over de gewenste dagen.</p></div>
          </div>
          <button className="secondary" onClick={() => setScreen('support')}>Nieuwe aanvraag doen</button>
        </section>
      )}

      {screen === 'rights' && (
        <section className="card wide-card">
          <button className="back" onClick={() => setScreen('dashboard')}>← Dashboard</button>
          <h1>Rechten & regelingen</h1>
          <p className="subtitle">Korte uitleg over ondersteuning waar je als student gebruik van kunt maken.</p>
          <div className="info-grid">
            <article className="info-card"><h2>Recht op passende ondersteuning</h2><p>Je opleiding moet redelijke aanpassingen bieden wanneer je door een beperking extra ondersteuning nodig hebt.</p></article>
            <article className="info-card"><h2>Studentendecaan</h2><p>De studentendecaan helpt bij regelingen, begeleiding en contact met je opleiding.</p></article>
            <article className="info-card"><h2>Toetsvoorzieningen</h2><p>Denk aan extra tijd, een rustige toetsruimte, aangepaste tafel of digitale hulpmiddelen.</p></article>
            <article className="info-card"><h2>Toegankelijkheid gebouwen</h2><p>Je kunt drempels melden, zoals kapotte liften, te smalle deuren of lokalen die niet bereikbaar zijn.</p></article>
          </div>
          <button onClick={() => setScreen('contact')}>Neem contact op met begeleiding</button>
        </section>
      )}

      {screen === 'contact' && (
        <section className="card">
          <button className="back" onClick={() => setScreen('dashboard')}>← Dashboard</button>
          <h1>Contactpersoon</h1>
          <div className="profile-card">
            <div className="avatar">MB</div>
            <div>
              <h2>M. van der Berg</h2>
              <p>Studentbegeleider HHS</p>
              <p className="subtitle">Beschikbaar vandaag tot 16:30</p>
            </div>
          </div>
          <div className="contact-actions">
            <button>Bericht sturen</button>
            <button className="secondary">Afspraak maken</button>
            <button className="secondary">Document uploaden</button>
          </div>
          <p className="success-message">Je bericht of afspraakverzoek wordt veilig naar de studentbegeleider gestuurd.</p>
        </section>
      )}
    </main>
  );
}

export default App;
