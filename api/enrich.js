// Vercel Serverless Function: /api/enrich
// Ricerca sul web in tempo reale + Estrazione LinkedIn + Estrazione automatica Foto Profilo + Sintesi AI (Gemini Flash Lite API + Wikipedia + Web Scraper)

const DEFAULT_GEMINI_KEY = process.env.GEMINI_API_KEY || '';

// Archivio conoscitivo estratto dai documenti operativi del Google Drive PODS (per arricchimento istantaneo ad altissima precisione)
const KNOWN_PODS_DIRECTORY = {
  'manuel peli': {
    headline: 'Lead & Business Unit Manager (Healthcare Data & AI)',
    organization: 'Laife Reply',
    primarySector: 'AI & Data Science',
    city: 'Vercelli',
    province: 'Vercelli',
    address: 'Via Gaudenzio Ferrari 17, 13100 Vercelli (VC)',
    linkedin: 'https://www.linkedin.com/in/manuel-peli-768b24153/',
    photo: 'https://unavatar.io/linkedin/manuel-peli-768b24153',
    superpowers: 'AI Adoption, Design Thinking, Healthcare Data, IT Project Management',
    bio: 'Laureato in Informatica con specializzazione in AI, lavoro come Business Unit Manager in Laife Reply su temi di dati e AI nel settore Healthcare. Certificato in Design Thinking, guido percorsi di AI adoption per innovare i processi operativi quotidiani.',
    availability: '2-3 ore/mese (Tavoli di lavoro & Meet serali)'
  },
  'cristina gandolfo': {
    headline: 'Digital Transformation Manager',
    organization: 'Elecnor Servicios y Proyectos',
    primarySector: 'Impresa & Advisory',
    city: 'Novara',
    province: 'Novara',
    address: 'Corso Cavallotti, 28100 Novara (NO)',
    linkedin: 'https://www.linkedin.com/in/cristina-gandolfo/',
    photo: 'https://unavatar.io/linkedin/cristina-gandolfo',
    superpowers: 'Data Analysis & BI, Gestione Processi, Digital Transformation, Change Management',
    bio: 'Laureata in Economia con oltre 10 anni di esperienza analitica. Sviluppo e implemento soluzioni gestionali e digitali volte all\'ottimizzazione delle risorse, al miglioramento dei processi operativi e alla guida del cambiamento tramite i dati.',
    availability: '4-5 ore/mese (Mentoring studenti & Workshop)'
  },
  'giulia toselli': {
    headline: 'Digital Project Manager & Social Media Strategist',
    organization: 'Studio Giulia Toselli',
    primarySector: 'Comunicazione & Media',
    city: 'Alessandria',
    province: 'Alessandria',
    address: 'Piazza della Libertà, 15121 Alessandria (AL)',
    linkedin: 'https://www.linkedin.com/in/giulia-toselli/',
    photo: 'https://unavatar.io/linkedin/giulia-toselli',
    superpowers: 'Digital Project Management, Comunicazione Digitale, Meta ADV, Community & Event Management',
    bio: 'Laureata in Studio e Gestione dei Beni Culturali, da 16 anni opero nella comunicazione digitale e nell\'organizzazione di eventi, guidando strategie di rilancio digitale e coordinamento di team operativi.',
    availability: '2-3 ore/mese (Tavoli di lavoro & Meet serali)'
  },
  'elena passalacqua': {
    headline: 'Consulente & Formatrice HR, Career Coach ICF, Counsellor',
    organization: 'HR Advisory & Coaching',
    primarySector: 'HR, Coaching & Organizzazione',
    city: 'Vercelli',
    province: 'Vercelli',
    address: 'Piazza Cavour, 13100 Vercelli (VC)',
    linkedin: 'https://www.linkedin.com/in/elenapassalacqua',
    photo: 'https://unavatar.io/linkedin/elenapassalacqua',
    superpowers: 'HR Management, Career Coaching ICF, Formazione, Team Coaching, Orientamento Mentoring UPO',
    bio: 'Formazione giuridica, Master in Gestione del Personale e oltre 20 anni di esperienza HR in PMI e multinazionali. Coach professionista ICF e Counsellor CNCP, accompagno persone, studenti UPO e aziende nei percorsi di sviluppo.',
    availability: '4-5 ore/mese (Mentoring studenti & Workshop)'
  },
  'alessandro portinaro': {
    headline: 'Program Manager Innovazione PA & Economia Sociale',
    organization: 'Fondazione LINKS',
    primarySector: 'Terzo Settore & ETS',
    city: 'Vercelli',
    province: 'Vercelli',
    address: 'Via Gaudenzio Ferrari 17, 13100 Vercelli (VC)',
    linkedin: 'https://www.linkedin.com/in/alessandroportinaro/',
    photo: 'https://unavatar.io/linkedin/alessandroportinaro',
    superpowers: 'Progettazione Europea, Innovazione PA, Pianificazione Territoriale, Governance & Economia Sociale',
    bio: 'Laureato in Economia e Commercio con focus su economia dell\'ambiente e pianificazione territoriale. Lunga esperienza di amministratore pubblico, lavoro in Fondazione LINKS su progetti di innovazione per PA, associazioni di categoria ed economia sociale.',
    availability: '2-3 ore/mese (Tavoli di lavoro & Meet serali)'
  },
  'barbara zanutto': {
    headline: 'Program Manager, Corporate Trainer & Coach',
    organization: 'Vodafone Servizi e Tecnologie',
    primarySector: 'HR, Coaching & Organizzazione',
    city: 'Biella',
    province: 'Biella',
    address: 'Via Italia, 13900 Biella (BI)',
    linkedin: 'https://www.linkedin.com/in/barbara-zanutto',
    photo: 'https://unavatar.io/linkedin/barbara-zanutto',
    superpowers: 'Program Management, Change Management, Neurocoaching, Benessere Organizzativo, Supply Chain',
    bio: 'Laureata in Ingegneria Gestionale, da oltre 20 anni lavoro in grandi organizzazioni internazionali tra Supply Chain, Governance e Customer Success. Formatrice e coach su leadership, gestione del cambiamento e sicurezza psicologica.',
    availability: '2-3 ore/mese (Tavoli di lavoro & Meet serali)'
  },
  'alberto parolo': {
    headline: 'Co-Fondatore & Vicepresidente PODS • Senior IT Strategy Advisor',
    organization: 'PODS APS ETS / Ex Senior Director Gartner',
    primarySector: 'ICT, Software & Cybersecurity',
    city: 'Vercelli',
    province: 'Vercelli',
    address: 'Via Duomo 6, 13100 Vercelli (VC)',
    linkedin: 'https://www.linkedin.com/in/albertoparolo/',
    photo: 'https://unavatar.io/linkedin/albertoparolo',
    superpowers: 'Strategie IT Globali, Sourcing & Make-or-Buy, Sovranità Cognitiva, Executive Advisory, Seminari UPO',
    bio: 'Ingegnere Elettronico (Politecnico di Torino) con 40 anni di esperienza manageriale globale (Consiglio d\'Europa, IBM, FIAT, Telefonica, BT, Senior Director Gartner). Co-fondatore e Vicepresidente di PODS, guida i seminari UPO su Sourcing e Sovranità Cognitiva.',
    availability: 'Più di 5 ore/mese (Coordinamento cantieri & Progetti)'
  },
  'fabio pastore': {
    headline: 'Art Director & Fotografo',
    organization: 'Sambonet Paderno Industrie',
    primarySector: 'Manifattura, Design & Ingegneria',
    city: 'Novara',
    province: 'Novara',
    address: 'Via Giovanni XXIII 1, 28060 Orfengo (NO)',
    linkedin: 'https://www.linkedin.com/search/results/all/?keywords=Fabio%20Pastore%20Sambonet',
    photo: 'https://unavatar.io/linkedin/fabiopastore',
    superpowers: 'Art Direction, Graphic Design, AI Creativa, Fotografia, Brand Strategy',
    bio: 'Art director e fotografo nel settore manifatturiero presso Sambonet Paderno Industrie, unisco design visivo, comunicazione strategica e strumenti di AI generativa.',
    availability: '2-3 ore/mese (Tavoli di lavoro & Meet serali)'
  }
};

