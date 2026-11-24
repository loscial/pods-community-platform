// Vercel Serverless Function: /api/members
// Gestisce il database backend dei soci iscritti a PODS (GET, POST, PUT, DELETE)

const fs = require('fs');
const path = require('path');

const TMP_DB_PATH = '/tmp/pods_members_db.json';

// I 2 profili esempio (placeholder) richiesti come base iniziale
const DEFAULT_PLACEHOLDER_MEMBERS = [
  {
    id: 'esempio-1',
    isPlaceholder: true,
    firstName: 'Alessandro',
    lastName: 'Rinaldi (Esempio)',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    province: 'Vercelli',
    city: 'Vercelli',
    address: 'Via Gaudenzio Ferrari 17, 13100 Vercelli (VC)',
    lat: 45.3265,
    lng: 8.4232,
    role: 'Socio Fondatore',
    primarySector: 'AI & Data Science',
    headline: 'AI Architect & Digital Transformation Strategist [Profilo Esempio]',
    organization: 'PODS APS ETS • Sede Vercelli',
    bio: 'Scheda di esempio (placeholder): mostra come appare il profilo di un socio una volta compilato con il supporto dell\'AI e geolocalizzato sulla mappa del territorio.',
    superpowers: ['AI Strategy', 'Co-progettazione', 'Public Speaking', 'Governance ETS'],
    lookingFor: 'Contatti con scuole superiori, atenei e imprese del Piemonte Orientale per attivare laboratori congiunti.',
    availability: '2-4 ore/mese per coordinamento tavoli operativi e mentoring.',
    projects: ['Ecosistemi & Innovazione', 'Intelligenti, non artificiali'],
    calendarLink: 'https://calendar.google.com',
    contacts: {
      email: 'esempio.vercelli@associazione-pods.it',
      linkedin: 'https://www.linkedin.com/company/pods-piemonte-orientale-digitale-e-solidale',
      phone: '+39 0161 000000',
      calendarLink: 'https://calendar.google.com',
      coffee: true
    }
  },
  {
    id: 'esempio-2',
    isPlaceholder: true,
    firstName: 'Giulia',
    lastName: 'Rastelli (Esempio)',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    province: 'Novara',
    city: 'Novara',
    address: 'Via Perrone 18, 28100 Novara (NO)',
    lat: 45.4418,
    lng: 8.6186,
    role: 'Mentor Senior',
    primarySector: 'Università & Ricerca',
    headline: 'Ricercatrice & Formatrice Didattica Digitale [Profilo Esempio]',
    organization: 'Polo Universitario UPO • Novara',
    bio: 'Seconda scheda di esempio (placeholder): clicca su "+ Nuova Scheda" in alto a destra per aggiungere il tuo vero profilo usando l\'autocompilazione AI.',
    superpowers: ['Didattica Digitale', 'Mentoring UPO', 'Sovranità Cognitiva', 'Orientamento'],
    lookingFor: 'Docenti e professionisti interessati a portare il programma "Intelligenti, non artificiali" nelle scuole.',
    availability: 'Disponibile per sessioni 1-to-1 di mentoring su Google Meet.',
    projects: ['Mentoring Universitario UPO & SUN', 'Intelligenti, non artificiali'],
    calendarLink: 'https://calendar.google.com',
    contacts: {
      email: 'esempio.novara@associazione-pods.it',
      linkedin: 'https://www.linkedin.com/company/pods-piemonte-orientale-digitale-e-solidale',
      phone: '+39 0321 000000',
      calendarLink: 'https://calendar.google.com',
      coffee: true
    }
  }
];

function readDb() {
  try {
    if (fs.existsSync(TMP_DB_PATH)) {
      const raw = fs.readFileSync(TMP_DB_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Lettura DB /tmp fallita, uso default:', e.message);
  }
  return [...DEFAULT_PLACEHOLDER_MEMBERS];
}

function writeDb(members) {
  try {
    fs.writeFileSync(TMP_DB_PATH, JSON.stringify(members, null, 2), 'utf8');
  } catch (e) {
    console.warn('Scrittura DB /tmp fallita:', e.message);
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let members = readDb();

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      count: members.length,
      members
    });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const newMember = body.member || body;

      if (!newMember.firstName || !newMember.lastName) {
        return res.status(400).json({ error: 'Nome e Cognome sono obbligatori.' });
      }

      if (!newMember.id) {
        newMember.id = 'socio_' + Date.now();
      }
      newMember.createdAt = new Date().toISOString();

      // Se esiste già un socio con lo stesso id, aggiornalo; altrimenti inseriscilo in testa
      const existingIdx = members.findIndex(m => m.id === newMember.id);
      if (existingIdx >= 0) {
        members[existingIdx] = { ...members[existingIdx], ...newMember };
      } else {
        members.unshift(newMember);
      }

      writeDb(members);

      return res.status(201).json({
        success: true,
        member: newMember,
        members
      });
    } catch (e) {
      return res.status(500).json({ error: 'Errore salvataggio socio', details: e.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const id = req.query.id || (req.body && req.body.id);
      if (id) {
        members = members.filter(m => m.id !== id);
        writeDb(members);
      }
      return res.status(200).json({ success: true, members });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
