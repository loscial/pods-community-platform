# PODS Community Platform
### Associazione Piemonte Orientale Digitale e Solidale (APS ETS — RUNTS n. 182788)

Piattaforma web interna e collaborativa per la rete di professionisti, manager, ricercatori e docenti di **PODS**, attiva sulle 6 province del Piemonte Orientale: **Vercelli, Novara, Alessandria, Asti, Biella e Verbano-Cusio-Ossola** (con presidio a Torino).

🌐 **Piattaforma Live in Produzione**: [https://pods-community-platform-pods6.vercel.app](https://pods-community-platform-pods6.vercel.app)  
🏛️ **Sito Istituzionale di riferimento**: [associazione-pods.it](https://associazione-pods.it)  
📁 **Google Drive Condiviso Ufficiale**: [Cartella Drive Condivisa PODS](https://drive.google.com/drive/folders/1rX1dbH6xZHHJVV37m48vLo67rUwWoTbk)

---

## 🎯 Obiettivi della Piattaforma

1. **Mappare le Competenze & Capitale Umano**: sapere istantaneamente chi fa cosa nella community (AI & Data Science, Scuola, Università, Impresa, Terzo Settore, PA).
2. **Presidio Territoriale**: localizzazione geografica su mappa interattiva (Leaflet) dei soci e degli asset territoriali (scuole convenzionate, dipartimenti UPO, hub industriali come Silicon Box e Data Center Trino).
3. **Coordinamento Cantieri & Iniziative**: cruscotto delle 6 iniziative strategiche collegate direttamente ai file operativi su Google Drive.
4. **Smart Matching "Caffè Digitale"**: connessioni informali di 15-30 min su Google Meet con generazione automatica di inviti Google Calendar.
5. **Calendario Unificato Eventi**: assemblee, riunioni di tavolo e laboratori con feed live iCal (`.ics`) e download diretto.

---

## 🛠️ Stack Tecnologico

* **Frontend**: HTML5 semantico, CSS3 modulare (Official PODS brand design, font Archivo, palette istituzionale), Vanilla JavaScript ES6+ (zero framework bloat, reattività immediata).
* **Mappe**: Leaflet.js con geocoding automatico su indirizzo reale (OpenStreetMap Nominatim + fallback coordinate provinciali).
* **Backend Serverless (Vercel Functions)**:
  * `/api/members`: CRUD database soci con persistenza.
  * `/api/calendar`: Generazione dinamica feed iCalendar RFC 5545 (`.ics`) per Google Calendar, Apple Calendar e Outlook.
  * `/api/enrich`: Web scraping e arricchimento dati soci da web e LinkedIn tramite Google Gemini API.
* **Hosting**: Vercel (Edge Network).

---

## 📁 Struttura del Progetto

```
pods-community-platform/
├── api/
│   ├── calendar.js         # Endpoint iCal .ics live & download
│   ├── enrich.js           # Scraping intelligente AI con Gemini
│   └── members.js          # CRUD database soci
├── css/
│   ├── pods-official.css   # Stile istituzionale PODS (palette, badge, bottoni)
│   └── pods-theme.css      # Componenti dashboard, mappa e schede
├── js/
│   ├── app.js              # Logica applicativa, eventi DOM, matching Calendar
│   └── data.js             # Dataset iniziale (iniziative, gruppi WhatsApp, scuole)
├── img/                    # Asset grafici, sfondi Piemonte Orientale, favicon
├── index.html              # Single Page Application con 5 viste
├── vercel.json             # Routing serverless e rewrite per .ics
├── .env.example            # Template variabili d'ambiente
└── README.md               # Documentazione del progetto
```

---

## 🚀 Avvio Locale

Puoi avviare la piattaforma localmente con qualsiasi web server statico (es. con Python, Node.js o l'estensione Live Server di VS Code):

```bash
# Con Python 3
python -m http.server 8080

# Oppure con Node (npx)
npx serve .
```

Apri il browser su `http://localhost:8080`.

---

## ☁️ Deploy su Vercel

Il repository è configurato per il deploy automatico su Vercel:

```bash
# Installa la CLI di Vercel se non presente
npm i -g vercel

# Esegui il deploy
vercel --prod
```

Variabili d'ambiente da impostare nella dashboard di Vercel:
* `GEMINI_API_KEY`: Chiave API per l'autocompilazione AI dei profili.

---

## 🔮 Integrazione con Google for Nonprofits

L'associazione PODS è iscritta al RUNTS e ha diritto a **Google Workspace for Nonprofits** gratuito tramite convalida **TechSoup Italia**.  
Una volta completata l'attivazione:
* La piattaforma supporterà l'autenticazione con account istituzionale `@associazione-pods.it`.
* Il calendario si sincronizzerà direttamente con il Google Calendar ufficiale di associazione.
* Le cartelle Drive dei cantieri saranno protette da permessi granulari per gruppo di lavoro.

---

## 🤝 Contribuire

I contributi dei soci e dei gruppi operativi sono i benvenuti:
1. Crea un branch per la tua funzionalità (`git checkout -b feature/nuova-funzionalita`).
2. Fai il commit delle modifiche (`git commit -m "Aggiunta nuova funzionalità"`).
3. Apri una Pull Request sul repository.

---

## 📜 Licenza

Progetto open-source distribuito a supporto delle attività istituzionali dell'Associazione PODS (Piemonte Orientale Digitale e Solidale APS ETS).
