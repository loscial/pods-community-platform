// Vercel Serverless Function: /api/calendar
// Genera il feed live iCalendar (.ics) sincronizzabile automaticamente con Google Calendar, Apple Calendar e Outlook
// Gestisce anche il salvataggio di nuovi eventi creati dalla piattaforma PODS.

const fs = require('fs');

const TMP_CAL_PATH = '/tmp/pods_calendar_db.json';

// Eventi predefiniti della community PODS (Piemonte Orientale Digitale e Solidale)
const DEFAULT_EVENTS = [
  {
    id: "ev-1",
    title: "Assemblea Soci & Follow-up Tavoli Operativi (Silicon Box & Data Center Trino)",
    date: "2026-11-05",
    time: "18:45 - 20:15",
    type: "plenary",
    typeLabel: "Assemblea & Ecosistemi",
    locationType: "meet",
    meetLink: "https://meet.google.com/pod-plen-nov",
    locationAddress: "Online su Google Meet & Sede Vercelli",
    organizer: "Consiglio Direttivo PODS",
    group: "Tutti i Soci",
    description: "Aggiornamento sui paper esecutivi di 4 pagine dedicati al Data Center 400MW di Trino Vercellese e all'insediamento di Silicon Box a Novara per il confronto con le Unioni Industriali.",
    notes: "Rif. Verbale Assemblea 27 Settembre: coordinamento scientifico con Simona Cavallini, Elena Franco e Roberta Roberto."
  },
  {
    id: "ev-2",
    title: "Allineamento Formatori 'Intelligenti, non artificiali' - Avvio Shortlist 11 Scuole",
    date: "2026-11-10",
    time: "17:30 - 19:00",
    type: "scuole",
    typeLabel: "Scuole & AI",
    locationType: "meet",
    meetLink: "https://meet.google.com/pod-edu-train",
    locationAddress: "Online su Google Meet",
    organizer: "Team Didattica & Orientamento Scuole",
    group: "Gruppo Scuole & Formatori",
    description: "Briefing operativo per la somministrazione dei 5 moduli formativi (introduzione AI, prompting etico, casi studio locali) negli 11 istituti selezionati del Piemonte Orientale.",
    notes: "Coinvolti docenti referenti di IIS Sobrero (Casale), Quintino Sella (Biella), Ferraris (Vercelli) e istituti Novara/VCO."
  },
  {
    id: "ev-3",
    title: "Sessione di Mentoring 1-to-1 con Studenti UPO & SUN",
    date: "2026-11-18",
    time: "18:00 - 19:30",
    type: "mentoring",
    typeLabel: "Mentoring Universitario",
    locationType: "meet",
    meetLink: "https://meet.google.com/pod-mentor-upo",
    locationAddress: "Stanze Meet dedicate per ciascuna coppia mentor-mentee",
    organizer: "Elena Passalacqua & Mentor Network",
    group: "Mentor Registrati",
    description: "Colloqui individuali di 30 minuti con laureandi del polo universitario UPO per orientamento professionale, review CV e opportunità lavorative nel territorio.",
    notes: "I mentor confermati riceveranno il link alla stanza riservata 24 ore prima dell'incontro."
  },
  {
    id: "ev-4",
    title: "Presentazione Position Paper 'Ecosistemi dell'Innovazione' alle Istituzioni Locali",
    date: "2026-11-26",
    time: "16:30 - 18:30",
    type: "plenary",
    typeLabel: "Incontro Istituzionale",
    locationType: "hybrid",
    meetLink: "https://meet.google.com/pod-ecosistemi-live",
    locationAddress: "Fondazione Cassa di Risparmio di Vercelli / Sala Conferenze + Diretta Meet",
    organizer: "Tavolo Ecosistemi & Innovazione",
    group: "Tutti i Soci & Partner Istituzionali",
    description: "Presentazione pubblica della sintesi in 4 capitoli del Position Paper agli stakeholder territoriali (Comuni, Province, Camere di Commercio, UPO, Fondazioni LINKS e CRT).",
    notes: "Documento sintetico disponibile nella dashboard iniziative per consultazione e annotazioni dei soci."
  }
];

