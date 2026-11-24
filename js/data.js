// Data Store Ufficiale per la piattaforma PODS (Piemonte Orientale Digitale e Solidale APS ETS)
// Dati estratti e sincronizzati dalla cartella Google Drive Condivisa: https://drive.google.com/drive/folders/1rX1dbH6xZHHJVV37m48vLo67rUwWoTbk

const PODS_DATA = {
  // Sintesi Esecutiva "Cos'è PODS" (dai documenti ufficiali del Drive: Progetto Associativo & Testo Brochure)
  aboutSummary: {
    badge: "COS'È PODS • APS ETS (RUNTS n. 182788)",
    headline: "Una rete no-profit di competenze digitali, tecnologiche e strategiche al servizio del Piemonte Orientale.",
    text: "Nata a metà 2025, PODS riunisce circa 100 professionisti, manager, ricercatori e docenti originari o attivi nelle 6 province del quadrante orientale (Vercelli, Novara, Alessandria, Asti, Biella, VCO) che restituiscono pro bono tempo ed esperienze a scuole, università (UPO), imprese, PA ed enti del Terzo Settore.",
    driveRootUrl: "https://drive.google.com/drive/folders/1rX1dbH6xZHHJVV37m48vLo67rUwWoTbk"
  },

  // Gruppo WhatsApp Ufficiale con Link d'Invito Diretto
  whatsappGroups: [
    {
      id: "startup-ecosistemi",
      name: "Startup & Ecosistemi",
      category: "Gruppo Operativo",
      badge: "Link d'Invito Ufficiale Attivo",
      desc: "Tavolo operativo dedicato a startup, ecosistemi dell'innovazione, dossier Silicon Box a Novara, Data Center 400MW a Trino Vercellese, spin-off universitari UPO e politiche industriali del Piemonte Orientale.",
      link: "https://chat.whatsapp.com/BI2J7TljvnA3G9CYa41P5W",
      icon: "🚀",
      hasInviteLink: true,
      roleInfo: "Gestito da Amministratore PODS"
    }
  ],

  // Gruppi Tematici Ufficiali della Community WhatsApp "Associazione Culturale PODS" (Rilevati dalla Community)
  whatsappCommunityGroups: [
    { name: "Bacheca", category: "Canale Annunci", desc: "Canale ufficiale per annunci prioritari, verbali assemblee e comunicazioni istituzionali della community.", icon: "📢" },
    { name: "Generale", category: "Community", desc: "Spazio centrale di coordinamento, benvenuto ai nuovi soci e discussioni aperte della rete PODS.", icon: "💬" },
    { name: "Comunicazione & Social", category: "Gruppo Operativo", desc: "Pianificazione della comunicazione, coordinamento canali social, rassegna stampa e media relation.", icon: "👥" },
    { name: "Formazione AI Consapevole", category: "Didattica & Formazione", desc: "Coordinamento dei moduli formativi su intelligenza artificiale ed etica per scuole e professionisti.", icon: "👥" },
    { name: "Comitato Direttivo & Friends", category: "Governance", desc: "Gruppo di coordinamento strategico del Direttivo e dei soci fondatori dell'associazione.", icon: "👥" },
    { name: "Articoli utili", category: "Policy & Ricerche", desc: "Condivisione di analisi, leggi regionali (dossier novarese Marnati), bandi europei e fonti d'innovazione.", icon: "👥" },
    { name: "Presentazione AI Consapevole", category: "Formazione & Eventi", desc: "Materiali, slide e organizzazione delle serate divulgative e dei workshop sul territorio.", icon: "👥" },
    { name: "Link riunioni", category: "Coordinamento (35 membri)", desc: "Canale dedicato alla condivisione tempestiva dei link Google Meet per riunioni operative e plenarie.", icon: "👥" },
    { name: "Corso in \"Branding e ascolto pubblico\"", category: "Laboratori (17 membri)", desc: "Gruppo di lavoro con DIGSPES UPO, Comune di Alessandria e Alexala sui cantieri di civic branding.", icon: "👥" },
    { name: "Educazione Finanziaria", category: "Laboratori (10 membri)", desc: "Progettazione dei moduli di alfabetizzazione economica, finanza sostenibile e prevenzione truffe online.", icon: "👥" },
    { name: "[Task Force] AI Consapevole - contenuti", category: "Didattica (8 membri)", desc: "Sviluppo specialistico dei contenuti didattici, slide ed esercitazioni per gli 11 istituti superiori.", icon: "👥" }
  ],

  // Calendario Incontri, Riunioni Meet e Iniziative Reali
  calendarEvents: [
    {
      id: "ev-1",
      title: "Assemblea Soci & Follow-up Tavoli Operativi (Silicon Box & Data Center Trino)",
      date: "2026-11-05",
      time: "18:45 - 20:15",
      type: "plenary",
      typeLabel: "Assemblea & Ecosistemi",
      typeColor: "var(--blue)",
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
      title: "Allineamento Formatori 'Intelligenti, non artificiali' — Avvio Shortlist 11 Scuole",
      date: "2026-11-10",
      time: "18:00 - 19:30",
      type: "school",
      typeLabel: "Educazione AI Scuole",
      typeColor: "var(--yellow)",
      locationType: "meet",
      meetLink: "https://meet.google.com/pod-scuo-lab",
      locationAddress: "Online su Google Meet",
      organizer: "Alberto Parolo, Elena Passalacqua & Team Scuole",
      group: "Team Formazione Scuole",
      description: "Pianificazione operativa del Modulo 0 Docenti (4h) e dei moduli classi per ITIS Fauser NO (9 classi), ITIS Faccio VC (3 classi), Lagrangia VC (4 classi), Avogadro VC (4 classi), Saluzzo-Plana AL e Sobrero Casale.",
      notes: "Materiali pronti nella sottocartella Drive 'Materiali pronti per invio NEW_settembre 26'."
    },
    {
      id: "ev-3",
      title: "Kick-off Mentoring UPO & Associazione Studentesca SUN (Matching Mentor/Mentee)",
      date: "2026-11-17",
      time: "18:00 - 19:30",
      type: "mentoring",
      typeLabel: "Mentoring UPO & SUN",
      typeColor: "var(--purple)",
      locationType: "hybrid",
      meetLink: "https://meet.google.com/pod-ment-upo",
      locationAddress: "Campus UPO & Google Meet",
      organizer: "Sara Isoardi, Elena Passalacqua, Rosario Carnovale, Vincenzo Curinga, Federico Lucia",
      group: "Community Mentoring UPO",
      description: "Avvio del percorso di 9 mesi (1 incontro/mese one-to-one online). Presentazione del Contratto Mentor Master e verifica dei primi abbinamenti con gli studenti universitari.",
      notes: "Clausola di rematching attivo entro le prime 4-6 settimane. Richiesto 80% di presenza per l'attestato finale."
    },
    {
      id: "ev-4",
      title: "Laboratorio Corso Branding Territoriale & Ascolto Pubblico — Comune di Alessandria",
      date: "2026-11-24",
      time: "17:00 - 19:00",
      type: "tech",
      typeLabel: "Branding AL & UPO DIGSPES",
      typeColor: "var(--green)",
      locationType: "hybrid",
      meetLink: "https://meet.google.com/pod-bran-ale",
      locationAddress: "Palazzo Borsalino UPO DIGSPES (Alessandria) & Google Meet",
      organizer: "Prof. Marco Novarese (UPO) & Team PODS Branding",
      group: "Tavolo Branding & PA",
      description: "Co-progettazione dei moduli da 15 ore con Open Badge (1 CFU) e preparazione del ciclo di 6 webinar pubblici 'Un'idea di città' per l'identità strategica di Alessandria.",
      notes: "Documento operativo: 'PODS per UPO - Corso Branding e ascolto pubblico'."
    }
  ],

  provinces: [
    { id: "vercelli", name: "Vercelli", code: "VC", color: "var(--yellow)", lat: 45.3265, lng: 8.4232, description: "Sede legale PODS, Rettorato UPO, Data Center 400MW a Trino Vercellese e 5 poli scolastici partner.", membersCount: 1 },
    { id: "novara", name: "Novara", code: "NO", color: "var(--blue)", lat: 45.4469, lng: 8.6222, description: "Gigafactory Silicon Box, Scuola di Medicina e DISEI UPO, chimica-pharma e 6 istituti superiori partner.", membersCount: 1 },
    { id: "alessandria", name: "Alessandria", code: "AL", color: "var(--brown)", lat: 44.9129, lng: 8.6153, description: "Dipartimenti DIGSPES e DISIT UPO, Corso Branding con il Comune e Alexala, poli scolastici di AL, Casale e Novi.", membersCount: 0 },
    { id: "asti", name: "Asti", code: "AT", color: "var(--purple)", lat: 44.9008, lng: 8.2069, description: "Polo universitario Astiss, filiere agritech ed enomeccanica UNESCO, rete con il Terzo Settore.", membersCount: 0 },
    { id: "biella", name: "Biella", code: "BI", color: "var(--green)", lat: 45.5629, lng: 8.0583, description: "Città Studi Biella, distretto tessile sostenibile UNESCO e dialogo con l'Unione Industriale Biellese.", membersCount: 0 },
    { id: "vco", name: "Verbano-Cusio-Ossola", code: "VB", color: "var(--sky)", lat: 45.9215, lng: 8.5518, description: "Presidio delle terre alte alpine, idroelettrico, manifattura di precisione e innovazione diffusa.", membersCount: 0 },
    { id: "torino", name: "Torino", code: "TO", color: "var(--yellow)", lat: 45.0703, lng: 7.6869, description: "Capoluogo regionale, Politecnico, scuola IIS Galileo Ferraris (8 classi AI) e raccordo con l'ecosistema dell'innovazione piemontese.", membersCount: 0 }
  ],

  sectors: [
    { id: "ai-tech", label: "AI & Data Science", icon: "cpu", color: "#2867AE" },
    { id: "education", label: "Scuola & Didattica", icon: "book-open", color: "#E5C95C" },
    { id: "university", label: "Università & Ricerca", icon: "award", color: "#AE75A7" },
    { id: "business", label: "Impresa & Advisory", icon: "briefcase", color: "#A0703A" },
    { id: "third-sector", label: "Terzo Settore & ETS", icon: "heart", color: "#99C454" },
    { id: "comms", label: "Comunicazione & Media", icon: "message-circle", color: "#88ACBF" },
    { id: "ict-cyber", label: "ICT, Software & Cybersecurity", icon: "shield", color: "#2867AE" },
    { id: "esg-agritech", label: "Sostenibilità, ESG & Agritech", icon: "feather", color: "#4E8B55" },
    { id: "health-life", label: "Sanità, MedTech & Life Sciences", icon: "activity", color: "#D9534F" },
    { id: "manufacturing", label: "Manifattura, Design & Ingegneria", icon: "tool", color: "#E59866" },
    { id: "legal-compliance", label: "Legale, Fiscale & Compliance", icon: "file-text", color: "#5D6D7E" },
    { id: "hr-coaching", label: "HR, Coaching & Organizzazione", icon: "users", color: "#F39C12" },
    { id: "finance", label: "Finanza, Fintech & Mercati", icon: "dollar-sign", color: "#27AE60" },
    { id: "pa-policy", label: "PA Locale & Policy Pubbliche", icon: "landmark", color: "#8E44AD" }
  ],

  // ==========================================================================
  // LE 6 INIZIATIVE REALI DEL GOOGLE DRIVE CONDIVISO (TUTTE COME SCHEDE UNIFORMI CLICCABILI)
  // ==========================================================================
  projects: [
    {
      id: "ecosistemi-innovazione",
      title: "Ecosistemi dell'Innovazione",
      category: "Ricerca Socioeconomica, Open Innovation & Startup",
      badgeColor: "var(--blue)",
      lead: "Simona Cavallini, Elena Franco, Roberta Roberto & Comitato Tecnico PODS",
      tagline: "Mappatura degli ecosistemi territoriali, osservatorio su Silicon Box e Data Center 400MW di Trino, e percorso 'Dall'idea alla startup'.",
      description: "Iniziativa strategica che mappa i 24 nodi dell'Open Innovation nelle 6 province, analizza l'impatto socioeconomico dei grandi insediamenti tecnologici (Silicon Box a Novara e Data Center 400MW TechBau a Trino Vercellese) e accompagna i ricercatori e studenti UPO nella validazione imprenditoriale.",
      provinces: ["Vercelli", "Novara", "Alessandria", "Asti", "Biella", "Verbano-Cusio-Ossola"],
      status: "Attivo • Osservatorio & Position Paper",
      teamCount: 18,
      driveFolderId: "1epVIiXOaWeNr2CK_IX575ApVhBCUrS2f",
      driveFolderUrl: "https://drive.google.com/drive/folders/1epVIiXOaWeNr2CK_IX575ApVhBCUrS2f",
      primaryDocUrl: "https://docs.google.com/presentation/d/1YYownE8JfJgNlhQQijnNCKF3j3xUpQssoUL6eNnevL8/edit",
      secondaryDocUrl: "https://docs.google.com/document/d/1KY9cJ608Pm5tflmGTF28du2_ZLdwa7q1hiJgEPfST7Q/edit",
      isEcosystemFlagship: true,
      recentFiles: [
        {
          name: "PODS Mappatura (Ecosistemi & Modello in 5 Pilastri)",
          type: "Google Slides",
          icon: "📊",
          modifiedDate: "27 Ottobre 2026",
          statusBadge: "Più Aperto & Modificato di Recente",
          url: "https://docs.google.com/presentation/d/1YYownE8JfJgNlhQQijnNCKF3j3xUpQssoUL6eNnevL8/edit",
          digest: "Mappatura di 24 categorie di attori dell'Open Innovation (Università, Incubatori, Unioni Industriali, Fondazioni Bancarie, Distretti, Living Lab) su Biella, Vercelli, Novara, Alessandria, Asti e VCO. Definisce il modello operativo in 5 pilastri: 1) Community dei Talenti, 2) Laboratori Itineranti, 3) Piattaforma di Tutoring, 4) Pubblicazioni Open, 5) Ecosistema Digitale Condiviso."
        },
        {
          name: "PODS | [BOZZA] Proposta di percorso formativo - Dall'idea alla startup",
          type: "Google Doc",
          icon: "📄",
          modifiedDate: "13 Ottobre 2026",
          statusBadge: "Modificato di Recente",
          url: "https://docs.google.com/document/d/1KY9cJ608Pm5tflmGTF28du2_ZLdwa7q1hiJgEPfST7Q/edit",
          digest: "Percorso universitario interattivo di 8 ore in 4 moduli da 2 ore: Modulo 1 (Dall'idea al problema & Customer Discovery), Modulo 2 (Proposta di valore, Design Thinking & Jobs-To-Be-Done), Modulo 3 (Business Model Canvas & Assumption Mapping), Modulo 4 (Validazione, MVP e orientamento tra Incubatori, Business Angels e Venture Capital)."
        },
        {
          name: "Verbale Assemblea 27 Settembre — Focus Data Center Trino & Silicon Box Novara",
          type: "Google Doc",
          icon: "📝",
          modifiedDate: "14 Ottobre 2026",
          statusBadge: "Documento Strategico",
          url: "https://docs.google.com/document/d/1Ar1MKH15A9v0wb2XpIZoIU080BIPKBQl0krHqMoXjOM/edit",
          digest: "Analisi dei due mega-insediamenti tecnologici del quadrante: il Data Center da 400MW di Trino Vercellese (secondo più grande d'Europa, sviluppato da TechBau) e la gigafactory di semiconduttori Silicon Box a Novara. Avvio di paper esecutivi di 4 pagine per il confronto con le Unioni Industriali e i decisori locali."
        }
      ],
      dashboardKpis: [
        { label: "Categorie Attori Mappate", val: "24", sub: "Università, Incubatori, Fondazioni, Distretti, VC" },
        { label: "Data Center Trino (VC)", val: "400 MW", sub: "2° polo più grande d'Europa (TechBau)" },
        { label: "Polo Silicon Box (NO)", val: "3,2 Mrd €", sub: "Investimento semiconduttori & indotto UPO" },
        { label: "Percorso Startup UPO", val: "4 Moduli", sub: "8 ore laboratoriale da Idea a MVP" }
      ],
      highlights: [
        {
          title: "1. Modello Ecosistemico in 5 Pilastri (da 'PODS Mappatura')",
          text: "Attivazione simultanea di: (1) Community dei Talenti e delle Imprese; (2) Laboratori Itineranti di Problem Solving nei poli provinciali; (3) Piattaforma di Tutoring e Orientamento; (4) Pubblicazioni Open di divulgazione; (5) Ecosistema Digitale Condiviso."
        },
        {
          title: "2. Dossier Grandi Insediamenti: Data Center 400MW Trino & Silicon Box Novara",
          text: "Redazione di position paper agili (max 4 pagine) guidati da Simona Cavallini, Elena Franco e Roberta Roberto per analizzare fabbisogno energetico, ricadute occupazionali, formazione tecnica e attrattività per i giovani del territorio."
        },
        {
          title: "3. Percorso Universitario 'Dall'Idea alla Startup' (8 ore in 4 Moduli)",
          text: "Format didattico con testimonianze di founder e investitori per colmare il divario tra ricerca accademica UPO e creazione d'impresa innovativa."
        }
      ]
    },
    {
      id: "educazione-ai-scuole",
      title: "Educazione AI Consapevole — 'Intelligenti, non artificiali'",
      category: "Scuole Superiori & Sovranità Cognitiva",
      badgeColor: "var(--yellow)",
      lead: "Alberto Parolo, Elena Passalacqua, Marco Novarese & Team Scuole PODS",
      tagline: "Programma triennale di Sovranità Cognitiva, pensiero critico e uso consapevole dell'IA nelle scuole superiori.",
      description: "Modello della 'Scuola Adottata' per accompagnare docenti e studenti del triennio superiore dall'alfabetizzazione sui modelli LLM alla difesa da bias, deepfake e delega cognitiva, in piena conformità con la Legge 132/2025, le Linee Guida MIM (DM 166/2025) e l'Art. 4 dell'EU AI Act.",
      provinces: ["Novara", "Vercelli", "Alessandria", "Biella", "Asti", "Verbano-Cusio-Ossola"],
      status: "11 Scuole in Shortlist (34+ classi attive)",
      teamCount: 28,
      driveFolderId: "122znSu_HtCdm6yFvdgIQoXF-3wG1ij_X",
      driveFolderUrl: "https://drive.google.com/drive/folders/122znSu_HtCdm6yFvdgIQoXF-3wG1ij_X",
      primaryDocUrl: "https://docs.google.com/document/d/1L5q5VtYR6fFhSQq8jRNPtZiLhYwfwZrPKobaQEaH-h4/edit",
      secondaryDocUrl: "https://docs.google.com/spreadsheets/d/1QDkbsGBrewmH2AgfFrc9bOVsnCAEW1i8m2eo505N-_g/edit",
      recentFiles: [
        {
          name: "Shortlist scuole (Pianificazione Classi, Date & Referenti PODS)",
          type: "Google Sheet",
          icon: "📊",
          modifiedDate: "26 Ottobre 2026",
          statusBadge: "Più Aperto & Modificato di Recente",
          url: "https://docs.google.com/spreadsheets/d/1QDkbsGBrewmH2AgfFrc9bOVsnCAEW1i8m2eo505N-_g/edit",
          digest: "Quadro operativo delle prime 11 scuole attivate: ITIS Fauser Novara (9 classi quarte, 27h), IIS Nervi Novara (docenti + biennio), Liceo Carlo Alberto Novara, ITIS Faccio Vercelli (3 classi), IIS Lagrangia Vercelli (4 classi), Liceo Avogadro Vercelli (4 classi), Liceo Amaldi Novi Ligure, IIS Saluzzo-Plana Alessandria (3 classi), Istituto Sobrero Casale Monferrato (3 classi), IIS Galileo Ferraris Torino (8 classi) e ITIS Ferraris-Pancaldo Savona."
        },
        {
          name: "PROGRAMMA TRIENNALE del PROGETTO 'INTELLIGENTI, NON ARTIFICIALI'",
          type: "Google Doc",
          icon: "📄",
          modifiedDate: "22 Settembre 2026",
          statusBadge: "Documento Quadro",
          url: "https://docs.google.com/document/d/1L5q5VtYR6fFhSQq8jRNPtZiLhYwfwZrPKobaQEaH-h4/edit",
          digest: "Architettura didattica completa: Modulo 0 per Docenti (4h su Sovranità Cognitiva e redesign delle verifiche), Anno 1 (Prompting strategico e Tutor Socratico), Anno 2 (Cybersecurity, Phishing, Deepfake e diritto d'autore), Anno 3 (Etica, bias algoritmici e preparazione al lavoro), Hackathon delle Imprese (16h al 4° anno) e Laboratorio Esame di Stato & Colloquio di Lavoro (5° anno)."
        },
        {
          name: "Policy Abstract — INTELLIGENTI, NON ARTIFICIALI (Allineamento Normativo)",
          type: "Google Doc",
          icon: "⚖️",
          modifiedDate: "18 Settembre 2026",
          statusBadge: "Policy & Normativa",
          url: "https://docs.google.com/document/d/1S3x2Jy6AeP-PRRlxKm2kEZi31S_1sBlpFyUmYmMu8gM/edit",
          digest: "Inquadramento istituzionale per i Dirigenti Scolastici e il PTOF: allineamento con la Dichiarazione di Cannes 2026 ('Cognitive Sovereignty'), Legge Italiana IA n. 132/2025, Linee Guida MIM (DM 166/2025), EU AI Act Art. 4 (AI Literacy) e framework europeo DigCompEdu."
        },
        {
          name: "Mappa dei contenuti — Moduli didattici, Video e Quiz",
          type: "Google Sheet",
          icon: "🗂️",
          modifiedDate: "15 Ottobre 2026",
          statusBadge: "Matrice Didattica",
          url: "https://docs.google.com/spreadsheets/d/1HiU88zg0j5l4I5GI7Ep8SxofKGulXbz5nrpdkQGIlhc/edit",
          digest: "Catalogo dettagliato delle unità formative su Introduzione all'IA, Machine Learning & Reti Neurali, Etica e Bias, Prompt Engineering, Sostenibilità energetica dei modelli e Impatto sul mondo del lavoro."
        },
        {
          name: "ELENCO SCUOLE SUPERIORI (Mappatura Completa Istituti NO, VC, AL)",
          type: "Google Sheet",
          icon: "🏫",
          modifiedDate: "10 Ottobre 2026",
          statusBadge: "Database Scuole",
          url: "https://docs.google.com/spreadsheets/d/15LPhRmQ2lsL5n_zDpyfvpwH_e4xwbRHQZ-BPQ7Nhld0/edit",
          digest: "Censimento di 23 percorsi scolastici con contatti dei Dirigenti e docenti referenti (Volta AL, Nervi-Fermi AL, Saluzzo-Plana AL, Sobrero Casale, Amaldi Novi, Fauser NO, Omar NO, Mossotti NO, Bonfantini NO, Nervi NO, Carlo Alberto NO, Lagrangia VC, Faccio VC, Avogadro VC, Cavour-Lanino VC, Pastore Gattinara/Varallo)."
        }
      ],
      dashboardKpis: [
        { label: "Scuole in Shortlist Attiva", val: "11 Istituti", sub: "23 plessi totali mappati nel Drive" },
        { label: "Classi Coinvolte (Avvio)", val: "34+ Classi", sub: "Oltre 850 studenti nel primo ciclo" },
        { label: "Monte Ore 'Scuola Adottata'", val: "16h / anno", sub: "+ 4h Modulo 0 dedicato ai Docenti" },
        { label: "Conformità Normativa", val: "100% MIM", sub: "Legge 132/2025 • DM 166/2025 • AI Act" }
      ],
      highlights: [
        {
          title: "1. Il Pilastro della 'Sovranità Cognitiva' (Dichiarazione di Cannes 2026)",
          text: "Contrasto al 'debito cognitivo' e all'atrofia delle capacità di analisi: gli studenti imparano a usare l'IA non come scorciatoia passiva per i compiti, ma come sparring partner socratico verificando sempre le fonti."
        },
        {
          title: "2. Struttura Triennale + Modulo 0 Docenti + Hackathon Imprese",
          text: "Formazione preliminare di 4 ore per il corpo docente (valutazione a prova di IA), seguita da 3 livelli progressivi per gli studenti, un Hackathon di 16h con imprese del territorio al 4° anno e un simulatore di colloquio/Maturità al 5° anno."
        },
        {
          title: "3. Presidio Capillare a Novara, Vercelli e Alessandria",
          text: "Interventi già calendarizzati da Ottobre 2026 a Marzo 2027 presso ITIS Fauser, IIS Nervi, Liceo Carlo Alberto (NO), ITIS Faccio, IIS Lagrangia, Liceo Avogadro (VC), Liceo Amaldi Novi, Saluzzo-Plana e Sobrero Casale (AL)."
        }
      ]
    },
    {
      id: "mentoring-upo-sun",
      title: "Mentoring Universitario UPO & SUN",
      category: "Università, Orientamento & Carriere",
      badgeColor: "var(--purple)",
      lead: "Sara Isoardi, Elena Passalacqua, Rosario Carnovale, Vincenzo Curinga, Federico Lucia",
      tagline: "Percorso di accompagnamento 1-to-1 di 9 mesi tra professionisti senior PODS e studenti dell'Università del Piemonte Orientale.",
      description: "Programma realizzato in partnership con l'associazione studentesca SUN dell'Università del Piemonte Orientale (UPO) per colmare il divario tra università e mondo del lavoro, potenziare le soft skills e trattenere i giovani talenti nelle province del quadrante orientale.",
      provinces: ["Vercelli", "Novara", "Alessandria"],
      status: "Attivo • Regolamento & Contratti Pronti",
      teamCount: 22,
      driveFolderId: "1TugaDkITo6bMaVF-J0EQlCdYDopB3KXe",
      driveFolderUrl: "https://drive.google.com/drive/folders/1TugaDkITo6bMaVF-J0EQlCdYDopB3KXe",
      primaryDocUrl: "https://docs.google.com/document/d/1gmIp_1ASnq7AmEO1V6s02uhixICxlsuk265ogJMsDUU/edit",
      secondaryDocUrl: "https://docs.google.com/document/d/1_EvLDLmuQxKbAAFXHXRtCBIHK564x9jjkBeXq55yjgI/edit",
      recentFiles: [
        {
          name: "BOZZA Mentoring SUN (Architettura del Programma UPO)",
          type: "Google Doc",
          icon: "🎓",
          modifiedDate: "28 Luglio 2026",
          statusBadge: "Più Aperto & Modificato di Recente",
          url: "https://docs.google.com/document/d/1gmIp_1ASnq7AmEO1V6s02uhixICxlsuk265ogJMsDUU/edit",
          digest: "Definisce il programma congiunto PODS + Associazione Studentesca SUN: durata di 9 mesi con almeno 1 sessione individuale online al mese (min. 1 ora), evento di lancio, plenaria intermedia a metà percorso e chiusura con rilascio attestato (vincolato all'80% di presenza). Include garanzia di rematching entro le prime 4-6 settimane."
        },
        {
          name: "Contratto_Mentor_Master (Patto Formativo & Codice Etico)",
          type: "Google Doc",
          icon: "🤝",
          modifiedDate: "15 Giugno 2026",
          statusBadge: "Template Ufficiale",
          url: "https://docs.google.com/document/d/1_EvLDLmuQxKbAAFXHXRtCBIHK564x9jjkBeXq55yjgI/edit",
          digest: "Accordo formale tra Mentor e Mentee che disciplina riservatezza, gratuità pro bono, obiettivi di sviluppo personale, preparazione di action plan condivisi e tracciamento degli incontri sul diario di bordo."
        }
      ],
      dashboardKpis: [
        { label: "Durata Percorso", val: "9 Mesi", sub: "Da Autunno a Estate con 3 eventi plenari" },
        { label: "Frequenza Incontri 1:1", val: "1h / mese", sub: "Sessioni individuali online su Meet" },
        { label: "Soglia Certificazione", val: "80% Presenza", sub: "Attestato ufficiale finale PODS + SUN" },
        { label: "Garanzia Rematching", val: "4-6 Settimane", sub: "Riassegnazione rapida in caso di mancato fit" }
      ],
      highlights: [
        {
          title: "1. Partnership Strategica con l'Associazione Studentesca SUN (UPO)",
          text: "Co-progettazione diretta con i rappresentanti degli studenti dell'Università del Piemonte Orientale nei campus di Vercelli, Novara e Alessandria per rispondere ai reali bisogni di orientamento post-laurea."
        },
        {
          title: "2. Metodologia Strutturata & Monitoraggio Qualitativo",
          text: "Selezione e matching tramite form mirati, sottoscrizione del Patto di Mentoring, diario condiviso degli obiettivi, questionari di feedback intermedi e finali per misurare l'impatto concreto."
        },
        {
          title: "3. Team di Coordinamento Dedicato",
          text: "Cabina di regia composta da Sara Isoardi, Elena Passalacqua, Rosario Carnovale, Vincenzo Curinga e Federico Lucia per supportare ogni coppia Mentor-Mentee lungo i 9 mesi."
        }
      ]
    },
    {
      id: "corso-branding-al-upo",
      title: "Corso Branding Territoriale & Ascolto Pubblico (AL & UPO)",
      category: "Università, PA Locale & Civic Tech",
      badgeColor: "var(--green)",
      lead: "Prof. Marco Novarese (UPO DIGSPES) & Team PODS Branding",
      tagline: "Percorso formativo con Open Badge UPO e laboratorio civico di rigenerazione identitaria per il Comune di Alessandria e Alexala.",
      description: "Progetto integrato nato dalla collaborazione tra PODS, il Dipartimento DIGSPES dell'Università del Piemonte Orientale, il Comune di Alessandria e l'ATL Alexala per unire formazione accademica, Design Thinking civico e marketing territoriale basato sui dati.",
      provinces: ["Alessandria", "Asti", "Vercelli", "Novara"],
      status: "Co-progettazione UPO DIGSPES & Comune AL",
      teamCount: 14,
      driveFolderId: "1Z4JOH3S1BgH5Es3PuAHGiAHQ_kzyyUHJ",
      driveFolderUrl: "https://drive.google.com/drive/folders/1Z4JOH3S1BgH5Es3PuAHGiAHQ_kzyyUHJ",
      primaryDocUrl: "https://docs.google.com/document/d/1gCBhOdlfKLwi-SzFYmf4vUIQNdBJYUoHb_i_iDLVrFM/edit",
      secondaryDocUrl: "https://docs.google.com/document/d/1Zn5w4cshLVaLzYuT22HN8OMiEl6Mywo39vug0xgXMgM/edit",
      recentFiles: [
        {
          name: "PODS per UPO — Corso Branding e ascolto pubblico",
          type: "Google Doc",
          icon: "🏛️",
          modifiedDate: "7 Settembre 2026",
          statusBadge: "Più Aperto & Modificato di Recente",
          url: "https://docs.google.com/document/d/1gCBhOdlfKLwi-SzFYmf4vUIQNdBJYUoHb_i_iDLVrFM/edit",
          digest: "Struttura del corso universitario (60 ore totali articolabili in moduli autonomi da 15 ore con rilascio di Open Badge e 1 CFU ogni 15h): unisce lezioni metodologiche su Place Branding, analisi socio-economica e project work sul caso reale di Alessandria."
        },
        {
          name: "PODS per Branding AL (Proposta Operativa in 3 Azioni per Alessandria)",
          type: "Google Doc",
          icon: "📄",
          modifiedDate: "7 Settembre 2026",
          statusBadge: "Proposta Comune AL",
          url: "https://docs.google.com/document/d/1Zn5w4cshLVaLzYuT22HN8OMiEl6Mywo39vug0xgXMgM/edit",
          digest: "Piano d'intervento per il Comune di Alessandria articolato in 3 azioni: Azione 1 (21 ore in presenza di ascolto attivo degli stakeholder e laboratori di Design Thinking), Azione 2 (6 webinar pubblici 'Un'idea di città' con esperti nazionali), Azione 3 (Laboratorio pratico di Civic Tech e comunicazione territoriale)."
        },
        {
          name: "PODS per UPO — Presentazione Progetto (Slides)",
          type: "Google Slides",
          icon: "📊",
          modifiedDate: "7 Settembre 2026",
          statusBadge: "Presentazione Ufficiale",
          url: "https://docs.google.com/presentation/d/1-qwT2r6Z81KTgbGT4LTdBBGvFHo2CZOagTzs41Fjfe8/edit",
          digest: "Deck di presentazione per il Dipartimento DIGSPES UPO e i partner istituzionali con cronoprogramma, competenze dei docenti professionisti PODS e ricadute per gli studenti."
        },
        {
          name: "PODS — Design Thinking x Idea Generation (20260612.pdf)",
          type: "PDF Documento",
          icon: "🎨",
          modifiedDate: "15 Giugno 2026",
          statusBadge: "Metodologia",
          url: "https://drive.google.com/file/d/1A9fSEhBp-f3ZmmLIvFY6wVd4uSv04YF6/view",
          digest: "Kit metodologico per la conduzione dei tavoli partecipativi di co-design e generazione di idee ad alto impatto civico."
        }
      ],
      dashboardKpis: [
        { label: "Monte Ore Corso UPO", val: "60 Ore", sub: "Moduli da 15h con Open Badge (1 CFU)" },
        { label: "Azione 1 (Ascolto & Co-Design)", val: "21 Ore", sub: "Laboratori in presenza ad Alessandria" },
        { label: "Azione 2 ('Un'idea di città')", val: "6 Webinar", sub: "Incontri aperti alla cittadinanza" },
        { label: "Partner Istituzionali", val: "UPO + Alexala", sub: "Dipartimento DIGSPES & Comune di AL" }
      ],
      highlights: [
        {
          title: "1. Didattica Accademica + Caso Reale sul Campo (DIGSPES UPO)",
          text: "Gli studenti dei corsi di Scienze Politiche, Economiche e Sociali lavorano fianco a fianco con i professionisti PODS su dati reali, interviste agli stakeholder e strategie di posizionamento urbano."
        },
        {
          title: "2. Le 3 Azioni Civiche per Alessandria",
          text: "Combinazione di 21h di laboratori di ascolto e Design Thinking in presenza, 6 webinar divulgativi 'Un'idea di città' e un laboratorio operativo per prototipare campagne e servizi."
        }
      ]
    },
    {
      id: "seminari-upo-outsourcing",
      title: "Seminari UPO — Outsourcing, Make-or-Buy & Sovranità Cognitiva",
      category: "Università, Management IT & Strategia",
      badgeColor: "var(--brown)",
      lead: "Alberto Parolo (Vicepresidente PODS) & Docenti UPO",
      tagline: "Seminari specialistici ed esercitazioni interattive per gli studenti UPO su scelte strategiche Make-or-Buy, IT Sourcing e delega all'IA.",
      description: "Ciclo di lezioni magistrali e casi di studio interattivi (con rilevazione live tramite Wooclap) tenuti presso l'Università del Piemonte Orientale per formare i futuri manager alla gestione dei fornitori tecnologici, all'outsourcing strategico e al mantenimento del presidio conoscitivo nell'era dell'AI.",
      provinces: ["Vercelli", "Novara", "Alessandria"],
      status: "Erogato & In Espansione (Feedback Studenti Analizzati)",
      teamCount: 8,
      driveFolderId: "1KSEB2Jrr_BWNHc8CMNkpNmtmBex7Whmb",
      driveFolderUrl: "https://drive.google.com/drive/folders/1KSEB2Jrr_BWNHc8CMNkpNmtmBex7Whmb",
      primaryDocUrl: "https://drive.google.com/file/d/1Z3vCswiQt9dPXrLCF2JNG0kypz2e9lhm/view",
      secondaryDocUrl: "https://drive.google.com/file/d/1dF68VByn1HNRegTofl33zavr2ox93UM4/view",
      recentFiles: [
        {
          name: "SEMINARIO_UPO_MAKE_OR_BUY_Presentazione - v6.pptx",
          type: "PowerPoint",
          icon: "📊",
          modifiedDate: "19 Ottobre 2026",
          statusBadge: "Più Aperto & Modificato di Recente",
          url: "https://drive.google.com/file/d/1Z3vCswiQt9dPXrLCF2JNG0kypz2e9lhm/view",
          digest: "Slide deck completo v6 del seminario universitario UPO: matrici decisionali Make-or-Buy, gestione dei rischi di lock-in tecnologico, governance dei contratti IT e parallelismo tra esternalizzazione aziendale e delega cognitiva all'Intelligenza Artificiale."
        },
        {
          name: "Osservazioni di Alberto Parolo sugli esercizi e feedback.docx",
          type: "Word Doc",
          icon: "📝",
          modifiedDate: "19 Ottobre 2026",
          statusBadge: "Analisi Didattica",
          url: "https://drive.google.com/file/d/1dF68VByn1HNRegTofl33zavr2ox93UM4/view",
          digest: "Riflessioni metodologiche e valutazione qualitativa delle risposte fornite dagli studenti UPO durante le simulazioni di caso aziendale, con spunti per le edizioni successive."
        },
        {
          name: "esercizi e feedback studenti 9 ottobre Wooclap.pdf",
          type: "PDF Report",
          icon: "📈",
          modifiedDate: "12 Ottobre 2026",
          statusBadge: "Dati Live Studenti",
          url: "https://drive.google.com/file/d/1cFuavdMaSuBhTMPMkvq0hwckgLGO9lVA/view",
          digest: "Report quantitativo delle interazioni in aula raccolte con Wooclap il 9 Ottobre: risposte agli esercizi di strategia di sourcing e altissimo indice di gradimento degli studenti."
        }
      ],
      dashboardKpis: [
        { label: "Versione Slide Deck", val: "Rev. v6", sub: "Aggiornata il 19 Ottobre 2026" },
        { label: "Sessione Live Wooclap", val: "9 Ottobre", sub: "Esercizi interattivi e sondaggi in aula" },
        { label: "Focus Strategico", val: "Make or Buy", sub: "IT Sourcing, Governance & Rischi Lock-in" },
        { label: "Target Accademico", val: "Studenti UPO", sub: "Corsi di Economia, Management e Informatica" }
      ],
      highlights: [
        {
          title: "1. Dal Sourcing Industriale alla Sovranità Cognitiva",
          text: "Il seminario mostra come le stesse regole strategiche che guidano un'impresa nel decidere cosa produrre internamente ('Make') e cosa esternalizzare ('Buy') si applichino oggi all'uso dell'IA: esternalizzare il pensiero critico genera dipendenza irreversibile."
        },
        {
          title: "2. Apprendimento Attivo con Wooclap & Analisi dei Risultati",
          text: "Ogni concetto teorico è testato in tempo reale tramite scenari decisionali su Wooclap, seguiti da un debriefing ragionato curato da Alberto Parolo."
        }
      ]
    },
    {
      id: "educazione-finanziaria",
      title: "Educazione Finanziaria & Protezione Digitale",
      category: "Cittadinanza, Giovani & Tutela del Risparmio",
      badgeColor: "var(--sky)",
      lead: "Team Economia, Finanza & Cybersecurity PODS",
      tagline: "Percorso pratico di 10 ore in 5 moduli ('Io Pianifico, Io Mi Finanzio, Io Investo, Io Risparmio, Io Mi Proteggo').",
      description: "Iniziativa formativa pensata per studenti delle scuole superiori, universitari e cittadini del Piemonte Orientale per colmare il gap di alfabetizzazione economico-finanziaria e prevenire le truffe digitali e il phishing finanziario.",
      provinces: ["Vercelli", "Novara", "Alessandria", "Asti", "Biella", "Verbano-Cusio-Ossola"],
      status: "Programma in 5 Moduli Definito (Rev. 1)",
      teamCount: 12,
      driveFolderId: "16u5Nd2O-RNS8aVsLla5AOx4JKWG06TKc",
      driveFolderUrl: "https://drive.google.com/drive/folders/16u5Nd2O-RNS8aVsLla5AOx4JKWG06TKc",
      primaryDocUrl: "https://docs.google.com/document/d/1uGxZQRIs7qOtqwyn_PqtJcvQSrz8v1aX_pCi7650TnI/edit",
      secondaryDocUrl: "https://docs.google.com/document/d/1NAO5oCcDJJY8wBuJ9c4vneacPxcRG2gVuJFE33CySHo/edit",
      recentFiles: [
        {
          name: "Progettualità_Rev1 (Piano Formativo 10 ore in 5 Moduli)",
          type: "Google Doc",
          icon: "💶",
          modifiedDate: "7 Luglio 2026",
          statusBadge: "Più Aperto & Modificato di Recente",
          url: "https://docs.google.com/document/d/1uGxZQRIs7qOtqwyn_PqtJcvQSrz8v1aX_pCi7650TnI/edit",
          digest: "Struttura completa del corso da 10 ore suddiviso in 5 moduli da 2 ore ciascuno: Modulo 1 'IO PIANIFICO' (budgeting, entrate/uscite, inflazione), Modulo 2 'IO MI FINANZIO' (credito, TAN/TAEG, mutui), Modulo 3 'IO INVESTO' (rischio/rendimento, interesse composto, mercati), Modulo 4 'IO RISPARMIO' (previdenza complementare, orizzonte temporale), Modulo 5 'IO MI PROTEGGO' (assicurazioni, cybersecurity bancaria, difesa da truffe crypto e social engineering)."
        },
        {
          name: "Progettualità (Documento Base e Analisi Bisogni)",
          type: "Google Doc",
          icon: "📄",
          modifiedDate: "30 Giugno 2026",
          statusBadge: "Documento Base",
          url: "https://docs.google.com/document/d/1NAO5oCcDJJY8wBuJ9c4vneacPxcRG2gVuJFE33CySHo/edit",
          digest: "Inquadramento degli obiettivi di cittadinanza economica consapevole e integrazione con i percorsi di educazione civica nelle scuole e nelle comunità locali."
        }
      ],
      dashboardKpis: [
        { label: "Durata Complessiva", val: "10 Ore", sub: "Suddivise in 5 moduli autonomi da 2h" },
        { label: "Moduli Didattici", val: "5 Pilastri", sub: "Pianifico, Finanzio, Investo, Risparmio, Proteggo" },
        { label: "Focus Antifrode", val: "Cyber-Finanza", sub: "Difesa da phishing, finti broker e scam AI" },
        { label: "Target", val: "Scuole & Cittadini", sub: "Quarte/Quinte superiori, UPO e famiglie" }
      ],
      highlights: [
        {
          title: "1. I 5 Moduli in Prima Persona ('Io Pianifico → Io Mi Proteggo')",
          text: "Taglio estremamente concreto ed esperienziale: dalla lettura di una busta paga e gestione del budget personale fino al calcolo di TAN/TAEG, funzionamento dell'interesse composto e previdenza integrativa."
        },
        {
          title: "2. Connessione tra Educazione Finanziaria e Sicurezza Digitale",
          text: "Il Modulo 5 ('IO MI PROTEGGO') unisce la tutela assicurativa alla cybersecurity finanziaria per riconoscere schemi Ponzi, deepfake di promozione finanziaria e phishing bancario."
        }
      ]
    }
  ],

  // ==========================================================================
  // PUNTI GEOREFERENZIATI SUL TERRITORIO (SCRAPING REALE DAL DRIVE CONDIVISO)
  // ==========================================================================
  territoryPoints: [
    // 1. POLI TECNOLOGICI & INDUSTRIALI (ECOSISTEMI DELL'INNOVAZIONE)
    {
      id: "hub-silicon-box",
      name: "Silicon Box — Gigafactory Semiconduttori",
      category: "hub",
      categoryLabel: "Polo Tecnologico / Ecosistema",
      province: "Novara",
      city: "Novara",
      address: "Area Industriale Agognate, Novara (NO)",
      lat: 45.4585,
      lng: 8.5752,
      initiative: "Ecosistemi dell'Innovazione",
      details: "Insediamento strategico da 3,2 miliardi di euro per l'advanced packaging di semiconduttori. Al centro dell'osservatorio PODS (Verbale Assemblea 27/09) per le ricadute su formazione, indotto e attrazione talenti.",
      docUrl: "https://docs.google.com/document/d/1Ar1MKH15A9v0wb2XpIZoIU080BIPKBQl0krHqMoXjOM/edit"
    },
    {
      id: "hub-datacenter-trino",
      name: "Data Center 400MW TechBau — Trino Vercellese",
      category: "hub",
      categoryLabel: "Polo Tecnologico / Ecosistema",
      province: "Vercelli",
      city: "Trino",
      address: "Polo Energetico / Industriale, 13039 Trino (VC)",
      lat: 45.1953,
      lng: 8.2961,
      initiative: "Ecosistemi dell'Innovazione",
      details: "Progetto per il secondo Data Center più grande d'Europa (400 MW). Oggetto del position paper PODS di 4 pagine su transizione digitale, sostenibilità energetica e impatto sul territorio vercellese.",
      docUrl: "https://docs.google.com/document/d/1Ar1MKH15A9v0wb2XpIZoIU080BIPKBQl0krHqMoXjOM/edit"
    },
    {
      id: "hub-pods-sede",
      name: "Sede Legale PODS APS ETS",
      category: "hub",
      categoryLabel: "Sede Associativa",
      province: "Vercelli",
      city: "Vercelli",
      address: "Via Gaudenzio Ferrari 17, 13100 Vercelli (VC)",
      lat: 45.3265,
      lng: 8.4232,
      initiative: "Coordinamento Generale PODS",
      details: "Sede legale dell'Associazione Piemonte Orientale Digitale e Solidale APS ETS (RUNTS Rep. n. 182788).",
      docUrl: "https://associazione-pods.it"
    },

    // 2. POLI UNIVERSITARI UPO & INIZIATIVE ACCADEMICHE / COMUNI
    {
      id: "upo-vercelli",
      name: "UPO Vercelli — Rettorato & Dip. Studi Umanistici / DSF",
      category: "university",
      categoryLabel: "Università & Mentoring",
      province: "Vercelli",
      city: "Vercelli",
      address: "Via Duomo 6, 13100 Vercelli (VC)",
      lat: 45.3283,
      lng: 8.4230,
      initiative: "Mentoring UPO & SUN / Seminari Make-or-Buy",
      details: "Polo centrale UPO coinvolto nel programma di Mentoring con l'associazione studentesca SUN, nei seminari di Alberto Parolo e nel percorso 'Dall'idea alla startup'.",
      docUrl: "https://docs.google.com/document/d/1gmIp_1ASnq7AmEO1V6s02uhixICxlsuk265ogJMsDUU/edit"
    },
    {
      id: "upo-novara",
      name: "UPO Novara — Campus Perrone (DISEI & Scuola di Medicina)",
      category: "university",
      categoryLabel: "Università & Mentoring",
      province: "Novara",
      city: "Novara",
      address: "Via Ettore Perrone 18, 28100 Novara (NO)",
      lat: 45.4418,
      lng: 8.6186,
      initiative: "Mentoring UPO & SUN / Seminari Make-or-Buy",
      details: "Dipartimento di Studi per l'Economia e l'Impresa (DISEI) e Scuola di Medicina UPO: sede dei seminari Make-or-Buy (con esercitazioni Wooclap) e del programma di Mentoring.",
      docUrl: "https://drive.google.com/drive/folders/1KSEB2Jrr_BWNHc8CMNkpNmtmBex7Whmb"
    },
    {
      id: "upo-alessandria-branding",
      name: "UPO Alessandria (DIGSPES) & Comune di Alessandria / Alexala",
      category: "university",
      categoryLabel: "Università & Corso Branding",
      province: "Alessandria",
      city: "Alessandria",
      address: "Via Cavour 84 (Palazzo Borsalino), 15121 Alessandria (AL)",
      lat: 44.9129,
      lng: 8.6153,
      initiative: "Corso Branding & Ascolto Pubblico",
      details: "Co-progettazione con il Prof. Marco Novarese (DIGSPES UPO), Comune di Alessandria e Alexala: corso di 60h con Open Badge + 21h di laboratori di ascolto e 6 webinar 'Un'idea di città'.",
      docUrl: "https://docs.google.com/document/d/1gCBhOdlfKLwi-SzFYmf4vUIQNdBJYUoHb_i_iDLVrFM/edit"
    },
    {
      id: "citta-studi-biella",
      name: "Città Studi Biella & Polo Universitario",
      category: "university",
      categoryLabel: "Università & Ecosistema",
      province: "Biella",
      city: "Biella",
      address: "Corso Giuseppe Pella 2b, 13900 Biella (BI)",
      lat: 45.5562,
      lng: 8.0494,
      initiative: "Ecosistemi dell'Innovazione",
      details: "Snodo formativo e di ricerca mappato in 'PODS Mappatura' per il raccordo con il distretto tessile innovativo e l'Unione Industriale Biellese.",
      docUrl: "https://docs.google.com/presentation/d/1YYownE8JfJgNlhQQijnNCKF3j3xUpQssoUL6eNnevL8/edit"
    },
    {
      id: "polo-astiss-asti",
      name: "Polo Universitario Rita Levi-Montalcini (Astiss)",
      category: "university",
      categoryLabel: "Università & Ecosistema",
      province: "Asti",
      city: "Asti",
      address: "Piazzale Fabrizio De André, 14100 Asti (AT)",
      lat: 44.9012,
      lng: 8.2124,
      initiative: "Ecosistemi dell'Innovazione",
      details: "Presidio accademico e di trasferimento tecnologico mappato nell'ecosistema dell'innovazione della provincia di Asti.",
      docUrl: "https://docs.google.com/presentation/d/1YYownE8JfJgNlhQQijnNCKF3j3xUpQssoUL6eNnevL8/edit"
    },

    // 3. SCUOLE SUPERIORI PARTNER ("INTELLIGENTI, NON ARTIFICIALI" - DA SHORTLIST & ELENCO SCUOLE DRIVE)
    {
      id: "scuola-fauser-no",
      name: "ITIS 'Giacomo Fauser' — Novara",
      category: "school",
      categoryLabel: "Scuola AI (Shortlist Attiva)",
      province: "Novara",
      city: "Novara",
      address: "Via Ricci 14, 28100 Novara (NO)",
      lat: 45.4512,
      lng: 8.6095,
      initiative: "Intelligenti, non artificiali",
      details: "Shortlist attiva: 9 classi quarte coinvolte (27 ore di formazione tra Novembre e Gennaio). Referenti PODS: Alberto Parolo / Team Novara.",
      docUrl: "https://docs.google.com/spreadsheets/d/1QDkbsGBrewmH2AgfFrc9bOVsnCAEW1i8m2eo505N-_g/edit"
    },
    {
      id: "scuola-nervi-no",
      name: "IIS 'Pier Luigi Nervi' — Novara",
      category: "school",
      categoryLabel: "Scuola AI (Shortlist Attiva)",
      province: "Novara",
      city: "Novara",
      address: "Via Santo Stefano 8, 28100 Novara (NO)",
      lat: 45.4435,
      lng: 8.6090,
      initiative: "Intelligenti, non artificiali",
      details: "Shortlist attiva: formazione docenti + interventi per le classi del biennio e triennio (Ottobre-Febbraio). Referente PODS: Elena Passalacqua.",
      docUrl: "https://docs.google.com/spreadsheets/d/1QDkbsGBrewmH2AgfFrc9bOVsnCAEW1i8m2eo505N-_g/edit"
    },
    {
      id: "scuola-carlo-alberto-no",
      name: "Liceo Classico e Linguistico 'Carlo Alberto' — Novara",
      category: "school",
      categoryLabel: "Scuola AI (Shortlist Attiva)",
      province: "Novara",
      city: "Novara",
      address: "Baluardo La Marmora 9, 28100 Novara (NO)",
      lat: 45.4439,
      lng: 8.6231,
      initiative: "Intelligenti, non artificiali",
      details: "Shortlist attiva: Modulo 0 Docenti + percorso su Sovranità Cognitiva ed etica dell'IA. Referente PODS: Elena Passalacqua.",
      docUrl: "https://docs.google.com/spreadsheets/d/1QDkbsGBrewmH2AgfFrc9bOVsnCAEW1i8m2eo505N-_g/edit"
    },
    {
      id: "scuola-omar-no",
      name: "ITI 'G. Omar' — Novara",
      category: "school",
      categoryLabel: "Scuola Mappata",
      province: "Novara",
      city: "Novara",
      address: "Baluardo La Marmora 12, 28100 Novara (NO)",
      lat: 45.4442,
      lng: 8.6130,
      initiative: "Intelligenti, non artificiali",
      details: "Istituto Tecnico Industriale mappato nell'Elenco Scuole Superiori PODS per i laboratori STEM e AI.",
      docUrl: "https://docs.google.com/spreadsheets/d/15LPhRmQ2lsL5n_zDpyfvpwH_e4xwbRHQZ-BPQ7Nhld0/edit"
    },
    {
      id: "scuola-mossotti-no",
      name: "ITE 'O.F. Mossotti' — Novara",
      category: "school",
      categoryLabel: "Scuola Mappata",
      province: "Novara",
      city: "Novara",
      address: "Viale Curtatone 5, 28100 Novara (NO)",
      lat: 45.4398,
      lng: 8.6145,
      initiative: "Intelligenti, non artificiali",
      details: "Istituto Tecnico Economico mappato per i percorsi di AI consapevole ed Educazione Finanziaria.",
      docUrl: "https://docs.google.com/spreadsheets/d/15LPhRmQ2lsL5n_zDpyfvpwH_e4xwbRHQZ-BPQ7Nhld0/edit"
    },
    {
      id: "scuola-bonfantini-no",
      name: "ITA 'G. Bonfantini' — Novara",
      category: "school",
      categoryLabel: "Scuola Mappata",
      province: "Novara",
      city: "Novara (Vignale)",
      address: "Corso Risorgimento 405, 28100 Novara (NO)",
      lat: 45.4795,
      lng: 8.5910,
      initiative: "Intelligenti, non artificiali",
      details: "Polo agrario e tecnico di Novara incluso nella mappatura scuole superiori PODS.",
      docUrl: "https://docs.google.com/spreadsheets/d/15LPhRmQ2lsL5n_zDpyfvpwH_e4xwbRHQZ-BPQ7Nhld0/edit"
    },
    {
      id: "scuola-faccio-vc",
      name: "ITIS 'G.C. Faccio' — Vercelli",
      category: "school",
      categoryLabel: "Scuola AI (Shortlist Attiva)",
      province: "Vercelli",
      city: "Vercelli",
      address: "Piazza Cesare Battisti 9, 13100 Vercelli (VC)",
      lat: 45.3268,
      lng: 8.4192,
      initiative: "Intelligenti, non artificiali",
      details: "Shortlist attiva: 3 classi coinvolte (9 ore complessive tra Novembre e Gennaio). Referente PODS: Alberto Parolo.",
      docUrl: "https://docs.google.com/spreadsheets/d/1QDkbsGBrewmH2AgfFrc9bOVsnCAEW1i8m2eo505N-_g/edit"
    },
    {
      id: "scuola-lagrangia-vc",
      name: "IIS 'Luigi Lagrangia' — Vercelli",
      category: "school",
      categoryLabel: "Scuola AI (Shortlist Attiva)",
      province: "Vercelli",
      city: "Vercelli",
      address: "Corso Italia 44, 13100 Vercelli (VC)",
      lat: 45.3275,
      lng: 8.4241,
      initiative: "Intelligenti, non artificiali",
      details: "Shortlist attiva: 4 classi coinvolte (12 ore di laboratorio su pensiero critico e AI generativa). Referente PODS: Alberto Parolo.",
      docUrl: "https://docs.google.com/spreadsheets/d/1QDkbsGBrewmH2AgfFrc9bOVsnCAEW1i8m2eo505N-_g/edit"
    },
    {
      id: "scuola-avogadro-vc",
      name: "Liceo Scientifico 'Amedeo Avogadro' — Vercelli",
      category: "school",
      categoryLabel: "Scuola AI (Shortlist Attiva)",
      province: "Vercelli",
      city: "Vercelli",
      address: "Corso Palestro 29, 13100 Vercelli (VC)",
      lat: 45.3235,
      lng: 8.4180,
      initiative: "Intelligenti, non artificiali",
      details: "Shortlist attiva: 4 classi coinvolte (12 ore di moduli su LLM, matematica dei modelli ed etica). Referente PODS: Alberto Parolo.",
      docUrl: "https://docs.google.com/spreadsheets/d/1QDkbsGBrewmH2AgfFrc9bOVsnCAEW1i8m2eo505N-_g/edit"
    },
    {
      id: "scuola-cavour-vc",
      name: "IIS 'Cavour - Lanino' — Vercelli",
      category: "school",
      categoryLabel: "Scuola Mappata",
      province: "Vercelli",
      city: "Vercelli",
      address: "Corso Italia 42, 13100 Vercelli (VC)",
      lat: 45.3251,
      lng: 8.4210,
      initiative: "Intelligenti, non artificiali",
      details: "Istituto superiore vercellese mappato per i percorsi di alfabetizzazione digitale ed educazione finanziaria.",
      docUrl: "https://docs.google.com/spreadsheets/d/15LPhRmQ2lsL5n_zDpyfvpwH_e4xwbRHQZ-BPQ7Nhld0/edit"
    },
    {
      id: "scuola-pastore-gattinara",
      name: "IPSSAR 'G. Pastore' — Gattinara & Varallo (Valsesia)",
      category: "school",
      categoryLabel: "Scuola Mappata",
      province: "Vercelli",
      city: "Gattinara",
      address: "Corso Valsesia 114, 13045 Gattinara (VC)",
      lat: 45.6163,
      lng: 8.3639,
      initiative: "Intelligenti, non artificiali",
      details: "Presidio scolastico per l'area dell'alta provincia di Vercelli e della Valsesia.",
      docUrl: "https://docs.google.com/spreadsheets/d/15LPhRmQ2lsL5n_zDpyfvpwH_e4xwbRHQZ-BPQ7Nhld0/edit"
    },
    {
      id: "scuola-saluzzo-plana-al",
      name: "IIS 'Saluzzo - Plana' — Alessandria",
      category: "school",
      categoryLabel: "Scuola AI (Shortlist Attiva)",
      province: "Alessandria",
      city: "Alessandria",
      address: "Piazza Giacomo Matteotti 29, 15121 Alessandria (AL)",
      lat: 44.9135,
      lng: 8.6122,
      initiative: "Intelligenti, non artificiali",
      details: "Shortlist attiva: 3 classi coinvolte + incontro plenaria docenti (Referente PODS: Marco Novarese).",
      docUrl: "https://docs.google.com/spreadsheets/d/1QDkbsGBrewmH2AgfFrc9bOVsnCAEW1i8m2eo505N-_g/edit"
    },
    {
      id: "scuola-volta-al",
      name: "ITIS 'Alessandro Volta' — Alessandria",
      category: "school",
      categoryLabel: "Scuola Mappata",
      province: "Alessandria",
      city: "Alessandria",
      address: "Spalto Marengo 42, 15121 Alessandria (AL)",
      lat: 44.9102,
      lng: 8.6214,
      initiative: "Intelligenti, non artificiali",
      details: "Polo tecnico industriale di riferimento ad Alessandria mappato nel database scuole PODS.",
      docUrl: "https://docs.google.com/spreadsheets/d/15LPhRmQ2lsL5n_zDpyfvpwH_e4xwbRHQZ-BPQ7Nhld0/edit"
    },
    {
      id: "scuola-sobrero-casale",
      name: "IIS 'Ascanio Sobrero' — Casale Monferrato",
      category: "school",
      categoryLabel: "Scuola AI (Shortlist Attiva)",
      province: "Alessandria",
      city: "Casale Monferrato",
      address: "Via Candiani d'Olivola 19, 15033 Casale Monferrato (AL)",
      lat: 45.1342,
      lng: 8.4551,
      initiative: "Intelligenti, non artificiali",
      details: "Shortlist attiva: 3 classi coinvolte (9 ore di formazione su AI e spirito critico tra Gennaio e Marzo).",
      docUrl: "https://docs.google.com/spreadsheets/d/1QDkbsGBrewmH2AgfFrc9bOVsnCAEW1i8m2eo505N-_g/edit"
    },
    {
      id: "scuola-amaldi-novi",
      name: "Liceo 'Edoardo Amaldi' — Novi Ligure",
      category: "school",
      categoryLabel: "Scuola AI (Shortlist Attiva)",
      province: "Alessandria",
      city: "Novi Ligure",
      address: "Viale Rimembranza 53, 15067 Novi Ligure (AL)",
      lat: 44.7618,
      lng: 8.7892,
      initiative: "Intelligenti, non artificiali",
      details: "Shortlist attiva: formazione docenti e laboratori per gli studenti del liceo nel Novese.",
      docUrl: "https://docs.google.com/spreadsheets/d/1QDkbsGBrewmH2AgfFrc9bOVsnCAEW1i8m2eo505N-_g/edit"
    },
    {
      id: "scuola-ferraris-to",
      name: "IIS 'Galileo Ferraris' — Torino",
      category: "school",
      categoryLabel: "Scuola AI (Shortlist Attiva)",
      province: "Torino",
      city: "Torino",
      address: "Corso Montevecchio 67, 10129 Torino (TO)",
      lat: 45.0601,
      lng: 7.6625,
      initiative: "Intelligenti, non artificiali",
      details: "Shortlist attiva: 8 classi coinvolte nei percorsi di alfabetizzazione AI, etica e pensiero critico con PODS.",
      docUrl: "https://docs.google.com/spreadsheets/d/1QDkbsGBrewmH2AgfFrc9bOVsnCAEW1i8m2eo505N-_g/edit"
    }
  ],

  // ==========================================================================
  // SOLO 2 PROFILI ESEMPIO (SPACE HOLDERS) COME RICHIESTO DALL'UTENTE
  // ==========================================================================
  members: [
    {
      id: "esempio-1",
      isPlaceholder: true,
      firstName: "Alessandro",
      lastName: "Rinaldi (Esempio)",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      province: "Vercelli",
      city: "Vercelli",
      address: "Via Gaudenzio Ferrari 17, 13100 Vercelli (VC)",
      lat: 45.3265,
      lng: 8.4232,
      role: "Socio Fondatore",
      primarySector: "AI & Data Science",
      headline: "AI Architect & Digital Transformation Strategist [Profilo Esempio]",
      organization: "PODS APS ETS • Sede Vercelli",
      bio: "Scheda di esempio (placeholder): mostra come appare il profilo di un socio una volta compilato con il supporto dell'AI e geolocalizzato sulla mappa del territorio.",
      superpowers: ["AI Strategy", "Co-progettazione", "Public Speaking", "Governance ETS"],
      lookingFor: "Contatti con scuole superiori, atenei e imprese del Piemonte Orientale per attivare laboratori congiunti.",
      availability: "2-4 ore/mese per coordinamento tavoli operativi e mentoring.",
      projects: ["Ecosistemi dell'Innovazione", "Educazione AI Consapevole — 'Intelligenti, non artificiali'"],
      calendarLink: "https://calendar.google.com",
      contacts: {
        email: "esempio.vercelli@associazione-pods.it",
        linkedin: "https://www.linkedin.com/company/pods-piemonte-orientale-digitale-e-solidale",
        phone: "+39 0161 000000",
        calendarLink: "https://calendar.google.com",
        coffee: true
      }
    },
    {
      id: "esempio-2",
      isPlaceholder: true,
      firstName: "Giulia",
      lastName: "Rastelli (Esempio)",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      province: "Novara",
      city: "Novara",
      address: "Via Ettore Perrone 18, 28100 Novara (NO)",
      lat: 45.4418,
      lng: 8.6186,
      role: "Mentor Senior",
      primarySector: "Università & Ricerca",
      headline: "Ricercatrice & Formatrice Didattica Digitale [Profilo Esempio]",
      organization: "Polo Universitario UPO • Novara",
      bio: "Seconda scheda di esempio (placeholder): clicca su '+ Nuova Scheda' in alto a destra per aggiungere il tuo vero profilo usando l'autocompilazione AI sul web.",
      superpowers: ["Didattica Digitale", "Mentoring UPO", "Sovranità Cognitiva", "Orientamento"],
      lookingFor: "Docenti e professionisti interessati a portare il programma 'Intelligenti, non artificiali' nelle scuole.",
      availability: "Disponibile per sessioni 1-to-1 di mentoring su Google Meet.",
      projects: ["Mentoring Universitario UPO & SUN", "Educazione AI Consapevole — 'Intelligenti, non artificiali'"],
      calendarLink: "https://calendar.google.com",
      contacts: {
        email: "esempio.novara@associazione-pods.it",
        linkedin: "https://www.linkedin.com/company/pods-piemonte-orientale-digitale-e-solidale",
        phone: "+39 0321 000000",
        calendarLink: "https://calendar.google.com",
        coffee: true
      }
    }
  ]
};

window.PODS_DATA = PODS_DATA;