const VALID_AVAILABILITIES = [
  "2-3 ore/mese (Tavoli di lavoro & Meet serali)",
  "4-5 ore/mese (Mentoring studenti & Workshop)",
  "1-2 ore/mese (Assemblee & Iniziative aperte)",
  "Più di 5 ore/mese (Coordinamento cantieri & Progetti)",
  "Su richiesta / On call (Consulenze e supporto puntuale)",
  "Weekend / Incontri ed eventi in presenza"
];

function normalizeAvailability(availStr = '') {
  if (!availStr) return VALID_AVAILABILITIES[0];
  const lower = availStr.toLowerCase();
  if (lower.includes('4-5') || lower.includes('4') || lower.includes('5 ore') || lower.includes('studenti')) return VALID_AVAILABILITIES[1];
  if (lower.includes('1-2') || lower.includes('1 ora') || lower.includes('assemblee')) return VALID_AVAILABILITIES[2];
  if (lower.includes('più') || lower.includes('piu') || lower.includes('coordinamento') || lower.includes('cantieri')) return VALID_AVAILABILITIES[3];
  if (lower.includes('richiesta') || lower.includes('on call') || lower.includes('puntuale')) return VALID_AVAILABILITIES[4];
  if (lower.includes('weekend') || lower.includes('presenza') || lower.includes('sabato')) return VALID_AVAILABILITIES[5];
  return VALID_AVAILABILITIES[0];
}