function readEvents() {
  try {
    if (fs.existsSync(TMP_CAL_PATH)) {
      const raw = fs.readFileSync(TMP_CAL_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Errore lettura DB calendario /tmp:', e.message);
  }
  return [...DEFAULT_EVENTS];
}

function writeEvents(events) {
  try {
    fs.writeFileSync(TMP_CAL_PATH, JSON.stringify(events, null, 2), 'utf8');
  } catch (e) {
    console.warn('Errore scrittura DB calendario /tmp:', e.message);
  }
}

// Converte una data 'YYYY-MM-DD' e orario 'HH:MM - HH:MM' in formato iCal 'YYYYMMDDTHHMMSS'
function parseDateToIcal(dateStr, timeStr = '', isEnd = false) {
  const cleanDate = (dateStr || '').replace(/-/g, '');
  if (!cleanDate) {
    const now = new Date();
    return now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  let hours = isEnd ? 20 : 18;
  let minutes = 0;

  if (timeStr && timeStr.includes('-')) {
    const parts = timeStr.split('-').map(p => p.trim());
    const targetPart = isEnd ? (parts[1] || parts[0]) : parts[0];
    const match = targetPart.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
    }
  } else if (timeStr) {
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      hours = parseInt(match[1], 10) + (isEnd ? 1 : 0);
      minutes = parseInt(match[2], 10);
    }
  }

  const pad = (n) => String(n).padStart(2, '0');
  // Orario Europe/Rome (CET/CEST) - formatted as local datetime with TZID or UTC
  return `${cleanDate}T${pad(hours)}${pad(minutes)}00`;
}

function escapeIcalText(str = '') {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function generateIcs(events) {
  const nowIcal = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PODS//Piemonte Orientale Digitale e Solidale//IT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:PODS - Calendario & Riunioni Meet',
    'X-WR-CALDESC:Incontri plenari, laboratori scolastici, mentoring e riunioni operative di PODS APS ETS',
    'X-WR-TIMEZONE:Europe/Rome',
    'X-PUBLISHED-TTL:PT1H',
    'REFRESH-INTERVAL;VALUE=DURATION:PT1H'
  ];

  events.forEach(ev => {
    const uid = `${ev.id || 'ev_' + Math.random().toString(36).slice(2)}@associazione-pods.it`;
    const dtStart = parseDateToIcal(ev.date, ev.time, false);
    const dtEnd = parseDateToIcal(ev.date, ev.time, true);

    const descParts = [
      ev.description || 'Incontro della community PODS.',
      ev.meetLink ? `Link Google Meet: ${ev.meetLink}` : null,
      ev.organizer ? `Organizzatore: ${ev.organizer}` : null,
      ev.group ? `Gruppo: ${ev.group}` : null,
      ev.notes ? `Appunti / Verbale: ${ev.notes}` : null
    ].filter(Boolean).join('\n\n');

    ics.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${nowIcal}`,
      `DTSTART;TZID=Europe/Rome:${dtStart}`,
      `DTEND;TZID=Europe/Rome:${dtEnd}`,
      `SUMMARY:PODS: ${escapeIcalText(ev.title || 'Incontro PODS')}`,
      `DESCRIPTION:${escapeIcalText(descParts)}`,
      `LOCATION:${escapeIcalText(ev.meetLink || ev.locationAddress || 'Google Meet')}`,
      ev.meetLink ? `URL:${ev.meetLink}` : 'URL:https://associazione-pods.it',
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT'
    );
  });

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let events = readEvents();

  // POST: Aggiunta di un nuovo evento dalla piattaforma
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      if (!body.title || !body.date) {
        return res.status(400).json({ error: 'Titolo e data sono obbligatori.' });
      }

      const newEv = {
        id: body.id || `ev-${Date.now()}`,
        title: body.title.trim(),
        date: body.date,
        time: body.time || '18:30 - 20:00',
        type: body.type || 'plenary',
        typeLabel: body.typeLabel || 'Incontro PODS',
        typeColor: body.typeColor || 'var(--blue)',
        locationType: body.locationType || 'meet',
        meetLink: body.meetLink || `https://meet.google.com/pod-${Math.random().toString(36).substring(2, 6)}`,
        locationAddress: body.locationAddress || 'Online su Google Meet',
        organizer: body.organizer || 'Membro Community PODS',
        group: body.group || 'Tutti i Soci',
        description: body.description || "Incontro operativo dell'associazione PODS.",
        notes: body.notes || ''
      };

      events.unshift(newEv);
      writeEvents(events);
      return res.status(201).json({ success: true, event: newEv, count: events.length });
    } catch (e) {
      return res.status(500).json({ error: 'Errore salvataggio evento', details: e.message });
    }
  }

  // GET: Se richiesto formato JSON o feed .ics
  const url = req.url || '';
  const accept = req.headers['accept'] || '';
  const queryFormat = req.query ? req.query.format : '';

  if (queryFormat === 'json' || (!url.includes('.ics') && accept.includes('application/json') && queryFormat !== 'ics')) {
    return res.status(200).json({ success: true, events });
  }

  // Altrimenti restituisci il feed .ics per Google Calendar / Apple Calendar
  const icsData = generateIcs(events);
  const isDownload = url.includes('download') || url.includes('dl=1') || queryFormat === 'download';
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', `${isDownload ? 'attachment' : 'inline'}; filename="pods-calendar.ics"`);
  // Cache per max 1 ora, stale-while-revalidate per sincronizzazione rapida
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=120');
  return res.status(200).send(icsData);
};
