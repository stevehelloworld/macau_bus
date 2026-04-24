// ==========================================
//  澳門發財巴互動地圖 — 主程式
// ==========================================
(function () {
  'use strict';

  // ─── Map Init ───
  const map = L.map('map', {
    center: [22.170, 113.555],
    zoom: 14,
    zoomControl: false,
    attributionControl: true,
  });

  L.control.zoom({ position: 'topright' }).addTo(map);

  // Dark tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://osm.org/copyright">OSM</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  // ─── State ───
  const markers = {};
  let activeRouteLines = [];
  let activeCardId = null;

  // ─── Helpers ───
  function getById(id) { return LOCATIONS.find(l => l.id === id); }

  /**
   * Get all connected location IDs for a given location (bidirectional).
   * - If the location has its own `routes` array → use those.
   * - Also scan ALL other locations: if any other location lists this id
   *   in its routes, include that location too (reverse lookup).
   * This makes hubs (airport, border gate, etc.) automatically show every
   * hotel/casino that connects to them.
   */
  function getConnectedIds(locId) {
    const loc = getById(locId);
    if (!loc) return [];

    const set = new Set();

    // Forward: this location's own declared routes
    (loc.routes || []).forEach(rid => set.add(rid));

    // Reverse: any other location that lists locId in its routes
    LOCATIONS.forEach(other => {
      if (other.id === locId) return;
      if ((other.routes || []).includes(locId)) {
        set.add(other.id);
      }
    });

    return Array.from(set);
  }

  function createIcon(loc) {
    return L.divIcon({
      className: '',
      html: `<div class="custom-marker ${loc.type}">
               <div class="marker-pulse"></div>
               ${loc.icon}
             </div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20],
    });
  }

  function popupContent(loc) {
    const connectedIds = getConnectedIds(loc.id);
    const routeTags = connectedIds.map(rid => {
      const r = getById(rid);
      return r ? `<span class="popup-route-tag">${r.icon} ${r.name}</span>` : '';
    }).join('');
    return `
      <div class="popup-title">${loc.icon} ${loc.name}</div>
      <div class="popup-en">${loc.nameEn}</div>
      <div class="popup-desc">${loc.desc}</div>
      ${loc.operator ? `<div style="font-size:11px;color:#8b95a5;margin-bottom:6px">營運：${loc.operator}</div>` : ''}
      ${connectedIds.length > 0 ? `<div style="font-size:11px;color:#c9a84c;margin-bottom:4px;font-weight:600">🔗 連通 ${connectedIds.length} 個站點</div>` : ''}
      ${routeTags ? `<div class="popup-routes">${routeTags}</div>` : ''}
    `;
  }

  // ─── Place Markers ───
  LOCATIONS.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lng], { icon: createIcon(loc) })
      .addTo(map)
      .bindPopup(popupContent(loc), { maxWidth: 320 });

    marker.on('click', () => {
      setActiveCard(loc.id);
      drawRoutes(loc.id);
    });

    markers[loc.id] = marker;
  });

  // ─── Sidebar: Render List ───
  const listEl = document.getElementById('location-list');
  const searchInput = document.getElementById('search-input');

  function renderList(filter = 'all', query = '') {
    listEl.innerHTML = '';
    const q = query.toLowerCase();
    const filtered = LOCATIONS.filter(loc => {
      if (filter !== 'all' && loc.type !== filter) return false;
      if (q && !loc.name.toLowerCase().includes(q) && !loc.nameEn.toLowerCase().includes(q) && !(loc.operator || '').toLowerCase().includes(q)) return false;
      return true;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = '<div style="padding:24px;text-align:center;color:var(--text-dim);font-size:13px;">找不到符合的結果 😢</div>';
      return;
    }

    filtered.forEach(loc => {
      const card = document.createElement('div');
      card.className = 'loc-card' + (activeCardId === loc.id ? ' active' : '');
      card.dataset.id = loc.id;

      const connectedCount = getConnectedIds(loc.id).length;
      const tagClass = loc.type;

      card.innerHTML = `
        <div class="card-header">
          <span class="card-icon">${loc.icon}</span>
          <div>
            <div class="card-title">${loc.name}</div>
            <div class="card-subtitle">${loc.nameEn}</div>
          </div>
        </div>
        <div class="card-tags">
          <span class="tag ${tagClass}">${loc.type === 'hub' ? '交通樞紐' : loc.type === 'peninsula' ? '澳門半島' : '路氹城'}</span>
          ${loc.operator ? `<span class="tag">${loc.operator}</span>` : ''}
          ${connectedCount > 0 ? `<span class="tag">🔗 ${connectedCount} 個站點</span>` : ''}
        </div>
      `;

      card.addEventListener('click', () => {
        setActiveCard(loc.id);
        drawRoutes(loc.id);
        map.flyTo([loc.lat, loc.lng], 15, { duration: 0.8 });
        markers[loc.id].openPopup();
        // On mobile close sidebar
        if (window.innerWidth <= 768) {
          document.getElementById('sidebar').classList.remove('open');
        }
      });

      listEl.appendChild(card);
    });
  }

  // ─── Active Card ───
  function setActiveCard(id) {
    activeCardId = id;
    document.querySelectorAll('.loc-card').forEach(c => {
      c.classList.toggle('active', c.dataset.id === id);
    });
    showRouteOverlay(id);
  }

  // ─── Route Overlay ───
  const routeOverlay = document.getElementById('route-overlay');
  const routeContent = document.getElementById('route-overlay-content');

  function showRouteOverlay(locId) {
    const loc = getById(locId);
    const connectedIds = getConnectedIds(locId);
    if (!loc || connectedIds.length === 0) {
      routeOverlay.classList.add('hidden');
      return;
    }

    const routeItems = connectedIds.map(rid => {
      const r = getById(rid);
      if (!r) return '';
      const dotColor = r.type === 'hub' ? '#e74c3c' : r.type === 'peninsula' ? '#f39c12' : '#9b59b6';
      const label = r.type === 'hub' ? '口岸' : '酒店';
      return `<div class="route-item">
        <span class="route-dot" style="background:${dotColor}"></span>
        <span class="route-name">${r.icon} ${r.name}</span>
        <span class="route-time">${label}</span>
      </div>`;
    }).join('');

    routeContent.innerHTML = `
      <h3>${loc.icon} ${loc.name}</h3>
      <div class="overlay-en">${loc.nameEn} ${loc.operator ? '· ' + loc.operator : ''}</div>
      <div style="font-size:12px;color:#c9a84c;margin-bottom:8px;">🔗 連通 ${connectedIds.length} 個站點（路線已在地圖上標示）</div>
      <div class="route-list">${routeItems}</div>
    `;
    routeOverlay.classList.remove('hidden');
  }

  document.getElementById('close-route-overlay').addEventListener('click', () => {
    routeOverlay.classList.add('hidden');
    clearRouteLines();
  });

  // ─── Draw Routes on Map ───
  function clearRouteLines() {
    activeRouteLines.forEach(l => map.removeLayer(l));
    activeRouteLines = [];
  }

  function drawRoutes(locId) {
    clearRouteLines();
    const loc = getById(locId);
    if (!loc) return;

    const connectedIds = getConnectedIds(locId);
    if (connectedIds.length === 0) return;

    const color = loc.routeColor || '#c9a84c';

    connectedIds.forEach(rid => {
      const target = getById(rid);
      if (!target) return;

      // Use a color based on the connection type for visual variety
      let lineColor = color;
      if (loc.type === 'hub') {
        // When clicking a hub, use each connected hotel's color
        lineColor = target.routeColor || '#c9a84c';
      }

      const line = L.polyline(
        [[loc.lat, loc.lng], [target.lat, target.lng]],
        {
          color: lineColor,
          weight: 3,
          opacity: 0.75,
          dashArray: '8 6',
          className: 'route-line',
        }
      ).addTo(map);

      // Add a tooltip on hover showing destination name
      line.bindTooltip(`${loc.name} ↔ ${target.name}`, {
        sticky: true,
        className: 'route-tooltip',
      });

      activeRouteLines.push(line);
    });

    // Fit bounds to show all routes
    const allPts = [[loc.lat, loc.lng], ...connectedIds.map(rid => {
      const t = getById(rid);
      return t ? [t.lat, t.lng] : null;
    }).filter(Boolean)];

    if (allPts.length > 1) {
      map.fitBounds(allPts, { padding: [80, 80], maxZoom: 15, duration: 0.8 });
    }
  }

  // Expose for any external usage
  window.__showRoutes = drawRoutes;

  // ─── Filters ───
  let currentFilter = 'all';
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderList(currentFilter, searchInput.value);
    });
  });

  // ─── Search ───
  searchInput.addEventListener('input', () => {
    renderList(currentFilter, searchInput.value);
  });

  // ─── Toggle Sidebar ───
  document.getElementById('btn-toggle-sidebar').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    setTimeout(() => map.invalidateSize(), 300);
  });

  // ─── Click map background to deselect ───
  map.on('click', () => {
    clearRouteLines();
    routeOverlay.classList.add('hidden');
    activeCardId = null;
    document.querySelectorAll('.loc-card').forEach(c => c.classList.remove('active'));
  });

  // ─── Init ───
  renderList();

})();