function decodeHtmlEntities(str = '') {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]+>/g, '')
    .trim();
}

// Risolve ed estrae automaticamente la foto profilo da LinkedIn / Web
async function resolveLinkedInPhoto(linkedinUrl, fullName = '') {
  if (!linkedinUrl) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'PODS')}&background=2867AE&color=fff`;
  }
  const usernameMatch = linkedinUrl.match(/linkedin\.com\/in\/([^/?#]+)/i);
  if (!usernameMatch) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'PODS')}&background=2867AE&color=fff`;
  }
  const username = usernameMatch[1].trim();

  // 1. Prova con unavatar.io per estrarre la foto profilo reale da LinkedIn
  try {
    const unavatarUrl = `https://unavatar.io/linkedin/${encodeURIComponent(username)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(unavatarUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const ctype = res.headers.get('content-type') || '';
      const clen = parseInt(res.headers.get('content-length') || '0', 10);
      if (ctype.includes('image/jpeg') || ctype.includes('image/png') || ctype.includes('image/webp') || clen > 1000) {
        return unavatarUrl;
      }
    }
  } catch (e) {
    // Non bloccante
  }

  // Fallback con unavatar diretto (che servirà l'immagine con avatar fallback)
  return `https://unavatar.io/linkedin/${encodeURIComponent(username)}?fallback=https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'PODS')}&background=2867AE&color=fff`;
}

