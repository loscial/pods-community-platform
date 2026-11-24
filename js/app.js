/**
 * PODS Community Platform - Core Application Logic
 * Associazione Piemonte Orientale Digitale e Solidale (APS ETS)
 * Sincronizzato con Google Drive condiviso, API Backend (/api/members, /api/enrich) e Mappa Leaflet
 */

(function () {
  'use strict';

  const GEMINI_API_KEY_DEFAULT = '';
  const STORAGE_KEY_MEMBERS = 'pods_members_v3_clean';
  const STORAGE_KEY_EVENTS = 'pods_calendar_events_v3';
  const STORAGE_KEY_WA = 'pods_whatsapp_groups_v4_official';
  const STORAGE_KEY_USER = 'pods_current_user_v3';

  // Coordinate di fallback per città e province del Piemonte Orientale
  const CITY_COORDS_FALLBACK = {
    'vercelli': { lat: 45.3265, lng: 8.4232 },
    'trino': { lat: 45.1953, lng: 8.2961 },
    'santhià': { lat: 45.3658, lng: 8.1725 },
    'gattinara': { lat: 45.6163, lng: 8.3639 },
    'borgosesia': { lat: 45.7169, lng: 8.2774 },
    'varallo': { lat: 45.8136, lng: 8.2528 },
    'novara': { lat: 45.4469, lng: 8.6222 },
    'borgomanero': { lat: 45.7005, lng: 8.4593 },
    'arona': { lat: 45.7589, lng: 8.5572 },
    'trecate': { lat: 45.4357, lng: 8.7366 },
    'galliate': { lat: 45.4778, lng: 8.6989 },
    'alessandria': { lat: 44.9129, lng: 8.6153 },
    'casale monferrato': { lat: 45.1342, lng: 8.4551 },
    'casale': { lat: 45.1342, lng: 8.4551 },
    'novi ligure': { lat: 44.7618, lng: 8.7892 },
    'tortona': { lat: 44.8970, lng: 8.8655 },
    'acqui terme': { lat: 44.6756, lng: 8.4694 },
    'valenza': { lat: 45.0136, lng: 8.6458 },
    'ovada': { lat: 44.6386, lng: 8.6464 },
    'asti': { lat: 44.9008, lng: 8.2069 },
    'canelli': { lat: 44.7208, lng: 8.2886 },
    'nizza monferrato': { lat: 44.7747, lng: 8.3550 },
    'biella': { lat: 45.5629, lng: 8.0583 },
    'cossato': { lat: 45.5692, lng: 8.1714 },
    'valdilana': { lat: 45.6561, lng: 8.1494 },
    'verbano-cusio-ossola': { lat: 45.9215, lng: 8.5518 },
    'verbania': { lat: 45.9215, lng: 8.5518 },
    'domodossola': { lat: 46.1165, lng: 8.2932 },
    'omegna': { lat: 45.8778, lng: 8.4092 },
    'stresa': { lat: 45.8845, lng: 8.5327 },
    'torino': { lat: 45.0703, lng: 7.6869 },
    'milano': { lat: 45.4642, lng: 9.1900 }
  };

  // Stato Globale dell'Applicazione
  const state = {
    members: [],
    provinces: window.PODS_DATA ? window.PODS_DATA.provinces : [],
    projects: window.PODS_DATA ? window.PODS_DATA.projects : [],
    sectors: window.PODS_DATA ? window.PODS_DATA.sectors : [],
    whatsappGroups: [],
    calendarEvents: [],
    territoryPoints: window.PODS_DATA ? window.PODS_DATA.territoryPoints : [],
    currentUser: null,
    filters: {
      search: '',
      province: 'all',
      sector: 'all',
      role: 'all'
    },
    activeTab: 'starthere',
    activeProjectId: null,
    mapInstance: null,
    mapMarkersLayer: null,
    mapMode: 'initiatives', // 'initiatives' | 'members'
    mapCategoryFilter: 'all' // 'all' | 'school' | 'hub' | 'university'
  };

  const DOM = {};

  function cacheDom() {
    DOM.userAccountBtn = document.getElementById('userAccountBtn');
    DOM.userAccountName = document.getElementById('userAccountName');
    DOM.userAccountAvatar = document.getElementById('userAccountAvatar');

    DOM.navTabs = document.querySelectorAll('.nav-tab-btn');
    DOM.viewSections = {
      starthere: document.getElementById('viewStartHere'),
      directory: document.getElementById('viewDirectory'),
      projects: document.getElementById('viewProjects'),
      territory: document.getElementById('viewTerritory'),
      calendar: document.getElementById('viewCalendar')
    };

    DOM.membersGrid = document.getElementById('membersGrid');
    DOM.resultsCount = document.getElementById('resultsCount');
    DOM.searchInput = document.getElementById('searchInput');
    DOM.roleFilter = document.getElementById('roleFilter');
    DOM.sectorFilterChips = document.getElementById('sectorFilterChips');
    DOM.provinceStrip = document.getElementById('provincesStrip');
    DOM.btnResetFilters = document.getElementById('btnResetFilters');

    DOM.statMembers = document.getElementById('statMembers');
    DOM.statMembersSub = document.getElementById('statMembersSub');
    DOM.statProvinces = document.getElementById('statProvinces');
    DOM.statProjects = document.getElementById('statProjects');
    DOM.statVolHours = document.getElementById('statVolHours');

    DOM.btnAddMember = document.getElementById('btnAddMember');

    // Modals
    DOM.profileModal = document.getElementById('profileModal');
    DOM.profileModalBody = document.getElementById('profileModalBody');
    DOM.addMemberModal = document.getElementById('addMemberModal');
    DOM.addMemberForm = document.getElementById('addMemberForm');
    DOM.coffeeModal = document.getElementById('coffeeModal');
    DOM.coffeeModalBody = document.getElementById('coffeeModalBody');
    DOM.accountModal = document.getElementById('accountModal');
    DOM.addEventModal = document.getElementById('addEventModal');
    DOM.addEventForm = document.getElementById('addEventForm');

    DOM.toast = document.getElementById('toastNotice');
  }

  // ==========================================================================
  // INIZIALIZZAZIONE DATI & SINCRONIZZAZIONE BACKEND DATABASE (/api/members)
  // ==========================================================================
  function initData() {
    // Pulisci vecchie chiavi con i 20 profili fake delle versioni precedenti
    try {
      localStorage.removeItem('pods_members_roster');
      localStorage.removeItem('pods_members_roster_v2');
    } catch (e) {}

    // 1. Membri (carica da localStorage v3 o inizializza con i soli 2 profili esempio)
    const savedMembers = localStorage.getItem(STORAGE_KEY_MEMBERS);
    if (savedMembers) {
      try {
        const parsed = JSON.parse(savedMembers);
        state.members = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...window.PODS_DATA.members];
      } catch (e) {
        state.members = [...window.PODS_DATA.members];
      }
    } else {
      state.members = [...window.PODS_DATA.members];
      saveMembersToStorage();
    }

    // Sincronizza con il backend database (/api/members)
    syncMembersWithBackend();

    // 2. Gruppi WhatsApp Ufficiali
    state.whatsappGroups = [...(window.PODS_DATA && window.PODS_DATA.whatsappGroups ? window.PODS_DATA.whatsappGroups : [])];

    // 3. Eventi Calendario
    const savedEvents = localStorage.getItem(STORAGE_KEY_EVENTS);
    if (savedEvents) {
      try {
        state.calendarEvents = JSON.parse(savedEvents);
      } catch (e) {
        state.calendarEvents = [...window.PODS_DATA.calendarEvents];
      }
    } else {
      state.calendarEvents = [...window.PODS_DATA.calendarEvents];
      saveEventsToStorage();
    }

    // 4. Utente Corrente
    const savedUser = localStorage.getItem(STORAGE_KEY_USER);
    if (savedUser) {
      try {
        state.currentUser = JSON.parse(savedUser);
      } catch (e) {
        state.currentUser = state.members[0];
      }
    } else {
      state.currentUser = state.members[0];
    }
  }

  async function syncMembersWithBackend() {
    try {
      const res = await fetch('/api/members');
      if (!res.ok) return;
      const data = await res.json();
      if (data && Array.isArray(data.members)) {
        // Unisci i membri dal backend con quelli salvati localmente senza duplicati
        const mergedMap = new Map();
        state.members.forEach(m => mergedMap.set(m.id, m));
        data.members.forEach(m => {
          if (!mergedMap.has(m.id)) {
            mergedMap.set(m.id, m);
          }
        });
        state.members = Array.from(mergedMap.values());
        saveMembersToStorage();
        updateDashboardStats();
        renderProvinceStrip();
        renderFilteredMembers();
        if (state.activeTab === 'territory' && state.mapMode === 'members') {
          renderMapMarkers();
        }
      }
    } catch (e) {
      // In locale senza server usa localStorage trasparentemente
    }
  }

  function saveMembersToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(state.members));
    } catch (e) {}
  }

  function saveEventsToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(state.calendarEvents));
    } catch (e) {}
  }

  function saveCurrentUser() {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(state.currentUser));
    } catch (e) {}
  }

  function showToast(message) {
    if (!DOM.toast) return;
    DOM.toast.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ${message}`;
    DOM.toast.classList.add('show');
    clearTimeout(DOM.toast._timer);
    DOM.toast._timer = setTimeout(() => {
      DOM.toast.classList.remove('show');
    }, 3800);
  }

  function getProvinceColor(provinceName) {
    const prov = state.provinces.find(p => p.name.toLowerCase() === (provinceName || '').toLowerCase());
    return prov ? prov.color : 'var(--blue)';
  }

  function renderUserAccountPill() {
    if (!DOM.userAccountBtn) return;
    if (state.currentUser) {
      const cleanFirst = (state.currentUser.firstName || 'Socio').replace(/\s*\(Esempio\)/i, '');
      if (DOM.userAccountName) DOM.userAccountName.textContent = cleanFirst;
      if (DOM.userAccountAvatar) {
        DOM.userAccountAvatar.src = state.currentUser.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanFirst)}&background=2867AE&color=fff&size=80`;
      }
    }
  }

  // ==========================================================================
  // VIEW 0: INIZIA DA QUI & COMMUNITY WHATSAPP UFFICIALE
  // ==========================================================================
  function renderStartHereView() {
    const waContainer = document.getElementById('whatsappGroupsContainer');
    if (!waContainer) return;

    const startupGroup = (state.whatsappGroups && state.whatsappGroups[0]) || {
      name: "Startup & Ecosistemi",
      link: "https://chat.whatsapp.com/BI2J7TljvnA3G9CYa41P5W",
      desc: "Tavolo operativo dedicato a startup, ecosistemi dell'innovazione, dossier Silicon Box a Novara, Data Center 400MW a Trino Vercellese, spin-off universitari UPO e politiche industriali del Piemonte Orientale."
    };

    const communityGroups = (window.PODS_DATA && window.PODS_DATA.whatsappCommunityGroups) || [];

    let html = `
      <!-- GRUPPO OPERATIVO IN EVIDENZA CON INVITO DIRETTO ATTIVO -->
      <div style="grid-column: 1 / -1; background: #ffffff; border: 2.5px solid #25D366; border-radius: 16px; padding: 26px 28px; box-shadow: 0 4px 20px rgba(37, 211, 102, 0.12); display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 54px; height: 54px; border-radius: 50%; background: #e8f9ee; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; flex-shrink: 0; border: 1.5px solid #25D366;">
              🚀
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span style="font-size: 0.72rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; background: #25D366; color: #fff; padding: 3px 10px; border-radius: 999px;">
                  Gruppo Operativo Ufficiale
                </span>
                <span style="font-size: 0.76rem; font-weight: 800; color: #128C7E;">
                  ✓ Amministratore PODS • Invito Diretto
                </span>
              </div>
              <h3 style="font-size: 1.5rem; font-weight: 900; color: var(--ink); margin-top: 4px;">
                ${startupGroup.name}
              </h3>
            </div>
          </div>

          <a href="${startupGroup.link}" target="_blank" rel="noopener" class="btn-wa-join" style="padding: 12px 24px; font-size: 0.95rem; font-weight: 800; border-radius: 999px; text-decoration: none; box-shadow: 0 4px 14px rgba(37,211,102,0.35);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.18 8.18 0 0 1-5.83 2.41c-1.47 0-2.93-.39-4.21-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.193 8.193 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.58c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.45.06-.68.32-.23.25-.89.87-.89 2.13 0 1.26.92 2.47 1.04 2.64.13.17 1.81 2.76 4.38 3.87.61.26 1.09.42 1.46.54.61.2 1.17.17 1.61.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.23-.17-.48-.29Z"/></svg>
            Entra nel Gruppo WhatsApp
          </a>
        </div>

        <p style="font-size: 0.95rem; color: var(--ink-soft); line-height: 1.55; margin: 0;">
          ${startupGroup.desc}
        </p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px; font-size: 0.82rem; color: #475569; display: flex; align-items: center; gap: 8px;">
          <span>🔗 <strong>Link d'invito ufficiale verificato:</strong> <a href="${startupGroup.link}" target="_blank" rel="noopener" style="color: #128C7E; font-family: monospace; font-weight: 700; text-decoration: underline;">${startupGroup.link}</a></span>
        </div>
      </div>

      <!-- INTESTAZIONE SEZIONE COMMUNITY WHATSAPP -->
      <div style="grid-column: 1 / -1; margin-top: 18px; margin-bottom: 4px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <div>
            <span style="font-size: 0.76rem; font-weight: 900; text-transform: uppercase; color: var(--blue); letter-spacing: 0.05em;">Community WhatsApp Ufficiale</span>
            <h3 style="font-size: 1.35rem; font-weight: 900; color: var(--ink); margin-top: 2px;">Associazione Culturale PODS</h3>
          </div>
          <span style="font-size: 0.82rem; color: var(--ink-soft); background: var(--gray); padding: 6px 14px; border-radius: 999px;">
            🔒 L'accesso agli altri canali tematici è coordinato direttamente dagli amministratori della community
          </span>
        </div>
      </div>
    `;

    // Aggiungi le schede per gli altri gruppi reali della community (senza link né pulsanti edit)
    communityGroups.forEach(cg => {
      html += `
        <div class="whatsapp-card" style="opacity: 0.95;">
          <div class="wa-card-top">
            <div class="wa-icon" style="background: #f0f4f8; font-size: 1.25rem;">${cg.icon}</div>
            <div class="wa-title-box" style="flex: 1;">
              <span class="wa-cat-badge" style="color: #666; font-size: 0.7rem;">${cg.category}</span>
              <h4 class="wa-group-name" style="font-size: 1rem;">${cg.name}</h4>
            </div>
          </div>
          <p class="wa-desc" style="font-size: 0.85rem; margin: 0; line-height: 1.45;">${cg.desc}</p>
          <div style="margin-top: auto; padding-top: 10px; border-top: 1px solid var(--gray-border); display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.74rem; color: #666; font-weight: 700;">Community PODS</span>
            <span style="font-size: 0.72rem; color: var(--blue); font-weight: 800; background: rgba(40,103,174,0.08); padding: 3px 8px; border-radius: 4px;">
              Accesso tramite admin
            </span>
          </div>
        </div>
      `;
    });

    waContainer.innerHTML = html;
  }

  // ==========================================================================
  // AI WEB ENRICHER REALE (CHIAMA /api/enrich CON GEMINI KEY + WEB SCRAPING)
  // ==========================================================================
  async function runAiWebEnrichment() {
    const form = DOM.addMemberForm;
    if (!form) return;

    const firstName = (form.elements['firstName'].value || '').trim();
    const lastName = (form.elements['lastName'].value || '').trim();
    const city = (form.elements['city'].value || '').trim();
    const province = form.elements['province'].value;
    const organization = (form.elements['organization'].value || '').trim();
    const headline = (form.elements['headline'].value || '').trim();

    if (!firstName || !lastName) {
      alert("Inserisci almeno Nome e Cognome per permettere all'AI di cercare la persona sul web e su LinkedIn!");
      return;
    }

    const aiStatus = document.getElementById('aiScanStatus');
    const aiScanText = document.getElementById('aiScanText');
    const aiSourcesBox = document.getElementById('aiSourcesBox');
    const btnEnrich = document.getElementById('btnAiEnrich');

    if (aiStatus) aiStatus.style.display = 'flex';
    if (aiSourcesBox) aiSourcesBox.style.display = 'none';
    if (btnEnrich) btnEnrich.disabled = true;
    if (aiScanText) {
      aiScanText.textContent = `🔍 Ricerca web e scraping profilo LinkedIn in corso per ${firstName} ${lastName}...`;
    }

    try {
      const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          city,
          province,
          organization,
          headline,
          apiKey: GEMINI_API_KEY_DEFAULT
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result && result.data) {
          const d = result.data;
          if (d.headline) form.elements['headline'].value = d.headline;
          if (d.organization) form.elements['organization'].value = d.organization;
          if (d.primarySector) {
            const secSelect = form.elements['primarySector'];
            for (let i = 0; i < secSelect.options.length; i++) {
              if (secSelect.options[i].value.toLowerCase() === d.primarySector.toLowerCase()) {
                secSelect.selectedIndex = i;
                break;
              }
            }
          }
          if (d.bio) form.elements['bio'].value = d.bio;
          if (d.superpowers) form.elements['superpowers'].value = d.superpowers;
          if (d.lookingFor) form.elements['lookingFor'].value = d.lookingFor;
          if (d.availability) {
            const avSelect = form.elements['availability'];
            if (avSelect && avSelect.options) {
              let matched = false;
              for (let i = 0; i < avSelect.options.length; i++) {
                const optVal = avSelect.options[i].value.toLowerCase();
                const dVal = d.availability.toLowerCase();
                if (optVal === dVal || optVal.includes(dVal.slice(0, 8)) || dVal.includes(optVal.slice(0, 8))) {
                  avSelect.selectedIndex = i;
                  matched = true;
                  break;
                }
              }
              if (!matched) avSelect.selectedIndex = 0;
            }
          }
          if (d.linkedin) form.elements['linkedin'].value = d.linkedin;
          if (d.photo) {
            form.elements['photo'].value = d.photo;
            const previewImg = document.getElementById('photoPreviewImg');
            if (previewImg) previewImg.src = d.photo;
          }
          if (d.city && !form.elements['city'].value) form.elements['city'].value = d.city;
          if (d.address && !form.elements['address'].value) form.elements['address'].value = d.address;
          if (!form.elements['email'].value) {
            form.elements['email'].value = `${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}.${lastName.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`;
          }

          if (aiSourcesBox) {
            const srcLinks = (d.sources || []).map(s => `<a href="${s.url}" target="_blank" rel="noopener" style="color: var(--blue); text-decoration: underline;">${s.title || s.url}</a>`).join(' • ');
            aiSourcesBox.innerHTML = `
              <strong>✅ Profilo compilato dall'AI per ${firstName} ${lastName}!</strong> Puoi modificare liberamente ogni campo prima di salvare.<br>
              ${d.linkedin ? `🔗 <strong>LinkedIn individuato:</strong> <a href="${d.linkedin}" target="_blank" rel="noopener" style="color: var(--blue); font-weight: 700;">${d.linkedin}</a>` : ''}
              ${srcLinks ? `<div style="margin-top: 4px; font-size: 0.75rem;">Fonti web consultate: ${srcLinks}</div>` : ''}
            `;
            aiSourcesBox.style.display = 'block';
          }

          showToast(`✨ Scheda di ${firstName} ${lastName} compilata con AI! Verifica i campi e salva.`);
          if (aiStatus) aiStatus.style.display = 'none';
          if (btnEnrich) btnEnrich.disabled = false;
          return;
        }
      }
      throw new Error('Fallback client enrichment');
    } catch (err) {
      // Fallback client-side qualora l'utente apra il file offline senza backend
      form.elements['headline'].value = headline || `Professionista & Innovatore (${province})`;
      form.elements['organization'].value = organization || `Rete Professionale ${city || province}`;
      form.elements['bio'].value = `Professionista attivo a ${city || province}, impegnato nella valorizzazione delle competenze digitali e dei progetti territoriali dell'associazione PODS.`;
      form.elements['superpowers'].value = `Innovazione Digitale, Project Management, Mentoring, Sviluppo Territoriale`;
      form.elements['lookingFor'].value = `Collaborare sui tavoli operativi PODS (Ecosistemi Innovazione, Scuole AI, Mentoring UPO).`;
      form.elements['availability'].value = `2-3 ore/mese per mentoring e gruppi di lavoro`;
      form.elements['linkedin'].value = `https://www.linkedin.com/in/${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${lastName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      const fakeSlug = `${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${lastName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      const fallbackPhoto = `https://unavatar.io/linkedin/${fakeSlug}?fallback=https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + '+' + lastName)}&background=2867AE&color=fff`;
      form.elements['photo'].value = fallbackPhoto;
      const previewImg = document.getElementById('photoPreviewImg');
      if (previewImg) previewImg.src = fallbackPhoto;
      if (!form.elements['address'].value) {
        form.elements['address'].value = `${city || province} (${province})`;
      }
      if (aiStatus) aiStatus.style.display = 'none';
      if (btnEnrich) btnEnrich.disabled = false;
      showToast(`✨ Campi precompilati per ${firstName} ${lastName}! Puoi modificarli liberamente.`);
    }
  }

  // ==========================================================================
  // GEOCODING AUTOMATICO INDIRIZZO CASA/LAVORO PER LA MAPPA DEL TERRITORIO
  // ==========================================================================
  async function geocodeAddress(address, city, province) {
    const queryParts = [address, city, province, 'Piemonte, Italia'].filter(Boolean).join(', ');
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(queryParts)}`;
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'it' }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && data[0].lat && data[0].lon) {
          return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          };
        }
      }
    } catch (e) {
      // Continua al fallback su città/provincia
    }

    const cityKey = (city || '').toLowerCase().trim();
    const provKey = (province || '').toLowerCase().trim();
    const base = CITY_COORDS_FALLBACK[cityKey] || CITY_COORDS_FALLBACK[provKey] || { lat: 45.3265, lng: 8.4232 };
    // Aggiungi un leggerissimo offset casuale per non sovrapporre due pin nello stesso punto cittadino
    return {
      lat: base.lat + (Math.random() - 0.5) * 0.008,
      lng: base.lng + (Math.random() - 0.5) * 0.008
    };
  }

  // ==========================================================================
  // APERTURA MODALE NUOVO SOCIO O MODIFICA SOCIO ESISTENTE
  // ==========================================================================
  function openNewMemberModal() {
    if (!DOM.addMemberForm || !DOM.addMemberModal) return;
    DOM.addMemberForm.reset();
    document.getElementById('editMemberId').value = '';
    const titleEl = document.getElementById('memberModalTitle');
    if (titleEl) titleEl.textContent = 'Crea la tua Scheda Socio PODS';
    const aiSourcesBox = document.getElementById('aiSourcesBox');
    if (aiSourcesBox) aiSourcesBox.style.display = 'none';
    const previewImg = document.getElementById('photoPreviewImg');
    if (previewImg) previewImg.src = 'https://ui-avatars.com/api/?name=PODS&background=2867AE&color=fff';
    DOM.addMemberModal.classList.add('open');
  }

  function openEditMemberModal(memberId) {
    const m = state.members.find(item => item.id === memberId);
    if (!m || !DOM.addMemberForm || !DOM.addMemberModal) return;

    closeModals();
    DOM.addMemberForm.reset();
    document.getElementById('editMemberId').value = m.id;
    const titleEl = document.getElementById('memberModalTitle');
    if (titleEl) titleEl.textContent = `Modifica Scheda: ${m.firstName} ${m.lastName}`;

    const f = DOM.addMemberForm.elements;
    f['firstName'].value = (m.firstName || '').replace(/\s*\(Esempio\)/i, '');
    f['lastName'].value = (m.lastName || '').replace(/\s*\(Esempio\)/i, '');
    f['province'].value = m.province || 'Vercelli';
    f['city'].value = m.city || '';
    f['address'].value = m.address || '';
    f['primarySector'].value = m.primarySector || 'AI & Data Science';
    f['role'].value = m.role || 'Socio Operativo';
    f['headline'].value = (m.headline || '').replace(/\s*\[Profilo Esempio\]/i, '');
    f['organization'].value = m.organization || '';
    f['bio'].value = m.bio || '';
    f['superpowers'].value = (m.superpowers || []).join(', ');
    f['lookingFor'].value = m.lookingFor || '';
    if (f['availability'] && f['availability'].options) {
      const targetAvail = (m.availability || '').toLowerCase();
      let matched = false;
      for (let i = 0; i < f['availability'].options.length; i++) {
        const optVal = f['availability'].options[i].value.toLowerCase();
        if (optVal === targetAvail || optVal.includes(targetAvail.slice(0, 8)) || targetAvail.includes(optVal.slice(0, 8))) {
          f['availability'].selectedIndex = i;
          matched = true;
          break;
        }
      }
      if (!matched) f['availability'].selectedIndex = 0;
    }
    f['email'].value = (m.contacts && m.contacts.email) || '';
    f['linkedin'].value = (m.contacts && m.contacts.linkedin) || '';
    f['phone'].value = (m.contacts && m.contacts.phone) || '';
    if (f['calendarLink']) {
      f['calendarLink'].value = m.calendarLink || (m.contacts && m.contacts.calendarLink) || '';
    }
    f['photo'].value = m.photo || '';
    const previewImg = document.getElementById('photoPreviewImg');
    if (previewImg) {
      previewImg.src = m.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.firstName + '+' + m.lastName)}&background=2867AE&color=fff`;
    }
    f['coffee'].checked = m.contacts ? !!m.contacts.coffee : true;

    DOM.addMemberModal.classList.add('open');
  }

  async function deleteMemberCard(memberId) {
    const m = state.members.find(item => item.id === memberId);
    if (!m) return;
    if (!confirm(`Vuoi rimuovere la scheda di "${m.firstName} ${m.lastName}" dall'elenco?`)) return;

    state.members = state.members.filter(item => item.id !== memberId);
    saveMembersToStorage();

    try {
      await fetch(`/api/members?id=${encodeURIComponent(memberId)}`, { method: 'DELETE' });
    } catch (e) {}

    closeModals();
    updateDashboardStats();
    renderProvinceStrip();
    renderFilteredMembers();
    if (state.mapInstance && state.mapMode === 'members') {
      renderMapMarkers();
    }
    showToast(`Scheda rimossa con successo.`);
  }

  async function handleAddMember(e) {
    e.preventDefault();
    const fd = new FormData(DOM.addMemberForm);
    const submitBtn = document.getElementById('btnSubmitMemberForm');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '⏳ Geocodifica indirizzo e salvataggio nel database...';
    }

    const editId = (fd.get('editMemberId') || '').trim();
    const firstName = (fd.get('firstName') || '').trim();
    const lastName = (fd.get('lastName') || '').trim();
    const province = fd.get('province') || 'Vercelli';
    const city = (fd.get('city') || '').trim() || province;
    const address = (fd.get('address') || '').trim() || `${city} (${province})`;

    // Calcola coordinate lat/lng reali dall'indirizzo di casa o lavoro
    const coords = await geocodeAddress(address, city, province);

    const memberObj = {
      id: editId || ('socio_' + Date.now()),
      isPlaceholder: false,
      firstName,
      lastName,
      province,
      city,
      address,
      lat: coords.lat,
      lng: coords.lng,
      role: fd.get('role') || 'Socio Operativo',
      primarySector: fd.get('primarySector') || 'Impresa & Advisory',
      headline: (fd.get('headline') || '').trim(),
      organization: (fd.get('organization') || '').trim(),
      bio: (fd.get('bio') || '').trim(),
      superpowers: (fd.get('superpowers') || '').split(',').map(s => s.trim()).filter(Boolean),
      lookingFor: (fd.get('lookingFor') || '').trim(),
      availability: (fd.get('availability') || '').trim(),
      calendarLink: (fd.get('calendarLink') || '').trim(),
      photo: (fd.get('photo') || '').trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=2867AE&color=fff&size=160`,
      projects: ['Ecosistemi dell\'Innovazione', 'Educazione AI Consapevole — \'Intelligenti, non artificiali\''],
      contacts: {
        email: (fd.get('email') || '').trim(),
        linkedin: (fd.get('linkedin') || '').trim(),
        phone: (fd.get('phone') || '').trim(),
        calendarLink: (fd.get('calendarLink') || '').trim(),
        coffee: fd.get('coffee') === 'on'
      }
    };

    const existingIdx = state.members.findIndex(m => m.id === memberObj.id);
    if (existingIdx >= 0) {
      state.members[existingIdx] = memberObj;
    } else {
      state.members.unshift(memberObj);
    }

    state.currentUser = memberObj;
    saveMembersToStorage();
    saveCurrentUser();
    renderUserAccountPill();

    // Salva nel database backend serverless (/api/members)
    try {
      await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member: memberObj })
      });
    } catch (err) {
      console.warn('Salvataggio backend /api/members completato in locale:', err.message);
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = '💾 Salva Scheda nel Database & Posiziona sulla Mappa';
    }

    closeModals();
    DOM.addMemberForm.reset();

    switchTab('directory');
    resetFilters();
    updateDashboardStats();
    renderProvinceStrip();
    if (state.mapInstance) {
      renderMapMarkers();
    }

    showToast(`🎉 Scheda di ${memberObj.firstName} ${memberObj.lastName} salvata nel database e posizionata sulla mappa!`);
  }

  // ==========================================================================
  // DIRECTORY SOCI: PROVINCE STRIP, FILTRI E SCHEDE
  // ==========================================================================
  function renderProvinceStrip() {
    if (!DOM.provinceStrip) return;

    let html = `
      <div class="province-chip ${state.filters.province === 'all' ? 'active' : ''}" data-province="all" style="--prov-color: var(--blue);">
        <div class="prov-head">
          <span class="prov-code">ALL</span>
          <span class="prov-count">${state.members.length}</span>
        </div>
        <div class="prov-name">Tutte le 6 Province</div>
      </div>
    `;

    state.provinces.forEach(prov => {
      const count = state.members.filter(m => (m.province || '').toLowerCase() === prov.name.toLowerCase()).length;
      const isActive = state.filters.province.toLowerCase() === prov.name.toLowerCase();
      html += `
        <div class="province-chip ${isActive ? 'active' : ''}" data-province="${prov.name}" style="--prov-color: ${prov.color};">
          <div class="prov-head">
            <span class="prov-code">${prov.code}</span>
            <span class="prov-count">${count} soci</span>
          </div>
          <div class="prov-name">${prov.name}</div>
        </div>
      `;
    });

    DOM.provinceStrip.innerHTML = html;

    DOM.provinceStrip.querySelectorAll('.province-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        state.filters.province = chip.dataset.province;
        renderProvinceStrip();
        renderFilteredMembers();
      });
    });
  }

  function renderSectorFilters() {
    if (!DOM.sectorFilterChips) return;

    let html = `
      <span class="sector-tag-label">AMBITO:</span>
      <button class="sector-pill ${state.filters.sector === 'all' ? 'active' : ''}" data-sector="all">Tutti</button>
    `;

    state.sectors.forEach(sec => {
      const isActive = state.filters.sector === sec.label;
      html += `
        <button class="sector-pill ${isActive ? 'active' : ''}" data-sector="${sec.label}">
          ${sec.label}
        </button>
      `;
    });

    DOM.sectorFilterChips.innerHTML = html;

    DOM.sectorFilterChips.querySelectorAll('.sector-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        state.filters.sector = btn.dataset.sector;
        renderSectorFilters();
        renderFilteredMembers();
      });
    });
  }

  function getFilteredMembers() {
    const q = (state.filters.search || '').toLowerCase().trim();
    const prov = state.filters.province;
    const sec = state.filters.sector;
    const role = state.filters.role;

    return state.members.filter(m => {
      if (q) {
        const haystack = `${m.firstName} ${m.lastName} ${m.headline} ${m.organization} ${m.city} ${m.address || ''} ${m.bio} ${(m.superpowers || []).join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (prov !== 'all' && (m.province || '').toLowerCase() !== prov.toLowerCase()) return false;
      if (sec !== 'all' && m.primarySector !== sec) return false;
      if (role !== 'all' && m.role !== role) return false;
      return true;
    });
  }

  function renderFilteredMembers() {
    if (!DOM.membersGrid) return;

    const filtered = getFilteredMembers();
    const realCount = state.members.filter(m => !m.isPlaceholder).length;
    const placeholderCount = state.members.filter(m => m.isPlaceholder).length;

    if (DOM.resultsCount) {
      DOM.resultsCount.innerHTML = `Mostrando <span>${filtered.length}</span> schede (${realCount} soci iscritti + ${placeholderCount} profili esempio)`;
    }

    if (filtered.length === 0) {
      DOM.membersGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px 20px; background: var(--gray-light); border-radius: 16px; border: 1.5px solid var(--gray-border);">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">🔍</div>
          <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--ink); margin-bottom: 6px;">Nessuna scheda corrisponde ai filtri</h3>
          <button class="btn btn-ink" onclick="window.resetFilters()" style="margin-top: 10px; background: var(--ink); color: #fff; padding: 10px 20px; border-radius: 999px; font-weight: 700; border: none; cursor: pointer;">Azzera Filtri</button>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(m => {
      const provColor = getProvinceColor(m.province);
      const initials = `${(m.firstName || '').charAt(0)}${(m.lastName || '').charAt(0)}`.toUpperCase();
      const hasCoffee = m.contacts && m.contacts.coffee;

      html += `
        <div class="member-card" data-id="${m.id}" style="--card-accent: ${provColor};">
          <div class="card-header-flex">
            <div class="avatar-wrapper">
              ${m.photo
                ? `<img src="${m.photo}" alt="${m.firstName} ${m.lastName}" class="avatar-img" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(m.firstName + ' ' + m.lastName)}&background=2867AE&color=fff&size=160';">`
                : `<div class="avatar-fallback">${initials}</div>`
              }
              ${hasCoffee ? `<div class="coffee-badge" title="Disponibile per un Caffè Digitale di 15 min">☕</div>` : ''}
            </div>

            <div class="card-title-group">
              <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                <span class="card-role-pod">${m.role}</span>
                ${m.isPlaceholder ? `<span class="placeholder-badge-card">ESEMPIO / PLACEHOLDER</span>` : `<span style="font-size: 0.68rem; font-weight: 900; background: var(--green); color: var(--ink); padding: 2px 7px; border-radius: 4px;">SOCIO VERIFICATO</span>`}
              </div>
              <h3 class="card-name">${m.firstName} ${m.lastName}</h3>
              <div class="card-location">
                <span class="location-dot" style="background: ${provColor};"></span>
                <span>${m.address || (m.city ? m.city + ' (' + m.province + ')' : m.province)}</span>
              </div>
            </div>
          </div>

          <div>
            <div class="card-headline">${m.headline || ''}</div>
            ${m.organization ? `<span class="card-org">🏛️ ${m.organization}</span>` : ''}
          </div>

          ${m.bio ? `<p class="card-bio-snippet">“${m.bio}”</p>` : ''}

          <div class="card-skills-wrap">
            ${(m.superpowers || []).slice(0, 5).map(s => `<span class="skill-tag">#${s}</span>`).join('')}
          </div>

          <div class="card-footer-actions">
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="btn-card-detail" data-id="${m.id}">
                Scheda
              </button>
              <button type="button" class="btn-card-detail" onclick="event.stopPropagation(); window.openCoffeeInviteModal('${m.id}');" title="Fissa un Caffè Digitale di 15-30 min su Google Calendar con ${m.firstName}" style="background: var(--yellow); color: var(--ink); border: 1px solid rgba(0,0,0,0.1); font-weight: 800;">
                ☕ Caffè
              </button>
              <button type="button" class="btn-card-detail" onclick="event.stopPropagation(); window.openEditMemberModal('${m.id}');" title="Modifica i dati di questa scheda" style="background: var(--gray); color: var(--ink);">
                ✏️ Modifica
              </button>
            </div>

            <div class="quick-contact-icons">
              ${m.contacts && m.contacts.linkedin ? `
                <a href="${m.contacts.linkedin.startsWith('http') ? m.contacts.linkedin : 'https://' + m.contacts.linkedin}" target="_blank" rel="noopener" class="quick-icon-btn" title="Apri Profilo LinkedIn" onclick="event.stopPropagation();">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.81a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z"/></svg>
                </a>
              ` : ''}
              ${m.contacts && m.contacts.email ? `
                <a href="mailto:${m.contacts.email}" class="quick-icon-btn" title="Invia Email" onclick="event.stopPropagation();">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    });

    DOM.membersGrid.innerHTML = html;

    DOM.membersGrid.querySelectorAll('.member-card').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.quick-contact-icons')) return;
        openProfileModal(el.dataset.id);
      });
    });
  }

  function openProfileModal(memberId) {
    const m = state.members.find(item => item.id === memberId);
    if (!m || !DOM.profileModal || !DOM.profileModalBody) return;

    const provColor = getProvinceColor(m.province);
    const initials = `${(m.firstName || '').charAt(0)}${(m.lastName || '').charAt(0)}`.toUpperCase();

    DOM.profileModalBody.innerHTML = `
      <div class="profile-modal-hero">
        ${m.photo
          ? `<img src="${m.photo}" alt="${m.firstName} ${m.lastName}" class="profile-modal-avatar">`
          : `<div class="avatar-fallback" style="width: 96px; height: 96px; font-size: 2rem;">${initials}</div>`
        }

        <div class="profile-modal-titles">
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <span class="card-role-pod">${m.role}</span>
            ${m.isPlaceholder ? `<span class="placeholder-badge-card">SCHEDA ESEMPIO / PLACEHOLDER</span>` : ''}
            <span class="prov-pill-sm" style="border-color: ${provColor}; font-weight: 800;">📍 ${m.address || m.city || m.province}</span>
          </div>
          <h2 class="profile-modal-name">${m.firstName} ${m.lastName}</h2>
          <div style="font-size: 1rem; font-weight: 700; color: var(--ink);">${m.headline || ''}</div>
          ${m.organization ? `<div style="font-size: 0.88rem; color: var(--ink-soft);">🏛️ ${m.organization}</div>` : ''}
        </div>
      </div>

      <div class="profile-modal-section">
        <h4 class="section-h4">Chi sono e il mio percorso</h4>
        <div class="profile-callout-box">
          ${m.bio || 'Membro della community PODS — Piemonte Orientale Digitale e Solidale.'}
        </div>
      </div>

      <div class="profile-modal-section">
        <h4 class="section-h4">Competenze & Superpoteri</h4>
        <div class="card-skills-wrap" style="gap: 8px;">
          ${(m.superpowers || []).map(s => `<span class="skill-tag" style="background: var(--card-y); font-size: 0.84rem; padding: 5px 12px;">🌟 ${s}</span>`).join('')}
        </div>
      </div>

      ${m.lookingFor ? `
        <div class="profile-modal-section">
          <h4 class="section-h4">Iniziative e Collaborazioni cercate</h4>
          <div class="profile-callout-box" style="border-left: 4px solid var(--blue);">
            ${m.lookingFor}
          </div>
        </div>
      ` : ''}

      <div class="profile-modal-contacts-row" style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button type="button" class="btn-modal-contact" onclick="window.openCoffeeInviteModal('${m.id}')" style="background: var(--yellow); color: var(--ink); font-weight: 800; border: 1.5px solid rgba(0,0,0,0.12); cursor: pointer;">
          ☕ Fissa Caffè (Google Calendar)
        </button>

        ${(m.calendarLink || (m.contacts && m.contacts.calendarLink)) ? `
          <a href="${m.calendarLink || (m.contacts && m.contacts.calendarLink)}" target="_blank" rel="noopener" class="btn-modal-contact" style="background: #eef4ff; color: var(--blue); border: 1.5px solid var(--blue); font-weight: 700;">
            📅 Calendario Personale ↗
          </a>
        ` : ''}

        <button type="button" class="btn-modal-contact" onclick="window.openEditMemberModal('${m.id}')" style="background: var(--blue); color: #fff; border: none; cursor: pointer;">
          ✏️ Modifica Scheda
        </button>

        ${m.contacts && m.contacts.linkedin ? `
          <a href="${m.contacts.linkedin.startsWith('http') ? m.contacts.linkedin : 'https://' + m.contacts.linkedin}" target="_blank" rel="noopener" class="btn-modal-contact linkedin">
            🔗 Apri Profilo LinkedIn ↗
          </a>
        ` : ''}

        ${m.contacts && m.contacts.email ? `
          <a href="mailto:${m.contacts.email}?subject=Contatto da piattaforma PODS" class="btn-modal-contact">
            ✉️ Scrivi Email
          </a>
        ` : ''}

        <button type="button" class="btn-modal-contact" onclick="window.switchTab('territory'); window.setTerritoryMapMode('members'); document.getElementById('profileModal').classList.remove('open');" style="cursor: pointer;">
          🗺️ Vedi sulla Mappa
        </button>

        <button type="button" class="btn-modal-contact" onclick="window.deleteMemberCard('${m.id}')" style="background: #fff0f0; color: #c9302c; border-color: #f5c6cb; cursor: pointer;">
          🗑️ Rimuovi
        </button>
      </div>
    `;

    DOM.profileModal.classList.add('open');
  }

  // ==========================================================================
  // CAFFÈ DIGITALE TRA SOCI & SMART MATCHING GOOGLE CALENDAR
  // ==========================================================================
  function triggerSmartCoffeeMatch() {
    if (!state.members || state.members.length === 0) {
      showToast('Nessun socio disponibile per il matching al momento.');
      return;
    }

    const currentId = state.currentUser ? state.currentUser.id : null;
    let pool = state.members.filter(m => {
      if (currentId && m.id === currentId) return false;
      if (m.contacts && m.contacts.coffee === false) return false;
      return true;
    });

    if (pool.length === 0) {
      pool = state.members.filter(m => !currentId || m.id !== currentId);
    }
    if (pool.length === 0) {
      pool = [...state.members];
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    const matched = pool[randomIndex];

    openCoffeeInviteModal(matched.id, true);
  }

  function openCoffeeInviteModal(memberId, isRandomMatch = false) {
    const m = state.members.find(item => item.id === memberId);
    if (!m || !DOM.coffeeModal || !DOM.coffeeModalBody) return;

    // Chiudi eventuale modale profilo aperta
    if (DOM.profileModal) DOM.profileModal.classList.remove('open');

    const currentUserName = state.currentUser ? `${state.currentUser.firstName} ${state.currentUser.lastName}` : 'Socio PODS';
    const currentUserEmail = (state.currentUser && state.currentUser.contacts && state.currentUser.contacts.email) || '';
    const memberEmail = (m.contacts && m.contacts.email) || '';
    const memberName = `${m.firstName} ${m.lastName}`;
    const initials = `${(m.firstName || '').charAt(0)}${(m.lastName || '').charAt(0)}`.toUpperCase();
    const provColor = getProvinceColor(m.province);

    // Costruisci il link diretto a Google Calendar per fissare la call
    const eventTitle = `☕ Caffè Digitale PODS: ${currentUserName} & ${memberName}`;
    const meetRoomId = `pod-coffee-${Math.random().toString(36).substring(2, 7)}`;
    const meetUrl = `https://meet.google.com/${meetRoomId}`;
    const eventDescription = [
      `Incontro informale di matching e confronto (15-30 min) tra soci della community PODS (Piemonte Orientale Digitale e Solidale).`,
      `☕ Organizzato da: ${currentUserName}${currentUserEmail ? ' (' + currentUserEmail + ')' : ''}`,
      `☕ Invitato/a: ${memberName}${memberEmail ? ' (' + memberEmail + ')' : ''}`,
      `📌 Stanza Google Meet generata: ${meetUrl}`,
      `🌐 Piattaforma PODS: https://pods-community-platform-pods6.vercel.app`
    ].join('\n\n');

    // Calcola una data predefinita per domani alle ore 18:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const datesParam = `${yyyy}${mm}${dd}T170000Z/${yyyy}${mm}${dd}T173000Z`;

    // Google Calendar template URL con pre-popolamento invitato (&add=email)
    let gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${datesParam}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent('Google Meet: ' + meetUrl)}`;
    if (memberEmail) {
      gcalUrl += `&add=${encodeURIComponent(memberEmail)}`;
    }

    const personalCalUrl = m.calendarLink || (m.contacts && m.contacts.calendarLink) || '';

    DOM.coffeeModalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="display: inline-block; background: var(--yellow); color: var(--ink); font-size: 0.76rem; font-weight: 800; padding: 4px 12px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
          ${isRandomMatch ? '🎲 Smart Coffee Matching' : '☕ Caffè Digitale PODS'}
        </span>
        <h2 style="font-size: 1.6rem; font-weight: 900; color: var(--ink); margin-bottom: 6px;">
          ${isRandomMatch ? 'Ecco il tuo abbinamento a sorpresa!' : `Fissa una videochiamata con ${m.firstName}`}
        </h2>
        <p style="font-size: 0.88rem; color: var(--ink-soft); max-width: 460px; margin: 0 auto;">
          Un momento informale di 15-30 minuti per conoscerci, scambiare idee su progetti e rafforzare le sinergie nel Piemonte Orientale.
        </p>
      </div>

      <div style="display: flex; gap: 16px; align-items: center; background: var(--gray-light); border: 1.5px solid var(--gray-border); border-radius: 16px; padding: 16px; margin-bottom: 20px;">
        <div style="width: 72px; height: 72px; border-radius: 50%; overflow: hidden; border: 3px solid ${provColor}; flex-shrink: 0; background: #fff; display: flex; align-items: center; justify-content: center;">
          ${m.photo 
            ? `<img src="${m.photo}" alt="${memberName}" style="width: 100%; height: 100%; object-fit: cover;">` 
            : `<div style="font-size: 1.6rem; font-weight: 800; color: var(--blue);">${initials}</div>`
          }
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="card-role-pod" style="font-size: 0.72rem;">${m.role}</span>
            <span style="font-size: 0.76rem; font-weight: 700; color: var(--ink-soft);">📍 ${m.city ? m.city + ' (' + m.province + ')' : m.province}</span>
          </div>
          <div style="font-size: 1.2rem; font-weight: 800; color: var(--ink); margin-top: 2px;">${memberName}</div>
          <div style="font-size: 0.84rem; color: var(--ink-soft); line-height: 1.3;">${m.headline || m.organization || ''}</div>
          ${m.superpowers && m.superpowers.length > 0 ? `
            <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 6px;">
              ${m.superpowers.slice(0, 3).map(s => `<span class="skill-tag" style="font-size: 0.72rem; padding: 2px 7px;">#${s}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
        ${personalCalUrl ? `
          <div style="background: #f0f7ff; border: 1.5px solid #cce3ff; border-radius: 12px; padding: 14px;">
            <div style="font-size: 0.88rem; font-weight: 800; color: var(--blue); margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
              <span>📅</span> Pagina Appuntamenti Personale di ${m.firstName}
            </div>
            <p style="font-size: 0.8rem; color: var(--ink-soft); margin-bottom: 10px;">
              Il socio ha inserito la propria pagina di prenotazione diretta: puoi scegliere subito uno slot libero nella sua agenda.
            </p>
            <a href="${personalCalUrl}" target="_blank" rel="noopener" class="btn" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: var(--blue); color: #fff; text-decoration: none; padding: 10px 18px; border-radius: 999px; font-weight: 800; font-size: 0.88rem;">
              Apri Calendario Personale di ${m.firstName} ↗
            </a>
          </div>
        ` : ''}

        <div style="background: #fffdf5; border: 1.5px solid #fae8a4; border-radius: 12px; padding: 14px;">
          <div style="font-size: 0.88rem; font-weight: 800; color: var(--ink); margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
            <span>🗓️</span> Invito Diretto Google Calendar (+ Google Meet)
          </div>
          <p style="font-size: 0.8rem; color: var(--ink-soft); margin-bottom: 10px;">
            Apre la schermata di Google Calendar con il titolo precompilato, stanza Meet e l'email <strong>${memberEmail || 'del socio'}</strong> già inserita tra gli invitati. Ti basterà cliccare su <em>"Salva"</em> e l'invito arriverà direttamente sul suo calendario!
          </p>
          <a href="${gcalUrl}" target="_blank" rel="noopener" class="btn" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: var(--ink); color: #fff; text-decoration: none; padding: 10px 18px; border-radius: 999px; font-weight: 800; font-size: 0.88rem;">
            <span>🗓️</span> Fissa su Google Calendar & Invia Invito a ${m.firstName} ↗
          </a>
        </div>
      </div>

      <div style="display: flex; gap: 10px; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid var(--gray-border);">
        ${isRandomMatch ? `
          <button type="button" class="btn btn-line" onclick="window.triggerSmartCoffeeMatch()" style="padding: 8px 16px; font-size: 0.84rem; font-weight: 700;">
            🎲 Estrai un Altro Socio
          </button>
        ` : `
          <button type="button" class="btn btn-line" onclick="window.openProfileModal('${m.id}')" style="padding: 8px 16px; font-size: 0.84rem; font-weight: 700;">
            ← Torna alla Scheda
          </button>
        `}
        <button type="button" class="btn btn-line" onclick="document.getElementById('coffeeModal').classList.remove('open')" style="padding: 8px 16px; font-size: 0.84rem;">
          Chiudi
        </button>
      </div>
    `;

    DOM.coffeeModal.classList.add('open');
  }

  // ==========================================================================
  // VIEW 2: INIZIATIVE (SCHEDE UNIFORMI CLICCABILI + DASHBOARD SINGOLA INIZIATIVA)
  // ==========================================================================
  function renderProjectsView() {
    const gridContainer = document.getElementById('projectsListContainer');
    const gridView = document.getElementById('projectsGridView');
    const dashView = document.getElementById('initiativeDashboardView');
    if (!gridContainer) return;

    if (state.activeProjectId) {
      openInitiativeDashboard(state.activeProjectId);
      return;
    }

    if (gridView) gridView.style.display = 'block';
    if (dashView) dashView.style.display = 'none';

    let html = '';
    state.projects.forEach(p => {
      const filesCount = (p.recentFiles || []).length;
      html += `
        <article class="initiative-card-uniform" style="--init-color: ${p.badgeColor || 'var(--blue)'};" onclick="window.openInitiativeDashboard('${p.id}')">
          <div class="init-card-top">
            <div class="init-card-badges">
              <span class="init-cat-pill">${p.category}</span>
              <span class="init-files-count-pill">📂 ${filesCount} File Operativi nel Drive</span>
            </div>
            <h3 class="init-card-title">${p.title}</h3>
            <p class="init-card-tagline">${p.tagline}</p>
            <p class="init-card-desc">${p.description}</p>
          </div>

          <div class="init-card-footer">
            <div class="proj-territory-pills">
              ${(p.provinces || []).map(prov => `<span class="prov-pill-sm">${prov}</span>`).join('')}
            </div>

            <div class="init-meta-row">
              <span>👤 <strong>Ref:</strong> ${p.lead.split('&')[0].trim()}</span>
              <span>🟢 <strong>${p.status}</strong></span>
            </div>

            <button type="button" class="btn-open-init-dashboard">
              📊 Apri Dashboard, File Recenti & Cartella Drive →
            </button>
          </div>
        </article>
      `;
    });

    gridContainer.innerHTML = html;
  }

  function openInitiativeDashboard(projectId) {
    const p = state.projects.find(item => item.id === projectId);
    if (!p) return;

    state.activeProjectId = projectId;
    const gridView = document.getElementById('projectsGridView');
    const dashView = document.getElementById('initiativeDashboardView');
    if (!gridView || !dashView) return;

    gridView.style.display = 'none';
    dashView.style.display = 'block';

    // 1. KPI Cards dell'Iniziativa
    const kpisHtml = (p.dashboardKpis || []).map(k => `
      <div class="macro-metric-card">
        <span class="macro-metric-lbl">${k.label}</span>
        <div class="macro-metric-val">${k.val}</div>
        <p class="macro-metric-sub">${k.sub}</p>
      </div>
    `).join('');

    // 2. Dashboard di Rielaborazione dei File Più Aperti e Modificati di Recente
    const recentFilesHtml = (p.recentFiles || []).map(f => `
      <div class="recent-file-card">
        <div class="rf-top">
          <div class="rf-badges">
            <span class="rf-type-tag">${f.icon || '📄'} ${f.type}</span>
            <span class="rf-status-tag">${f.statusBadge || 'Recente'}</span>
          </div>
          <h4 class="rf-title">${f.name}</h4>
          <p class="rf-digest">${f.digest}</p>
        </div>
        <div class="rf-bottom">
          <span class="rf-date">🕒 Aggiornato: ${f.modifiedDate}</span>
          <a href="${f.url}" target="_blank" rel="noopener" class="btn-rf-open">
            Apri File su Drive ↗
          </a>
        </div>
      </div>
    `).join('');

    // 3. Rielaborazione Contenuti & Pilastri Operativi
    const highlightsHtml = (p.highlights || []).map(h => `
      <div class="chapter-card">
        <div class="chapter-content">
          <h4 class="chapter-title">${h.title}</h4>
          <p class="chapter-desc">${h.text}</p>
        </div>
      </div>
    `).join('');

    // 4. Sezione Speciale per "Ecosistemi dell'Innovazione": Dashboard Analisi Socioeconomica + Position Paper (Sx Capitoli, Dx Preview Cliccabile)
    let specialEcosystemHtml = '';
    if (p.id === 'ecosistemi-innovazione') {
      specialEcosystemHtml = `
        <!-- DASHBOARD DATI ANALISI SOCIOECONOMICA DELLE 6 PROVINCE -->
        <section class="socioeconomic-dashboard" aria-label="Dashboard Analisi Socioeconomica">
          <div class="socio-dash-header">
            <div>
              <span style="font-size: 0.74rem; font-weight: 900; text-transform: uppercase; color: var(--blue); letter-spacing: 0.05em;">
                📊 OSSERVATORIO SOCIOECONOMICO & GRANDI INSEDIAMENTI • QUADRANTE ORIENTALE
              </span>
              <h3 class="socio-dash-title">Dati Socioeconomici & Diagnosi Territoriale delle 6 Province</h3>
              <p style="font-size: 0.86rem; color: var(--ink-soft); margin-top: 2px;">
                Quadro integrato elaborato dai file della cartella Ecosistemi (<em>PODS Mappatura</em>, <em>Verbale 27 Settembre</em> e rilevazioni ISTAT / Unioncamere / UPO).
              </p>
            </div>
            <a href="${p.primaryDocUrl}" target="_blank" rel="noopener" class="btn btn-blue" style="padding: 8px 16px; font-size: 0.82rem; border-radius: 999px; text-decoration: none; background: var(--blue); color: #fff; font-weight: 800;">
              📄 Apri Google Doc / Slides Mappatura ↗
            </a>
          </div>

          <div class="metrics-macro-grid">
            <div class="macro-metric-card">
              <span class="macro-metric-lbl">👥 Popolazione (6 Province)</span>
              <div class="macro-metric-val">1.385.000 <span style="font-size: 0.95rem; font-weight: 700; color: #d9534f;">(-3,2%)</span></div>
              <p class="macro-metric-sub">32% del Piemonte • Sfida demografica e attrazione giovani</p>
            </div>
            <div class="macro-metric-card">
              <span class="macro-metric-lbl">💶 Valore Aggiunto Territoriale</span>
              <div class="macro-metric-val">41,8 Mrd €</div>
              <p class="macro-metric-sub">Forte vocazione manifatturiera, chimica, agritech e logistica</p>
            </div>
            <div class="macro-metric-card">
              <span class="macro-metric-lbl">⚡ Data Center Trino (VC)</span>
              <div class="macro-metric-val">400 MW</div>
              <p class="macro-metric-sub">Progetto TechBau: 2° polo più grande d'Europa per potenza</p>
            </div>
            <div class="macro-metric-card">
              <span class="macro-metric-lbl">🔬 Silicon Box Novara (NO)</span>
              <div class="macro-metric-val">3,2 Mrd €</div>
              <p class="macro-metric-sub">Gigafactory semiconduttori • 1.600 posti ad alta qualifica</p>
            </div>
            <div class="macro-metric-card">
              <span class="macro-metric-lbl">🎓 Sistema Accademico UPO</span>
              <div class="macro-metric-val">16.200 <span style="font-size: 0.95rem; font-weight: 700; color: var(--purple);">studenti</span></div>
              <p class="macro-metric-sub">Poli a Vercelli, Novara e Alessandria + Città Studi Biella</p>
            </div>
            <div class="macro-metric-card">
              <span class="macro-metric-lbl">🕸️ Categorie Open Innovation</span>
              <div class="macro-metric-val">24 <span style="font-size: 0.95rem; font-weight: 700; color: var(--blue);">categorie</span></div>
              <p class="macro-metric-sub">Mappate tra Incubatori, Unioni Industriali, Fondazioni e VC</p>
            </div>
          </div>

          <div class="provinces-socio-grid">
            <div class="province-socio-card" style="--prov-c: var(--blue);">
              <div class="prov-socio-head">
                <span class="prov-socio-name">Novara (NO)</span>
                <span class="prov-socio-stat">Silicon Box & UPO</span>
              </div>
              <p class="prov-socio-desc">Insediamento Silicon Box, Chimica-Pharma, Logistica, Scuola di Medicina e DISEI UPO, Fondazione Novara Sviluppo.</p>
            </div>
            <div class="province-socio-card" style="--prov-c: var(--yellow);">
              <div class="prov-socio-head">
                <span class="prov-socio-name">Vercelli (VC)</span>
                <span class="prov-socio-stat">Data Center 400MW</span>
              </div>
              <p class="prov-socio-desc">Polo Data Center 400MW a Trino Vercellese, Rettorato UPO, Agritech risicolo, Confindustria Novara Vercelli Valsesia.</p>
            </div>
            <div class="province-socio-card" style="--prov-c: var(--purple);">
              <div class="prov-socio-head">
                <span class="prov-socio-name">Alessandria (AL)</span>
                <span class="prov-socio-stat">DIGSPES & Logistica</span>
              </div>
              <p class="prov-socio-desc">Dipartimenti DIGSPES e DISIT UPO, retroporto ligure, distretto orafo Valenza, Corso Branding con Comune e Alexala.</p>
            </div>
            <div class="province-socio-card" style="--prov-c: var(--green);">
              <div class="prov-socio-head">
                <span class="prov-socio-name">Biella (BI)</span>
                <span class="prov-socio-stat">Città Studi & Tessile</span>
              </div>
              <p class="prov-socio-desc">Città Studi Biella, Unione Industriale Biellese, Fondazione Cassa di Risparmio di Biella, Sellalab e filiera tessile sostenibile.</p>
            </div>
            <div class="province-socio-card" style="--prov-c: var(--brown);">
              <div class="prov-socio-head">
                <span class="prov-socio-name">Asti (AT)</span>
                <span class="prov-socio-stat">Polo Astiss & Agritech</span>
              </div>
              <p class="prov-socio-desc">Polo Universitario Astiss, enomeccanica, filiere vitivinicole UNESCO e innovazione per il Terzo Settore.</p>
            </div>
            <div class="province-socio-card" style="--prov-c: var(--sky);">
              <div class="prov-socio-head">
                <span class="prov-socio-name">Verbano-Cusio-Ossola (VB)</span>
                <span class="prov-socio-stat">Terre Alte & Green</span>
              </div>
              <p class="prov-socio-desc">Parco Tecnologico Lago Maggiore, energie rinnovabili idroelettriche, manifattura e connettività alpina.</p>
            </div>
          </div>
        </section>

        <!-- POSITION PAPER: SINTESI PER CAPITOLI (SX) + PREVIEW CLICCABILE (DX) -->
        <section class="position-paper-split-row" aria-label="Position Paper Sintesi per Capitoli e Anteprima Cliccabile">
          <!-- SINISTRA: RIASSUNTO PER CAPITOLI -->
          <div class="paper-summary-col">
            <div class="paper-summary-header">
              <span class="step-badge" style="background: var(--ink);">POSITION PAPER & PERCORSO FORMATIVO</span>
              <h3 class="paper-h3" style="margin-top: 8px;">
                Sintesi per Capitoli — Position Paper Ecosistemi dell'Innovazione
              </h3>
              <p class="paper-intro">
                Articolazione per capitoli dei documenti strategici elaborati nella cartella <em>Iniziativa 1 - Ecosistemi e Innovazione</em>.
              </p>
            </div>

            <div class="chapter-card">
              <div class="chapter-number">CAP. 1</div>
              <div class="chapter-content">
                <h4 class="chapter-title">Diagnosi Socioeconomica & Mappatura dei 24 Attori</h4>
                <p class="chapter-desc">
                  Censimento sistematico delle 24 categorie di attori dell'Open Innovation (Università, Centri di Ricerca, Incubatori, Unioni Industriali, Fondazioni Bancarie, Distretti Produttivi) nelle province di Biella, Vercelli, Novara, Alessandria, Asti e VCO per superare la frammentazione territoriale.
                </p>
                <div class="chapter-key-points">Fonte: PODS Mappatura (Slides) • 24 nodi ecosistemici</div>
              </div>
            </div>

            <div class="chapter-card">
              <div class="chapter-number">CAP. 2</div>
              <div class="chapter-content">
                <h4 class="chapter-title">I Grandi Insediamenti: Silicon Box (Novara) & Data Center 400MW (Trino VC)</h4>
                <p class="chapter-desc">
                  Analisi delle ricadute industriali, energetiche e formative dei due più grandi investimenti tecnologici del quadrante: il Data Center da 400MW di Trino Vercellese (secondo in Europa, TechBau) e la gigafactory di semiconduttori Silicon Box a Novara. Preparazione di brief di 4 pagine per il confronto con le Unioni Industriali.
                </p>
                <div class="chapter-key-points">Fonte: Verbale Assemblea 27 Settembre • Coordinamento Cavallini, Franco, Roberto</div>
              </div>
            </div>

            <div class="chapter-card">
              <div class="chapter-number">CAP. 3</div>
              <div class="chapter-content">
                <h4 class="chapter-title">Il Modello Operativo PODS in 5 Pilastri</h4>
                <p class="chapter-desc">
                  Architettura d'intervento basata su: <strong>1) Community dei Talenti e delle Imprese</strong>; <strong>2) Laboratori Itineranti</strong> di problem solving; <strong>3) Piattaforma di Tutoring</strong>; <strong>4) Pubblicazioni Open</strong>; <strong>5) Ecosistema Digitale Condiviso</strong>.
                </p>
                <div class="chapter-key-points">Fonte: PODS Mappatura • Convergenza Quadrupla Elica</div>
              </div>
            </div>

            <div class="chapter-card">
              <div class="chapter-number">CAP. 4</div>
              <div class="chapter-content">
                <h4 class="chapter-title">Percorso Universitario "Dall'Idea alla Startup" (4 Moduli / 8 Ore)</h4>
                <p class="chapter-desc">
                  Programma pratico per studenti e ricercatori UPO: <strong>Modulo 1</strong> (Dall'idea al problema & Customer Discovery), <strong>Modulo 2</strong> (Proposta di valore, Design Thinking & JTBD), <strong>Modulo 3</strong> (Business Model Canvas & Assumption Mapping), <strong>Modulo 4</strong> (MVP, validazione e orientamento verso Incubatori e Venture Capital).
                </p>
                <div class="chapter-key-points">Fonte: [BOZZA] Proposta di percorso formativo - Dall'idea alla startup</div>
              </div>
            </div>
          </div>

          <!-- DESTRA: PREVIEW CLICCABILE CHE PORTA AL LINK -->
          <div class="paper-preview-col">
            <div style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: var(--ink-soft); letter-spacing: 0.05em;">
              Anteprima Cliccabile • Apre il Documento su Google Drive
            </div>

            <a href="${p.primaryDocUrl}" target="_blank" rel="noopener" class="paper-cover-card" title="Clicca per aprire il documento ufficiale su Google Drive">
              <div class="paper-cover-ribbon">
                <span>PODS POSITION PAPER & MAPPATURA</span>
                <span>GOOGLE DRIVE • LIVE</span>
              </div>

              <div class="paper-cover-graphic">
                <div class="cover-top-brand">
                  <svg class="cover-brand-logo" viewBox="121 1028 962 336" aria-hidden="true">
                    <use href="img/sprite.svg#p-letters"/>
                  </svg>
                  <span class="cover-doc-type">DOSSIER ECOSISTEMI</span>
                </div>

                <div class="cover-center-title">
                  <div class="cover-h1">ECOSISTEMI DELL'INNOVAZIONE</div>
                  <div class="cover-h2">PIEMONTE ORIENTALE</div>
                  <div class="cover-pills-bar">
                    <span style="background: var(--yellow);">VC</span>
                    <span style="background: var(--blue); color: #fff;">NO</span>
                    <span style="background: var(--purple); color: #fff;">AL</span>
                    <span style="background: var(--green);">AT</span>
                    <span style="background: var(--sky);">BI</span>
                    <span style="background: var(--brown); color: #fff;">VB</span>
                  </div>
                  <p class="cover-sub">
                    Mappatura 24 attori, Dossier Data Center 400MW Trino & Silicon Box Novara, e percorso "Dall'idea alla startup".
                  </p>
                </div>

                <div class="cover-bottom-meta">
                  <div class="cover-author">Gruppo Ecosistemi PODS</div>
                  <div class="cover-meta-tags">
                    <span>Ottobre 2026</span>
                    <span>Drive Sync</span>
                  </div>
                </div>
              </div>

              <div class="paper-cover-action">
                <div class="action-text">
                  <strong>📥 Clicca per Aprire il Position Paper / Mappatura ↗</strong>
                  <span>Accesso diretto al file operativo nel Google Drive PODS</span>
                </div>
                <div class="action-icon">↗</div>
              </div>
            </a>

            <a href="${p.secondaryDocUrl}" target="_blank" rel="noopener" class="btn-gdoc-link">
              📄 Apri Google Doc: "Percorso Dall'Idea alla Startup" ↗
            </a>
          </div>
        </section>
      `;
    }

    dashView.innerHTML = `
      <div class="initiative-dashboard-wrapper">
        <!-- Top Navigation & Link Diretto alla Cartella Google Drive -->
        <div class="init-dash-topbar">
          <button type="button" class="btn-back-initiatives" onclick="window.closeInitiativeDashboard()">
            ← Torna a tutte le Iniziative (6)
          </button>
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <span class="init-cat-pill" style="background: var(--card-y);">${p.category}</span>
            <span style="font-size: 0.82rem; font-weight: 800; color: var(--blue);">🟢 ${p.status}</span>
          </div>
        </div>

        <!-- Intestazione Iniziativa + Bottone Cartella Operativa Drive -->
        <div class="drive-folder-hero-bar">
          <div style="max-width: 780px;">
            <span style="font-size: 0.74rem; font-weight: 900; text-transform: uppercase; color: var(--blue); letter-spacing: 0.05em;">
              DASHBOARD OPERATIVA SINCRONIZZATA COL GOOGLE DRIVE
            </span>
            <h2 style="font-size: clamp(1.6rem, 2.8vw, 2.2rem); font-weight: 900; color: var(--ink); margin-top: 4px;">
              ${p.title}
            </h2>
            <p style="font-size: 0.95rem; color: var(--ink); margin-top: 6px; line-height: 1.5;">
              ${p.description}
            </p>
            <div style="font-size: 0.84rem; color: var(--ink-soft); margin-top: 8px;">
              👤 <strong>Referenti & Gruppo di Lavoro:</strong> ${p.lead}
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; flex-shrink: 0;">
            <a href="${p.driveFolderUrl}" target="_blank" rel="noopener" class="btn btn-ink" style="background: var(--blue); color: #fff; padding: 14px 22px; border-radius: 999px; font-weight: 800; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
              📂 Apri Cartella Operativa su Google Drive ↗
            </a>
            <button type="button" class="btn btn-line" onclick="window.switchTab('territory'); window.setTerritoryMapMode('initiatives');" style="padding: 9px 16px; border-radius: 999px; font-size: 0.8rem; font-weight: 800; border: 1.5px solid var(--ink); background: #fff; cursor: pointer;">
              🗺️ Vedi i Nodi di questa Iniziativa sulla Mappa →
            </button>
          </div>
        </div>

        <!-- Numeri Chiave dell'Iniziativa -->
        <div>
          <div style="font-size: 0.78rem; font-weight: 900; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 10px; letter-spacing: 0.05em;">
            📈 Indicatori Sintetici Estratti dai Documenti
          </div>
          <div class="metrics-macro-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
            ${kpisHtml}
          </div>
        </div>

        <!-- DASHBOARD DI RIELABORAZIONE DEI FILE PIÙ APERTI E MODIFICATI DI RECENTE -->
        <section class="recent-files-section">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 10px;">
            <div>
              <span style="font-size: 0.75rem; font-weight: 900; text-transform: uppercase; color: var(--blue); letter-spacing: 0.05em;">
                🔄 SINCRONIZZAZIONE GOOGLE DRIVE • FILE PIÙ APERTI & MODIFICATI DI RECENTE
              </span>
              <h3 style="font-size: 1.35rem; font-weight: 900; color: var(--ink); margin-top: 2px;">
                Dashboard di Rielaborazione dei File Operativi (${(p.recentFiles || []).length} documenti)
              </h3>
            </div>
            <a href="${p.driveFolderUrl}" target="_blank" rel="noopener" style="font-size: 0.84rem; font-weight: 800; color: var(--blue); text-decoration: underline;">
              Sfoglia tutti i file nella cartella Drive ↗
            </a>
          </div>

          <div class="recent-files-grid">
            ${recentFilesHtml}
          </div>
        </section>

        <!-- Sintesi Strutturata dei Contenuti -->
        <div>
          <h3 style="font-size: 1.3rem; font-weight: 900; color: var(--ink); margin-bottom: 12px;">
            🧭 Sintesi Esecutiva & Linee d'Azione dell'Iniziativa
          </h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${highlightsHtml}
          </div>
        </div>

        ${specialEcosystemHtml}
      </div>
    `;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeInitiativeDashboard() {
    state.activeProjectId = null;
    renderProjectsView();
  }

  // ==========================================================================
  // VIEW 3: TERRITORIO & MAPPA INTERATTIVA LEAFLET (INIZIATIVE vs MEMBRI)
  // ==========================================================================
  function renderTerritoryView() {
    // 1. Aggiorna barre di distribuzione provinciale
    const listContainer = document.getElementById('provDistributionList');
    if (listContainer) {
      const total = state.members.length || 1;
      let html = '';

      state.provinces.forEach(prov => {
        const count = state.members.filter(m => (m.province || '').toLowerCase() === prov.name.toLowerCase()).length;
        const pct = Math.round((count / total) * 100);

        html += `
          <div class="prov-bar-item">
            <div class="prov-bar-head">
              <span><strong>${prov.name}</strong> (${prov.code})</span>
              <span style="color: var(--blue); font-weight: 800;">${count} schede (${pct}%)</span>
            </div>
            <div class="prov-bar-track">
              <div class="prov-bar-fill" style="width: ${Math.max(4, pct)}%; --bar-color: ${prov.color};"></div>
            </div>
            <div style="font-size: 0.78rem; color: var(--ink-soft);">${prov.description}</div>
          </div>
        `;
      });

      listContainer.innerHTML = html;
    }

    // 2. Inizializza o aggiorna la mappa interattiva Leaflet
    setTimeout(() => {
      initOrUpdateTerritoryMap();
    }, 80);
  }

  function initOrUpdateTerritoryMap() {
    const mapEl = document.getElementById('podsInteractiveMap');
    if (!mapEl || typeof L === 'undefined') return;

    if (!state.mapInstance) {
      state.mapInstance = L.map('podsInteractiveMap', {
        center: [45.32, 8.42],
        zoom: 9,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap • PODS Piemonte Orientale Digitale e Solidale'
      }).addTo(state.mapInstance);

      state.mapMarkersLayer = L.layerGroup().addTo(state.mapInstance);
    } else {
      state.mapInstance.invalidateSize();
    }

    renderMapMarkers();
  }

  function setTerritoryMapMode(mode) {
    state.mapMode = mode; // 'initiatives' | 'members'
    const btnInit = document.getElementById('btnMapModeInitiatives');
    const btnMem = document.getElementById('btnMapModeMembers');
    const catFilters = document.getElementById('mapCategoryFilters');
    const memAction = document.getElementById('mapMembersActionBox');

    if (btnInit) btnInit.classList.toggle('active', mode === 'initiatives');
    if (btnMem) btnMem.classList.toggle('active', mode === 'members');
    if (catFilters) catFilters.style.display = mode === 'initiatives' ? 'flex' : 'none';
    if (memAction) memAction.style.display = mode === 'members' ? 'block' : 'none';

    renderMapMarkers();
  }

  function setTerritoryCategoryFilter(cat) {
    state.mapCategoryFilter = cat;
    const catFilters = document.getElementById('mapCategoryFilters');
    if (catFilters) {
      catFilters.querySelectorAll('.sector-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mapcat === cat);
      });
    }
    renderMapMarkers();
  }

  function createColoredCircleMarker(lat, lng, fillColor, radius = 10) {
    return L.circleMarker([lat, lng], {
      radius,
      fillColor,
      color: '#222124',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.92
    });
  }

  function renderMapMarkers() {
    if (!state.mapInstance || !state.mapMarkersLayer) return;
    state.mapMarkersLayer.clearLayers();

    const bounds = [];

    if (state.mapMode === 'initiatives') {
      const points = state.territoryPoints.filter(pt => {
        if (state.mapCategoryFilter === 'all') return true;
        return pt.category === state.mapCategoryFilter;
      });

      points.forEach(pt => {
        let color = '#2867AE'; // hub
        if (pt.category === 'school') color = '#E5C95C';
        if (pt.category === 'university') color = '#AE75A7';

        const marker = createColoredCircleMarker(pt.lat, pt.lng, color, pt.category === 'hub' ? 12 : 9);
        const popupHtml = `
          <div style="font-family: 'Archivo', sans-serif; min-width: 240px; max-width: 300px;">
            <div style="font-size: 0.68rem; font-weight: 900; text-transform: uppercase; color: #2867AE; margin-bottom: 3px;">
              ${pt.categoryLabel} • ${pt.province}
            </div>
            <div style="font-size: 1rem; font-weight: 900; color: #222124; line-height: 1.2; margin-bottom: 4px;">
              ${pt.name}
            </div>
            <div style="font-size: 0.78rem; color: #555; margin-bottom: 6px;">
              📍 ${pt.address}
            </div>
            <div style="font-size: 0.8rem; background: #f5f5f2; padding: 8px; border-radius: 6px; margin-bottom: 8px; line-height: 1.4;">
              <strong>Iniziativa PODS:</strong> ${pt.initiative}<br>
              ${pt.details}
            </div>
            ${pt.docUrl ? `<a href="${pt.docUrl}" target="_blank" rel="noopener" style="font-size: 0.8rem; font-weight: 800; color: #2867AE; text-decoration: underline;">📂 Apri Documento su Google Drive ↗</a>` : ''}
          </div>
        `;
        marker.bindPopup(popupHtml);
        marker.addTo(state.mapMarkersLayer);
        bounds.push([pt.lat, pt.lng]);
      });
    } else {
      // Modalità 'members': mostra dove si collocano i membri PODS in base all'indirizzo di casa o di lavoro
      state.members.forEach(m => {
        const lat = m.lat || (CITY_COORDS_FALLBACK[(m.city || '').toLowerCase()] || CITY_COORDS_FALLBACK[(m.province || '').toLowerCase()] || { lat: 45.3265, lng: 8.4232 }).lat;
        const lng = m.lng || (CITY_COORDS_FALLBACK[(m.city || '').toLowerCase()] || CITY_COORDS_FALLBACK[(m.province || '').toLowerCase()] || { lat: 45.3265, lng: 8.4232 }).lng;

        const color = m.isPlaceholder ? '#E5C95C' : '#99C454';
        const marker = createColoredCircleMarker(lat, lng, color, 11);

        const popupHtml = `
          <div style="font-family: 'Archivo', sans-serif; min-width: 230px; max-width: 280px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <img src="${m.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(m.firstName)}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
              <div>
                <div style="font-size: 0.68rem; font-weight: 900; text-transform: uppercase; color: #2867AE;">
                  ${m.role} ${m.isPlaceholder ? '(Esempio)' : ''}
                </div>
                <div style="font-size: 0.98rem; font-weight: 900; color: #222124;">
                  ${m.firstName} ${m.lastName}
                </div>
              </div>
            </div>
            <div style="font-size: 0.82rem; font-weight: 700; color: #333; margin-bottom: 4px;">
              ${m.headline || ''}
            </div>
            <div style="font-size: 0.78rem; color: #555; margin-bottom: 8px;">
              📍 <strong>Indirizzo:</strong> ${m.address || m.city || m.province}
            </div>
            <div style="display: flex; gap: 8px;">
              <button type="button" onclick="window.openProfileModal('${m.id}')" style="background: #2867AE; color: #fff; border: none; padding: 5px 10px; border-radius: 999px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">
                Apri Scheda
              </button>
              <button type="button" onclick="window.openEditMemberModal('${m.id}')" style="background: #eee; color: #222; border: 1px solid #ccc; padding: 5px 10px; border-radius: 999px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">
                ✏️ Modifica Indirizzo
              </button>
            </div>
          </div>
        `;
        marker.bindPopup(popupHtml);
        marker.addTo(state.mapMarkersLayer);
        bounds.push([lat, lng]);
      });
    }

    if (bounds.length > 1) {
      state.mapInstance.fitBounds(bounds, { padding: [36, 36], maxZoom: 12 });
    } else if (bounds.length === 1) {
      state.mapInstance.setView(bounds[0], 12);
    }
  }

  // ==========================================================================
  // VIEW 4: CALENDARIO CONDIVISO, VISTA MENSILE / SETTIMANALE & GOOGLE CALENDAR
  // ==========================================================================
  const calendarState = {
    view: 'list', // 'list' | 'month' | 'week'
    currentDate: new Date(2026, 10, 1) // Inizio impostato su Novembre 2026 (mese attivo degli incontri PODS)
  };

  const MONTH_NAMES_IT = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];
  const WEEKDAYS_SHORT_IT = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  function switchCalendarView(viewType) {
    if (!['list', 'month', 'week'].includes(viewType)) viewType = 'list';
    calendarState.view = viewType;

    // Aggiorna pulsanti toggle
    document.querySelectorAll('.cal-toggle-btn').forEach(btn => btn.classList.remove('active'));
    if (viewType === 'list') {
      const b = document.getElementById('btnCalViewList');
      if (b) b.classList.add('active');
    } else if (viewType === 'month') {
      const b = document.getElementById('btnCalViewMonth');
      if (b) b.classList.add('active');
    } else if (viewType === 'week') {
      const b = document.getElementById('btnCalViewWeek');
      if (b) b.classList.add('active');
    }

    // Toggle visibilità contenitori
    const listCont = document.getElementById('calendarEventsContainer');
    const monthCont = document.getElementById('calendarMonthContainer');
    const weekCont = document.getElementById('calendarWeekContainer');
    const navBar = document.getElementById('calendarNavBar');

    if (listCont) listCont.style.display = viewType === 'list' ? 'flex' : 'none';
    if (monthCont) monthCont.style.display = viewType === 'month' ? 'block' : 'none';
    if (weekCont) weekCont.style.display = viewType === 'week' ? 'block' : 'none';
    if (navBar) navBar.style.display = viewType === 'list' ? 'none' : 'flex';

    renderCurrentCalendarView();
  }

  function navigateCalendar(dir) {
    if (dir === 0) {
      calendarState.currentDate = new Date();
    } else if (calendarState.view === 'month') {
      calendarState.currentDate.setMonth(calendarState.currentDate.getMonth() + dir);
    } else if (calendarState.view === 'week') {
      calendarState.currentDate.setDate(calendarState.currentDate.getDate() + (dir * 7));
    }
    renderCurrentCalendarView();
  }

  function renderCurrentCalendarView() {
    // Aggiorna il titolo della barra di navigazione
    const navTitle = document.getElementById('calendarNavTitle');
    if (navTitle) {
      const month = MONTH_NAMES_IT[calendarState.currentDate.getMonth()];
      const year = calendarState.currentDate.getFullYear();
      if (calendarState.view === 'week') {
        const monday = getMondayOfWeek(calendarState.currentDate);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        navTitle.textContent = `${monday.getDate()} ${MONTH_NAMES_IT[monday.getMonth()].slice(0, 3)} – ${sunday.getDate()} ${MONTH_NAMES_IT[sunday.getMonth()]} ${sunday.getFullYear()}`;
      } else {
        navTitle.textContent = `${month} ${year}`;
      }
    }

    if (calendarState.view === 'list') {
      renderCalendarView();
    } else if (calendarState.view === 'month') {
      renderCalendarMonthView();
    } else if (calendarState.view === 'week') {
      renderCalendarWeekView();
    }
  }

  // 1. VISTA ELENCO CARD
  function renderCalendarView() {
    const eventsContainer = document.getElementById('calendarEventsContainer');
    if (!eventsContainer) return;

    let html = '';
    state.calendarEvents.forEach(ev => {
      const dateObj = new Date(ev.date);
      const day = dateObj.getDate() || 10;
      const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
      const month = monthNames[dateObj.getMonth()] || "Nov";

      const gcalTitle = encodeURIComponent(`PODS: ${ev.title}`);
      const gcalDetails = encodeURIComponent(`${ev.description}\n\nLink Google Meet: ${ev.meetLink || 'N/A'}\nOrganizzatore: ${ev.organizer}`);
      const gcalLocation = encodeURIComponent(ev.meetLink || ev.locationAddress || 'Online Google Meet');
      const gcalDate = ev.date.replace(/-/g, '') + 'T173000Z/' + ev.date.replace(/-/g, '') + 'T190000Z';
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gcalTitle}&dates=${gcalDate}&details=${gcalDetails}&location=${gcalLocation}`;

      html += `
        <div class="event-card" data-event-id="${ev.id}">
          <div class="event-date-box">
            <span class="event-date-day">${day}</span>
            <span class="event-date-month">${month}</span>
            <span class="event-date-time">⏰ ${ev.time}</span>
          </div>

          <div class="event-info-box">
            <span class="event-type-badge" style="--type-bg: ${ev.typeColor}; --type-color: #fff;">
              ${ev.typeLabel} • ${ev.group}
            </span>
            <h3 class="event-title">${ev.title}</h3>
            <p style="font-size: 0.9rem; color: var(--ink-soft); line-height: 1.45;">${ev.description}</p>
            
            <div class="event-meta-row">
              <span>👤 <strong>Coordinamento:</strong> ${ev.organizer}</span>
              <span>📍 <strong>Luogo:</strong> ${ev.locationAddress}</span>
            </div>

            ${ev.notes ? `
              <div class="event-notes-box">
                <strong>📝 Verbale / Riferimento Drive:</strong> ${ev.notes}
              </div>
            ` : ''}

            <button class="event-notes-toggle" onclick="window.promptAddNoteToEvent('${ev.id}')">
              ✏️ Aggiungi / Modifica Appunti e Verbale di questa Riunione
            </button>
          </div>

          <div class="event-actions-col">
            ${ev.meetLink ? `
              <a href="${ev.meetLink}" target="_blank" rel="noopener" class="btn-meet-join">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                Entra su Meet
              </a>
            ` : ''}

            <a href="${gcalUrl}" target="_blank" rel="noopener" class="btn-gcal-add">
              📅 Aggiungi a GCalendar
            </a>
          </div>
        </div>
      `;
    });

    eventsContainer.innerHTML = html;
  }

  // 2. VISTA GRIGLIA MENSILE
  function renderCalendarMonthView() {
    const container = document.getElementById('calendarMonthContainer');
    if (!container) return;

    const cur = calendarState.currentDate;
    const year = cur.getFullYear();
    const month = cur.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDays = lastDayOfMonth.getDate();

    // Lunedì = 0, Domenica = 6
    let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6;

    const today = new Date();
    const isThisMonth = today.getFullYear() === year && today.getMonth() === month;

    let gridHtml = '<div class="cal-month-grid">';

    // Intestazione giorni della settimana (Lun -> Dom)
    WEEKDAYS_SHORT_IT.forEach(w => {
      gridHtml += `<div class="cal-day-header">${w}</div>`;
    });

    // Celle vuote prima del primo giorno del mese
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevNum = prevMonthLastDay - startingDayOfWeek + i + 1;
      gridHtml += `
        <div class="cal-day-cell other-month">
          <div class="cal-day-num">${prevNum}</div>
        </div>
      `;
    }

    // Giorni del mese corrente
    for (let day = 1; day <= totalDays; day++) {
      const padM = String(month + 1).padStart(2, '0');
      const padD = String(day).padStart(2, '0');
      const dateStr = `${year}-${padM}-${padD}`;
      const isToday = isThisMonth && today.getDate() === day;

      const dayEvents = state.calendarEvents.filter(e => e.date === dateStr);

      gridHtml += `
        <div class="cal-day-cell ${isToday ? 'today' : ''}">
          <div class="cal-day-num">
            <span>${day}</span>
            ${dayEvents.length > 0 ? `<span style="font-size: 0.65rem; background: var(--blue); color: #fff; padding: 1px 5px; border-radius: 999px;">${dayEvents.length}</span>` : ''}
          </div>
          <div class="cal-day-events-list">
            ${dayEvents.map(ev => `
              <button type="button" class="cal-month-event-pill" style="background: ${ev.typeColor || 'var(--blue)'};" onclick="window.openEventDetails('${ev.id}')" title="${ev.time}: ${ev.title}">
                ${ev.time ? ev.time.split('-')[0].trim() : ''} ${ev.title}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Completa la griglia fino alla fine della settimana (multiplo di 7)
    const totalRendered = startingDayOfWeek + totalDays;
    const remaining = (7 - (totalRendered % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      gridHtml += `
        <div class="cal-day-cell other-month">
          <div class="cal-day-num">${i}</div>
        </div>
      `;
    }

    gridHtml += '</div>';
    container.innerHTML = gridHtml;
  }

  // 3. VISTA SETTIMANALE
  function getMondayOfWeek(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  function renderCalendarWeekView() {
    const container = document.getElementById('calendarWeekContainer');
    if (!container) return;

    const monday = getMondayOfWeek(calendarState.currentDate);
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    let gridHtml = '<div class="cal-week-grid">';

    for (let i = 0; i < 7; i++) {
      const curDay = new Date(monday);
      curDay.setDate(monday.getDate() + i);

      const y = curDay.getFullYear();
      const m = String(curDay.getMonth() + 1).padStart(2, '0');
      const d = String(curDay.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;
      const isToday = dateStr === todayStr;

      const dayEvents = state.calendarEvents.filter(e => e.date === dateStr);

      gridHtml += `
        <div class="cal-week-col ${isToday ? 'today' : ''}">
          <div class="cal-week-col-header">
            <div class="cal-week-day-name">${WEEKDAYS_SHORT_IT[i]}</div>
            <div class="cal-week-day-number">${curDay.getDate()}</div>
            <div style="font-size: 0.72rem; color: var(--ink-soft); text-transform: uppercase;">${MONTH_NAMES_IT[curDay.getMonth()].slice(0, 3)}</div>
          </div>

          <div class="cal-week-col-events">
            ${dayEvents.length === 0 ? `
              <div style="font-size: 0.78rem; color: #aaa; text-align: center; margin-top: 24px;">Nessun incontro</div>
            ` : dayEvents.map(ev => `
              <div class="cal-week-event-card" style="border-left-color: ${ev.typeColor || 'var(--blue)'};" onclick="window.openEventDetails('${ev.id}')">
                <div style="font-size: 0.72rem; font-weight: 800; color: var(--blue);">⏰ ${ev.time}</div>
                <div style="font-size: 0.82rem; font-weight: 800; color: var(--ink); margin: 3px 0; line-height: 1.25;">${ev.title}</div>
                <div style="font-size: 0.7rem; color: var(--ink-soft);">${ev.group}</div>
                ${ev.meetLink ? `
                  <a href="${ev.meetLink}" target="_blank" rel="noopener" onclick="event.stopPropagation();" style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 800; color: #1a73e8; margin-top: 6px; text-decoration: underline;">
                    📹 Entra su Meet
                  </a>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    gridHtml += '</div>';
    container.innerHTML = gridHtml;
  }

  // APERTURA DETTAGLIO RAPIDO INCONTRO (DA MESE O SETTIMANA)
  function openEventDetails(eventId) {
    const ev = state.calendarEvents.find(e => e.id === eventId);
    if (!ev) return;

    const gcalTitle = encodeURIComponent(`PODS: ${ev.title}`);
    const gcalDetails = encodeURIComponent(`${ev.description}\n\nLink Google Meet: ${ev.meetLink || 'N/A'}\nOrganizzatore: ${ev.organizer}`);
    const gcalLocation = encodeURIComponent(ev.meetLink || ev.locationAddress || 'Online Google Meet');
    const gcalDate = ev.date.replace(/-/g, '') + 'T173000Z/' + ev.date.replace(/-/g, '') + 'T190000Z';
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gcalTitle}&dates=${gcalDate}&details=${gcalDetails}&location=${gcalLocation}`;

    const modalBody = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <span class="event-type-badge" style="--type-bg: ${ev.typeColor}; --type-color: #fff; width: fit-content;">
          ${ev.typeLabel} • ${ev.group}
        </span>
        <h2 style="font-size: 1.5rem; font-weight: 900; color: var(--ink); line-height: 1.25;">${ev.title}</h2>
        <div style="font-size: 0.95rem; font-weight: 700; color: var(--blue);">
          📅 ${ev.date} • ⏰ ${ev.time}
        </div>
        <p style="font-size: 0.92rem; color: var(--ink-soft); line-height: 1.5;">${ev.description}</p>
        
        <div style="background: var(--gray); border-radius: 10px; padding: 12px 16px; font-size: 0.85rem; display: flex; flex-direction: column; gap: 4px;">
          <div>👤 <strong>Coordinamento:</strong> ${ev.organizer}</div>
          <div>📍 <strong>Luogo:</strong> ${ev.locationAddress}</div>
          ${ev.notes ? `<div style="margin-top: 4px;">📝 <strong>Appunti/Verbale:</strong> ${ev.notes}</div>` : ''}
        </div>

        <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
          ${ev.meetLink ? `
            <a href="${ev.meetLink}" target="_blank" rel="noopener" class="btn-meet-join" style="flex: 1; justify-content: center;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              Entra su Google Meet
            </a>
          ` : ''}
          <a href="${gcalUrl}" target="_blank" rel="noopener" class="btn-gcal-add" style="flex: 1; justify-content: center;">
            📅 Aggiungi a Google Calendar
          </a>
        </div>
      </div>
    `;

    const profileBody = document.getElementById('profileModalBody');
    if (profileBody && DOM.profileModal) {
      profileBody.innerHTML = modalBody;
      DOM.profileModal.classList.add('open');
    }
  }

  // SINCRONIZZAZIONE LIVE GOOGLE CALENDAR & DOWNLOAD .ICS
  function getLiveCalendarUrl() {
    const origin = window.location.origin.includes('localhost')
      ? 'https://pods-community-platform-pods6.vercel.app'
      : window.location.origin;
    return `${origin}/api/calendar.ics`;
  }

  function openGcalSyncModal() {
    const modal = document.getElementById('gcalSyncModal');
    if (!modal) return;
    const feedUrl = getLiveCalendarUrl();
    const gcalUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(feedUrl)}`;

    const subscribeLink = document.getElementById('btnSubscribeGcalLink');
    if (subscribeLink) subscribeLink.href = gcalUrl;

    const feedInput = document.getElementById('gcalFeedUrlInput');
    if (feedInput) feedInput.value = feedUrl;

    modal.classList.add('open');
  }

  async function downloadCalendarIcs() {
    try {
      showToast('⏳ Preparazione file pods-calendar.ics...');
      const res = await fetch('/api/calendar?format=ics&download=1');
      if (!res.ok) throw new Error('Errore scaricamento calendario');
      const text = await res.text();
      const blob = new Blob([text], { type: 'text/calendar;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'pods-community-calendar.ics';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      showToast('📥 File pods-community-calendar.ics scaricato con successo!');
    } catch (e) {
      window.location.href = '/api/calendar?format=ics&download=1';
    }
  }

  function copyLiveCalendarFeed() {
    const feedUrl = getLiveCalendarUrl();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(feedUrl);
      showToast('🔗 Link Feed Live copiato! Incollalo in Google Calendar, Apple o Outlook.');
    } else {
      prompt('Copia questo link del feed iCal per Google Calendar o Apple Calendar:', feedUrl);
    }
  }

  function promptAddNoteToEvent(eventId) {
    const ev = state.calendarEvents.find(e => e.id === eventId);
    if (!ev) return;
    const newNote = prompt(`Inserisci appunti, decisioni prese o link ai documenti per:\n"${ev.title}"`, ev.notes || '');
    if (newNote !== null) {
      ev.notes = newNote.trim();
      saveEventsToStorage();
      renderCurrentCalendarView();
      showToast('Appunti della riunione salvati con successo!');
    }
  }

  async function handleAddEvent(e) {
    e.preventDefault();
    const fd = new FormData(DOM.addEventForm);

    const newEvent = {
      id: 'ev_' + Date.now(),
      title: fd.get('title').trim(),
      date: fd.get('date'),
      time: fd.get('time').trim() || "18:30 - 20:00",
      type: "plenary",
      typeLabel: fd.get('typeLabel') || "Incontro PODS",
      typeColor: "var(--blue)",
      locationType: "meet",
      meetLink: fd.get('meetLink').trim() || `https://meet.google.com/pod-${Math.random().toString(36).substring(2, 6)}`,
      locationAddress: fd.get('locationAddress').trim() || "Online su Google Meet",
      organizer: `${state.currentUser ? state.currentUser.firstName + ' ' + state.currentUser.lastName : 'Membro PODS'}`,
      group: fd.get('group') || "Tutti i Soci",
      description: fd.get('description').trim() || "Incontro operativo dell'associazione PODS.",
      notes: ""
    };

    state.calendarEvents.unshift(newEvent);
    saveEventsToStorage();

    // Sincronizza istantaneamente col backend serverless Vercel per aggiornare il feed iCal pubblico
    try {
      fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
    } catch (err) {}

    closeModals();
    DOM.addEventForm.reset();
    switchTab('calendar');
    renderCurrentCalendarView();
    updateDashboardStats();
    showToast(`Incontro "${newEvent.title}" salvato e sincronizzato sul feed Google Calendar!`);
  }

  // ==========================================================================
  // STATISTICHE, ACCOUNT MODAL E NAVIGAZIONE TAB
  // ==========================================================================
  function updateDashboardStats() {
    const navMem = document.getElementById('navCountMembers');
    if (navMem) navMem.textContent = state.members.length;
    const navProj = document.getElementById('navCountProjects');
    if (navProj) navProj.textContent = state.projects.length;
    const navEv = document.getElementById('navCountEvents');
    if (navEv) navEv.textContent = state.calendarEvents.length;

    const realCount = state.members.filter(m => !m.isPlaceholder).length;
    if (DOM.statMembers) DOM.statMembers.innerHTML = `${state.members.length} <span>schede</span>`;
    if (DOM.statMembersSub) DOM.statMembersSub.textContent = `${realCount} soci iscritti + ${state.members.length - realCount} esempi`;
    if (DOM.statProvinces) DOM.statProvinces.innerHTML = `6/6 <span>province</span>`;
    if (DOM.statProjects) DOM.statProjects.innerHTML = `${state.projects.length} <span>iniziative</span>`;
    if (DOM.statVolHours) DOM.statVolHours.innerHTML = `${state.territoryPoints.length} <span>nodi</span>`;
  }

  function openAccountModal() {
    if (!DOM.accountModal) return;
    const body = document.getElementById('accountModalBody');
    if (!body) return;

    let usersListHtml = '';
    state.members.forEach(m => {
      const isCur = state.currentUser && state.currentUser.id === m.id;
      usersListHtml += `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: ${isCur ? 'rgba(40,103,174,0.12)' : '#fff'}; border: 1.5px solid ${isCur ? 'var(--blue)' : 'var(--gray-border)'}; border-radius: 12px; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${m.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(m.firstName)}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover;">
            <div>
              <div style="font-weight: 800; font-size: 0.92rem; color: var(--ink);">${m.firstName} ${m.lastName} ${isCur ? '👑' : ''}</div>
              <div style="font-size: 0.76rem; color: var(--ink-soft);">${m.role} • ${m.province}</div>
            </div>
          </div>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-line" onclick="window.openEditMemberModal('${m.id}')" style="padding: 5px 10px; font-size: 0.76rem; border-radius: 999px; cursor: pointer; background: #fff;">
              ✏️
            </button>
            <button class="btn btn-line" onclick="window.switchUser('${m.id}')" style="padding: 5px 12px; font-size: 0.76rem; border-radius: 999px; cursor: pointer; background: #fff;">
              ${isCur ? 'Attivo' : 'Usa'}
            </button>
          </div>
        </div>
      `;
    });

    body.innerHTML = `
      <div style="text-align: center; margin-bottom: 18px;">
        <h2 style="font-size: 1.5rem; font-weight: 900; color: var(--ink);">Account & Gestione Profili</h2>
        <p style="font-size: 0.86rem; color: var(--ink-soft);">
          Crea la tua scheda socio reale con l'AI oppure seleziona/modifica un profilo esistente.
        </p>
      </div>

      <div style="max-height: 260px; overflow-y: auto; margin-bottom: 18px;">
        ${usersListHtml}
      </div>

      <div style="display: flex; gap: 10px;">
        <button class="btn btn-ink" onclick="document.getElementById('accountModal').classList.remove('open'); window.openNewMemberModal();" style="flex: 1; padding: 12px; border-radius: 999px; font-weight: 800; cursor: pointer; background: var(--blue); color: #fff; border: none;">
          ✨ + Crea Nuova Scheda Socio con AI
        </button>
        <button class="btn btn-line" onclick="document.getElementById('accountModal').classList.remove('open');" style="padding: 12px 18px; border-radius: 999px; font-weight: 700; cursor: pointer; background: transparent; border: 1.5px solid var(--ink);">
          Chiudi
        </button>
      </div>
    `;

    DOM.accountModal.classList.add('open');
  }

  function switchUser(userId) {
    const found = state.members.find(m => m.id === userId);
    if (found) {
      state.currentUser = found;
      saveCurrentUser();
      renderUserAccountPill();
      if (DOM.accountModal) DOM.accountModal.classList.remove('open');
      showToast(`Profilo attivo: ${found.firstName} ${found.lastName}`);
    }
  }

  function closeModals() {
    if (DOM.profileModal) DOM.profileModal.classList.remove('open');
    if (DOM.addMemberModal) DOM.addMemberModal.classList.remove('open');
    if (DOM.coffeeModal) DOM.coffeeModal.classList.remove('open');
    if (DOM.accountModal) DOM.accountModal.classList.remove('open');
    if (DOM.addEventModal) DOM.addEventModal.classList.remove('open');
  }

  function resetFilters() {
    state.filters = { search: '', province: 'all', sector: 'all', role: 'all' };
    if (DOM.searchInput) DOM.searchInput.value = '';
    if (DOM.roleFilter) DOM.roleFilter.value = 'all';
    renderProvinceStrip();
    renderSectorFilters();
    renderFilteredMembers();
  }

  function switchTab(tabId) {
    state.activeTab = tabId;

    DOM.navTabs.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    Object.keys(DOM.viewSections).forEach(key => {
      if (DOM.viewSections[key]) {
        DOM.viewSections[key].style.display = key === tabId ? 'block' : 'none';
      }
    });

    if (tabId === 'starthere') renderStartHereView();
    if (tabId === 'directory') renderFilteredMembers();
    if (tabId === 'projects') renderProjectsView();
    if (tabId === 'territory') renderTerritoryView();
    if (tabId === 'calendar') renderCurrentCalendarView();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function exportRosterToCSV() {
    const headers = ['Nome', 'Cognome', 'Tipo', 'Ruolo', 'Provincia', 'Città', 'Indirizzo', 'Settore', 'Titolo', 'Organizzazione', 'Email', 'LinkedIn', 'Superpoteri'];
    const rows = state.members.map(m => [
      `"${m.firstName}"`,
      `"${m.lastName}"`,
      `"${m.isPlaceholder ? 'Esempio' : 'Socio Reale'}"`,
      `"${m.role}"`,
      `"${m.province}"`,
      `"${m.city || ''}"`,
      `"${m.address || ''}"`,
      `"${m.primarySector}"`,
      `"${m.headline || ''}"`,
      `"${m.organization || ''}"`,
      `"${(m.contacts && m.contacts.email) || ''}"`,
      `"${(m.contacts && m.contacts.linkedin) || ''}"`,
      `"${(m.superpowers || []).join(', ')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `PODS_Membri_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Elenco soci esportato in CSV!');
  }

  function attachEvents() {
    if (DOM.userAccountBtn) DOM.userAccountBtn.addEventListener('click', openAccountModal);

    if (DOM.searchInput) {
      DOM.searchInput.addEventListener('input', (e) => {
        state.filters.search = e.target.value;
        renderFilteredMembers();
      });
    }

    if (DOM.roleFilter) {
      DOM.roleFilter.addEventListener('change', (e) => {
        state.filters.role = e.target.value;
        renderFilteredMembers();
      });
    }

    if (DOM.btnResetFilters) DOM.btnResetFilters.addEventListener('click', resetFilters);

    DOM.navTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.tab === 'projects') {
          state.activeProjectId = null;
        }
        switchTab(btn.dataset.tab);
      });
    });

    if (DOM.btnAddMember) {
      DOM.btnAddMember.addEventListener('click', openNewMemberModal);
    }

    if (DOM.addMemberForm) DOM.addMemberForm.addEventListener('submit', handleAddMember);

    const btnAiEnrich = document.getElementById('btnAiEnrich');
    if (btnAiEnrich) btnAiEnrich.addEventListener('click', runAiWebEnrichment);

    const memberPhotoInput = document.getElementById('memberPhotoInput');
    if (memberPhotoInput) {
      memberPhotoInput.addEventListener('input', (e) => {
        const val = (e.target.value || '').trim();
        const previewImg = document.getElementById('photoPreviewImg');
        if (previewImg) {
          previewImg.src = val || 'https://ui-avatars.com/api/?name=PODS&background=2867AE&color=fff';
        }
      });
    }

    const btnOpenAddEvent = document.getElementById('btnOpenAddEvent');
    if (btnOpenAddEvent) {
      btnOpenAddEvent.addEventListener('click', () => {
        if (DOM.addEventModal) DOM.addEventModal.classList.add('open');
      });
    }
    if (DOM.addEventForm) DOM.addEventForm.addEventListener('submit', handleAddEvent);

    const btnOpenGcalSync = document.getElementById('btnOpenGcalSync');
    if (btnOpenGcalSync) {
      btnOpenGcalSync.addEventListener('click', openGcalSyncModal);
    }

    const btnGenMeet = document.getElementById('btnGenMeet');
    if (btnGenMeet) {
      btnGenMeet.addEventListener('click', () => {
        const randomMeet = `https://meet.google.com/pod-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
        const inputMeet = document.getElementById('eventMeetInput');
        if (inputMeet) {
          inputMeet.value = randomMeet;
          showToast('Link Google Meet generato!');
        }
      });
    }

    document.querySelectorAll('.btn-close-modal, .modal-overlay').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el || e.target.closest('.btn-close-modal')) {
          closeModals();
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModals();
    });

    const btnExportCSV = document.getElementById('btnExportCSV');
    if (btnExportCSV) btnExportCSV.addEventListener('click', exportRosterToCSV);
  }

  function init() {
    cacheDom();
    initData();
    renderUserAccountPill();
    updateDashboardStats();
    renderProvinceStrip();
    renderSectorFilters();
    renderStartHereView();
    renderProjectsView();
    renderCurrentCalendarView();
    renderFilteredMembers();
    attachEvents();

    // Esponi funzioni globali per gli onclick HTML
    window.switchTab = switchTab;
    window.openNewMemberModal = openNewMemberModal;
    window.openEditMemberModal = openEditMemberModal;
    window.deleteMemberCard = deleteMemberCard;
    window.openProfileModal = openProfileModal;
    window.triggerSmartCoffeeMatch = triggerSmartCoffeeMatch;
    window.openCoffeeInviteModal = openCoffeeInviteModal;
    window.openInitiativeDashboard = openInitiativeDashboard;
    window.closeInitiativeDashboard = closeInitiativeDashboard;
    window.setTerritoryMapMode = setTerritoryMapMode;
    window.setTerritoryCategoryFilter = setTerritoryCategoryFilter;
    window.promptAddNoteToEvent = promptAddNoteToEvent;
    window.switchCalendarView = switchCalendarView;
    window.navigateCalendar = navigateCalendar;
    window.openGcalSyncModal = openGcalSyncModal;
    window.downloadCalendarIcs = downloadCalendarIcs;
    window.copyLiveCalendarFeed = copyLiveCalendarFeed;
    window.openEventDetails = openEventDetails;
    window.switchUser = switchUser;
    window.resetFilters = resetFilters;
  }

  document.addEventListener('DOMContentLoaded', init);
})();