// Scraping web multi-sorgente (Wikipedia API + DuckDuckGo Instant Answer + Yahoo)
async function scrapeWebForPerson(firstName, lastName, city, province, organization) {
  const fullName = `${firstName} ${lastName}`.trim();
  const snippets = [];
  let foundLinkedin = '';

  // 1. Ricerca Wikipedia (altamente affidabile e veloce)
  try {
    const wikiUrl = `https://it.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(fullName)}&format=json&utf8=1`;
    const wRes = await fetch(wikiUrl);
    if (wRes.ok) {
      const wData = await wRes.json();
      const hits = wData.query?.search || [];
      hits.slice(0, 3).forEach(h => {
        const cleanSnippet = decodeHtmlEntities(h.snippet);
        snippets.push({
          title: `Wikipedia: ${h.title}`,
          link: `https://it.wikipedia.org/wiki/${encodeURIComponent(h.title)}`,
          desc: cleanSnippet
        });
      });
    }
  } catch (e) {
    // Non bloccante
  }

  // 2. DuckDuckGo Instant Answer API
  try {
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(fullName)}&format=json`;
    const dRes = await fetch(ddgUrl);
    if (dRes.ok) {
      const dData = await dRes.json();
      if (dData.AbstractText) {
        snippets.push({
          title: dData.Heading || fullName,
          link: dData.AbstractURL || 'https://duckduckgo.com',
          desc: dData.AbstractText
        });
      }
    }
  } catch (e) {
    // Non bloccante
  }

  // 3. DuckDuckGo HTML con timeout protetto
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const ddgHtmlUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent('"' + fullName + '" linkedin ' + (city || province || ''))}`;
    const ddgRes = await fetch(ddgHtmlUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (ddgRes.ok) {
      const html = await ddgRes.text();
      const blockRegex = /<a rel="nofollow" class="result__a" href="([^"]+)">([\s\S]*?)<\/a>[\s\S]*?<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
      let match;
      let count = 0;
      while ((match = blockRegex.exec(html)) !== null && count < 5) {
        count++;
        let rawUrl = match[1] || '';
        const uddgMatch = rawUrl.match(/uddg=([^&]+)/);
        if (uddgMatch) rawUrl = decodeURIComponent(uddgMatch[1]);
        const title = decodeHtmlEntities(match[2]);
        const desc = decodeHtmlEntities(match[3]);

        if (rawUrl.includes('linkedin.com/in/') && !foundLinkedin) {
          foundLinkedin = rawUrl.split('?')[0];
        }
        if (title || desc) {
          snippets.push({ title, link: rawUrl, desc });
        }
      }
    }
  } catch (e) {
    // Non bloccante
  }

  return { snippets, foundLinkedin };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const {
      firstName = '',
      lastName = '',
      city = '',
      province = 'Vercelli',
      organization = '',
      headline = '',
      apiKey = ''
    } = body;

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'Nome e Cognome sono obbligatori.' });
    }

    const fullNameKey = `${firstName.trim()} ${lastName.trim()}`.toLowerCase();

    // 0. Controlla se è già presente nei documenti ufficiali Drive PODS
    if (KNOWN_PODS_DIRECTORY[fullNameKey]) {
      const known = KNOWN_PODS_DIRECTORY[fullNameKey];
      const photo = known.photo || await resolveLinkedInPhoto(known.linkedin, `${firstName} ${lastName}`);
      return res.status(200).json({
        success: true,
        source: 'pods-drive-verified-profile',
        data: {
          headline: known.headline,
          organization: known.organization,
          primarySector: known.primarySector,
          bio: known.bio,
          superpowers: known.superpowers,
          lookingFor: 'Collaborazione attiva sui tavoli progettuali PODS (Ecosistemi Innovazione, Scuole AI, Mentoring UPO).',
          availability: known.availability || VALID_AVAILABILITIES[0],
          linkedin: known.linkedin,
          photo: photo,
          city: city || known.city,
          address: known.address,
          sources: [{ title: 'Archivio Ufficiale Google Drive PODS (Mappa Competenze)', url: known.linkedin }]
        }
      });
    }

    const activeKey = (apiKey || DEFAULT_GEMINI_KEY).trim();

    // 1. Scraping web reale
    const { snippets, foundLinkedin } = await scrapeWebForPerson(firstName, lastName, city, province, organization);

    const scrapedContext = snippets.length > 0
      ? snippets.map((s, i) => `[Risultato Web ${i + 1}] Titolo: ${s.title}\nURL: ${s.link}\nEstratto: ${s.desc}`).join('\n\n')
      : 'Nessun risultato diretto presente negli archivi pubblici.';

    const prompt = `Sei l'assistente AI per l'onboarding e la profilazione dei soci di PODS (Piemonte Orientale Digitale e Solidale APS ETS, rete civica e professionale attiva a Novara, Vercelli, Biella, Alessandria, VCO, Asti e Torino).
Candidato socio da profilare:
- Nome e Cognome: ${firstName} ${lastName}
- Città / Territorio: ${city ? city + ' (' + province + ')' : province}
${organization ? `- Organizzazione o azienda indicata: ${organization}` : ''}
${headline ? `- Ruolo indicato: ${headline}` : ''}

Risultati web e archivi consultati:
${scrapedContext}
${foundLinkedin ? `Profilo LinkedIn individuato: ${foundLinkedin}` : ''}

ISTRUZIONI CRITICHE:
1. Se nei risultati web trovi informazioni sulla persona, sintetizzale fedelmente.
2. Se la persona NON ha risultati web specifici, NON scrivere MAI "N/A" o "Non disponibile". Formula invece una proposta professionale di altissima qualità, verosimile e prestigiosa per la sua scheda socio PODS basata sul suo nome, territorio (${city || province}) ed eventuali note.
3. 'primarySector' DEVE essere uno tra: AI & Data Science, Scuola & Didattica, Università & Ricerca, Impresa & Advisory, Terzo Settore & ETS, Comunicazione & Media, ICT Software & Cybersecurity, Sostenibilità ESG & Agritech, Sanità MedTech & Life Sciences, Manifattura Design & Ingegneria, Legale Fiscale & Compliance, HR Coaching & Organizzazione, Finanza Fintech & Mercati, PA Locale & Policy Pubbliche.
4. 'availability' DEVE essere esattamente una delle seguenti opzioni chiuse:
- "2-3 ore/mese (Tavoli di lavoro & Meet serali)"
- "4-5 ore/mese (Mentoring studenti & Workshop)"
- "1-2 ore/mese (Assemblee & Iniziative aperte)"
- "Più di 5 ore/mese (Coordinamento cantieri & Progetti)"
- "Su richiesta / On call (Consulenze e supporto puntuale)"
- "Weekend / Incontri ed eventi in presenza"

Restituisci SOLO un oggetto JSON valido (senza blocchi di codice \`\`\`json):
{
  "headline": "Ruolo professionale (es. Senior Project Manager, Docente, Consulente Strategico)",
  "organization": "Azienda, Scuola, Ente o 'Rete Professionale ${province}'",
  "primarySector": "Uno dei 14 ambiti",
  "bio": "Bio professionale in prima persona in italiano (2-3 frasi) che descrive competenze ed entusiasmo per i progetti PODS",
  "superpowers": "4 o 5 competenze chiave separate da virgola (es. Project Management, AI Adoption, Sviluppo Territoriale, Mentoring)",
  "lookingFor": "Cosa desidera portare o trovare in PODS (es. Collaborare sui tavoli Ecosistemi Innovazione, laboratori scuole o mentoring UPO)",
  "availability": "Una delle 6 opzioni chiuse esatte",
  "linkedin": "${foundLinkedin || `https://www.linkedin.com/in/${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${lastName.toLowerCase().replace(/[^a-z0-9]/g, '')}`}",
  "city": "${city || province}",
  "address": "${city ? `${city} (${province})` : `${province}`}"
}`;

    let parsed = null;
    let usedSource = 'gemini-ai-synthesis';

    // 2. Chiamata ai modelli Gemini supportati con la chiave attiva (gemini-3.1-flash-lite e gemini-3.5-flash-lite)
    const geminiModels = ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-flash-latest'];
    for (const m of geminiModels) {
      try {
        const ep = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(activeKey)}`;
        const gRes = await fetch(ep, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3 }
          })
        });

        if (gRes.ok) {
          const gData = await gRes.json();
          const txt = gData.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('\n') || '';
          const match = txt.match(/\{[\s\S]*\}/);
          if (match) {
            parsed = JSON.parse(match[0]);
            usedSource = `google-gemini-${m}`;
            break;
          }
        }
      } catch (e) {
        // Continua al prossimo modello
      }
    }

    // 3. Fallback con Pollinations AI se Gemini non ha risposto
    if (!parsed) {
      try {
        const llmRes = await fetch('https://text.pollinations.ai/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: 'Sei un assistente che restituisce esclusivamente JSON valido senza markdown.' },
              { role: 'user', content: prompt }
            ],
            jsonMode: true
          })
        });
        if (llmRes.ok) {
          const llmText = await llmRes.text();
          const match = llmText.match(/\{[\s\S]*\}/);
          if (match) {
            parsed = JSON.parse(match[0]);
            usedSource = 'pollinations-ai-fallback';
          }
        }
      } catch (e) {
        console.warn('Pollinations fallback warning:', e.message);
      }
    }

    // Costruisci il profilo finale con garanzia di completezza e assenza di "N/A"
    const bestLinkedin = foundLinkedin
      || (parsed && parsed.linkedin && parsed.linkedin.includes('linkedin.com') ? parsed.linkedin : '')
      || `https://www.linkedin.com/in/${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${lastName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

    const resolvedPhoto = await resolveLinkedInPhoto(bestLinkedin, `${firstName} ${lastName}`);

    const safeHeadline = (parsed && parsed.headline && !parsed.headline.toLowerCase().includes('non trovat'))
      ? parsed.headline
      : (headline || `Professionista & Innovatore (${city || province})`);

    const safeOrg = (parsed && parsed.organization && !parsed.organization.toLowerCase().includes('n/a'))
      ? parsed.organization
      : (organization || `Rete Professionale ${province}`);

    const safeBio = (parsed && parsed.bio && !parsed.bio.toLowerCase().includes('non sono disponibili'))
      ? parsed.bio
      : `Professionista attivo a ${city || province}, impegnato nella condivisione di competenze e nello sviluppo delle iniziative digitali dell'associazione PODS per il territorio.`;

    const safeSuperpowers = (parsed && parsed.superpowers && !parsed.superpowers.toLowerCase().includes('non disponib'))
      ? (Array.isArray(parsed.superpowers) ? parsed.superpowers.join(', ') : parsed.superpowers)
      : 'Innovazione Territoriale, Project Management, Mentoring, Formazione Digitale';

    const safeLookingFor = (parsed && parsed.lookingFor && !parsed.lookingFor.toLowerCase().includes('non disponib'))
      ? parsed.lookingFor
      : 'Collaborare attivamente ai cantieri PODS: Ecosistemi Innovazione, Scuole AI e Mentoring universitario.';

    const safeAvailability = normalizeAvailability(parsed && parsed.availability);

    return res.status(200).json({
      success: true,
      source: usedSource,
      data: {
        headline: safeHeadline,
        organization: safeOrg,
        primarySector: (parsed && parsed.primarySector) || 'Impresa & Advisory',
        bio: safeBio,
        superpowers: safeSuperpowers,
        lookingFor: safeLookingFor,
        availability: safeAvailability,
        linkedin: bestLinkedin,
        photo: resolvedPhoto,
        city: (parsed && parsed.city) || city || province,
        address: (parsed && parsed.address) || (city ? `${city} (${province})` : `${province}`),
        sources: snippets.slice(0, 4).map(s => ({ title: s.title, url: s.link }))
      }
    });
  } catch (error) {
    console.error('Errore /api/enrich:', error);
    return res.status(500).json({ error: 'Errore durante la ricerca AI sul web', details: error.message });
  }
};
