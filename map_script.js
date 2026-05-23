// ─────────────────────────────
// GEOFIELD Tactical Map
// ─────────────────────────────

const TARGET = { lng: 119.2910978305632, lat: -3.4007855763262413 };

// ─────────────────────────────
// CREATE MAP
// ─────────────────────────────

// Determine the initial map style based on the current theme
const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark';
const mapStyle = initialTheme === 'light' 
  ? 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' 
  : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const map = new maplibregl.Map({
  container: 'map',
  style:     mapStyle,
  center:    [121.0, -2.0],
  zoom:      5.4,
  pitch:     75,
  bearing:   -10,
  antialias: false
});

const mapCoords  = document.getElementById('coords');
const mapElement = document.getElementById('map');
const mapShell   = document.querySelector('.map-shell');
const subdistrictNameEl = document.getElementById('subdistrict-name');

const subdistrictFiles = [
  'assets/data/id7602010_tinambung.geojson',
  'assets/data/id7602011_balanipa.geojson',
  'assets/data/id7602012_limboro.geojson',
  'assets/data/id7602020_tubbi_taramanu.geojson',
  'assets/data/id7602021_alu.geojson',
  'assets/data/id7602030_campalagian.geojson',
  'assets/data/id7602031_luyo.geojson',
  'assets/data/id7602040_wonomulyo.geojson',
  'assets/data/id7602041_mapilli.geojson',
  'assets/data/id7602042_tapango.geojson',
  'assets/data/id7602043_matakali.geojson',
  'assets/data/id7602044_bulo.geojson',
  'assets/data/id7602050_polewali.geojson',
  'assets/data/id7602051_binuang.geojson',
  'assets/data/id7602052_anreapi.geojson',
  'assets/data/id7602061_matangnga.geojson'
];

const subdistrictLayerIds = [];
let subdistrictHoverBound = false;
let hoveredSubdistrictLayer = null;
let hoveredSubdistrictName = '';

function resetSubdistrictHover() {
  if (hoveredSubdistrictLayer) {
    map.setPaintProperty(hoveredSubdistrictLayer, 'fill-opacity', 0);
    map.setPaintProperty(`${hoveredSubdistrictLayer}-outline`, 'line-width', 0);
    hoveredSubdistrictLayer = null;
  }

  hoveredSubdistrictName = '';

  if (subdistrictNameEl) {
    subdistrictNameEl.textContent = '—';
  }

  mapElement.style.cursor = 'default';
}

function loadSubdistrictGeojson() {
  if (!subdistrictNameEl) return;

  subdistrictFiles.forEach((file, index) => {
    const sourceId = `subdistrict-${index}`;
    const fillId = `${sourceId}-fill`;
    const outlineId = `${fillId}-outline`;

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: file
      });
    }

    if (!map.getLayer(fillId)) {
      map.addLayer({
        id: fillId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': '#a0a0a0',
          'fill-opacity': 0
        }
      });
    }

    if (!map.getLayer(outlineId)) {
      map.addLayer({
        id: outlineId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': 'rgba(245, 232, 52, 0.51)',
          'line-width': 0,
          'line-opacity': 1
        }
      });
    }

    if (!subdistrictLayerIds.includes(fillId)) {
      subdistrictLayerIds.push(fillId);
    }
  });

  if (subdistrictHoverBound) {
    return;
  }

  map.on('mousemove', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: subdistrictLayerIds
    });

    if (!features.length) {
      resetSubdistrictHover();
      return;
    }

    const feature = features[0];
    const layerId = feature.layer.id;
    const districtName = feature.properties?.district || feature.properties?.name || 'Unknown';

    if (layerId !== hoveredSubdistrictLayer) {
      if (hoveredSubdistrictLayer) {
        map.setPaintProperty(hoveredSubdistrictLayer, 'fill-opacity', 0);
        map.setPaintProperty(`${hoveredSubdistrictLayer}-outline`, 'line-width', 0);
      }

      hoveredSubdistrictLayer = layerId;
      map.setPaintProperty(layerId, 'fill-opacity', 0.08);
      map.setPaintProperty(`${layerId}-outline`, 'line-width', 1);
    }

    if (districtName !== hoveredSubdistrictName) {
      hoveredSubdistrictName = districtName;
      subdistrictNameEl.textContent = districtName.toUpperCase();
    }

    mapElement.style.cursor = 'pointer';
  });

  map.on('mouseleave', () => {
    resetSubdistrictHover();
  });

  subdistrictHoverBound = true;
}

map.on('style.load', () => {
  map.setProjection({ type: 'globe' });
  loadSubdistrictGeojson();
});

map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

// ─────────────────────────────
// CINEMATIC STARTUP
// ─────────────────────────────

map.on('load', () => {
  loadSubdistrictGeojson();

  setTimeout(() => {
    map.flyTo({
      center:    [TARGET.lng, TARGET.lat],
      zoom:      10.5,
      pitch:     0,
      bearing:   0,
      speed:     0.22,
      curve:     3.2,
      essential: true
    });
  }, 1200);
});

map.on('mousemove', (e) => {
  mapCoords.textContent =
    `LAT ${e.lngLat.lat.toFixed(5)} — LNG ${e.lngLat.lng.toFixed(5)}`;
});

mapShell.addEventListener('mouseleave', () => {
  mapCoords.textContent = 'LAT 0.00000 — LNG 0.00000';
});
// ─────────────────────────────
// MAP VIEW 3D RESPONSE — OPTIMIZED
// ─────────────────────────────

const BASE_PITCH   = 50;
const BASE_BEARING = -12;

const PITCH_MAX = 8;
const BEAR_MAX  = 6;

// smoother responsiveness
const CAMERA_LERP = 0.11;

// threshold before camera update
const CAMERA_EPSILON = 0.015;

let targetPitch   = 0;
let targetBearing = 0;

let currentPitch  = 0;
let currentBear   = 0;

let flyInDone     = false;
let flyInProgress = false;
let userDragging  = false;
let mouseOnMap    = false;
let is3DMode      = false;

// ─────────────────────────────
// STARTUP
// ─────────────────────────────

map.once('moveend', () => {
flyInDone = true;
});

// ─────────────────────────────
// USER INTERACTION TRACKING
// ─────────────────────────────

mapElement.addEventListener('mousedown', () => {
userDragging = true;
});

window.addEventListener('mouseup', () => {
userDragging = false;

currentPitch = map.getPitch();
currentBear  = map.getBearing();
});

map.on('moveend', () => {
currentPitch  = map.getPitch();
currentBear   = map.getBearing();
flyInProgress = false;
});

map.on('zoomstart', () => {
userDragging = true;
});

map.on('zoomend', () => {
userDragging = false;

currentPitch = map.getPitch();
currentBear  = map.getBearing();
});

// ─────────────────────────────
// LERP
// ─────────────────────────────

function lerpVal(a, b, t) {
return a + (b - a) * t;
}

// ─────────────────────────────
// REALTIME CAMERA LOOP
// OPTIMIZED:
// - jumpTo instead of easeTo
// - no animation stacking
// - no internal easing conflict
// - threshold updates
// ─────────────────────────────

function tick3D() {

const canAnimate =
flyInDone &&
!userDragging &&
!flyInProgress;

if (canAnimate) {


currentPitch = lerpVal(
  currentPitch,
  targetPitch,
  CAMERA_LERP
);

currentBear = lerpVal(
  currentBear,
  targetBearing,
  CAMERA_LERP
);

const pitchDelta =
  Math.abs(currentPitch - map.getPitch());

const bearDelta =
  Math.abs(currentBear - map.getBearing());

// only update if movement is meaningful
if (
  pitchDelta > CAMERA_EPSILON ||
  bearDelta  > CAMERA_EPSILON
) {

  // MUCH cheaper than easeTo for realtime motion
  map.jumpTo({
    pitch: currentPitch,
    bearing: currentBear
  });

}


}

requestAnimationFrame(tick3D);
}

tick3D();

// ─────────────────────────────
// MOUSE PARALLAX INPUT
// RAF THROTTLED
// ─────────────────────────────

let mouseRAF = null;

mapShell.addEventListener('mousemove', (e) => {

if (
!flyInDone ||
!is3DMode ||
flyInProgress
) return;

if (mouseRAF) return;

mouseRAF = requestAnimationFrame(() => {


const rect = mapShell.getBoundingClientRect();

const nx =
  ((e.clientX - rect.left) / rect.width - 0.5) * 2;

const ny =
  ((e.clientY - rect.top) / rect.height - 0.5) * 2;

targetPitch =
  BASE_PITCH + (ny * PITCH_MAX);

targetBearing =
  BASE_BEARING + (-nx * BEAR_MAX);

mouseRAF = null;


});

});

mapShell.addEventListener('mouseenter', () => {
mouseOnMap = true;
});

mapShell.addEventListener('mouseleave', () => {

mouseOnMap = false;

if (is3DMode) {


targetPitch   = BASE_PITCH;
targetBearing = BASE_BEARING;


}
});

// ─────────────────────────────
// 2D / 3D TOGGLE
// ─────────────────────────────

const viewToggle = document.getElementById('view-toggle');

function triggerInPlaceGlitch() {
  const glitchWorld = document.getElementById('world');
  const r      = document.querySelector('.glitch-r');
  const g      = document.querySelector('.glitch-g');
  const b      = document.querySelector('.glitch-b');
  const slices = document.querySelectorAll('.glitch-slice');

  glitchWorld.classList.remove('glitch-in');
  [r, g, b].forEach(el => el?.classList.remove('rgb-flicker'));
  slices.forEach(el => el?.classList.remove('slice-flicker'));

  void glitchWorld.offsetWidth;

  glitchWorld.classList.add('glitch-in');
  [r, g, b].forEach(el => el?.classList.add('rgb-flicker'));
  slices.forEach(el => el?.classList.add('slice-flicker'));
}

if (viewToggle) {
  // Initialize button text for 2D mode default
  viewToggle.querySelector('span').textContent = '3D MODE';

  viewToggle.addEventListener('click', () => {
    is3DMode = !is3DMode;
    triggerInPlaceGlitch();

    flyInProgress = true;

    if (is3DMode) {
      viewToggle.querySelector('span').textContent = '2D MODE';
      targetPitch   = BASE_PITCH;
      targetBearing = BASE_BEARING;
      map.easeTo({ pitch: BASE_PITCH, bearing: BASE_BEARING, duration: 800 });
    } else {
      viewToggle.querySelector('span').textContent = '3D MODE';
      targetPitch   = 0;
      targetBearing = 0;
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
    }
  });
}

// ─────────────────────────────
// MARKERS
// ─────────────────────────────

const markers = [];

function clearMarkers() {
  markers.forEach(m => m.remove());
  markers.length = 0;
}

function makeMarkerEl(loc) {
  const el = document.createElement('div');
  el.className = 'geo-marker';
  el.dataset.markerData = JSON.stringify(loc); // Store location data

  const dot = document.createElement('div');
  dot.className = 'geo-dot';
  el.appendChild(dot);

  const label = document.createElement('div');
  label.className = 'geo-label';
  label.innerHTML = `<strong>${loc.name}</strong><span>${loc.subtitle}</span>`;
  el.appendChild(label);

  return { el, label };
}

// ─────────────────────────────
// FILTER + FLY-IN TO FIT ALL MARKERS
// ─────────────────────────────

function renderCategory(category) {
  clearMarkers();
  const data = MAP_DATABASE[category] || [];
  if (!data.length) return;

  // Build bounds to encompass all markers in this category
  const bounds = new maplibregl.LngLatBounds();

  data.forEach(location => {
    const { el } = makeMarkerEl(location);

    const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([location.lng, location.lat])
      .addTo(map);

    // Add hover listeners for platform display
    el.addEventListener('mouseenter', (e) => {
      showMarkerPlatform(location, e);
    });

    el.addEventListener('mouseleave', () => {
      hideMarkerPlatform();
    });

    markers.push(marker);
    bounds.extend([location.lng, location.lat]);
  });

  // Fly to fit all markers — respects current 2D/3D mode
  flyInProgress = true;
  map.fitBounds(bounds, {
    padding:   { top: 120, bottom: 120, left: 180, right: 180 },
    pitch:     is3DMode ? BASE_PITCH : 0,
    bearing:   is3DMode ? BASE_BEARING : 0,
    maxZoom:   15,
    speed:     0.8,
    curve:     1.4,
    essential: true
  });
  // moveend will set flyInProgress = false and sync currentPitch/currentBear
}

// ─────────────────────────────
// MARKER CONNECTOR OVERLAY
// ─────────────────────────────

const connectorOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
connectorOverlay.id = 'connector-overlay';
connectorOverlay.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
connectorOverlay.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9998;
  overflow: visible;
`;
document.body.appendChild(connectorOverlay);

// ─────────────────────────────
// MARKER HOVER PLATFORM
// ─────────────────────────────

const platformElement = document.getElementById('marker-platform');
let platformHideTimeout = null;

function showMarkerPlatform(location, event) {
  // Clear any pending hide timeout
  if (platformHideTimeout) {
    clearTimeout(platformHideTimeout);
  }

  // Update platform content
  document.getElementById('platform-name').textContent = location.name;
  document.getElementById('platform-category').textContent = location.category || location.subtitle;
  document.getElementById('platform-lat').textContent = location.lat.toFixed(5);
  document.getElementById('platform-lng').textContent = location.lng.toFixed(5);
  
  // Set image with fallback
  const imageEl = document.getElementById('platform-image');
  if (location.image) {
    imageEl.src = location.image;
  } else {
    imageEl.alt = 'image not found';
    imageEl.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23222" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="24" fill="%23999" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E';
  }

  // Get marker element position and calculate platform position
  const markerEl = event.target.closest('.geo-marker');
  if (markerEl) {
    const rect = markerEl.getBoundingClientRect();
    const offsetX = 320; // Offset to the right
    const offsetY = 80; // Distance above the marker
    const platformX = rect.left + rect.width / 2 + offsetX;
    const platformY = rect.top - offsetY;
    const markerCenterX = rect.left + rect.width / 2;
    const markerCenterY = rect.top + rect.height / 2;
    const platformCardWidth = 280;
    const platformConnectorX = platformX - platformCardWidth / 2; // Top-left corner
    const platformConnectorY = platformY; // Top of platform

    // Set platform position
    platformElement.style.left = platformX + 'px';
    platformElement.style.top = platformY + 'px';

    // Draw connector line from marker to platform
    connectorOverlay.innerHTML = '';
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', markerCenterX);
    line.setAttribute('y1', markerCenterY);
    line.setAttribute('x2', platformConnectorX);
    line.setAttribute('y2', platformConnectorY);
    line.setAttribute('stroke', 'rgba(253, 219, 58, 0.8)');
    line.setAttribute('stroke-width', '0.4');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('class', 'connector-line');
    connectorOverlay.appendChild(line);
    requestAnimationFrame(() => line?.classList.add('visible'));
  }

  // Show platform with animation
  platformElement.classList.add('visible');
}

function hideMarkerPlatform() {
  // Add delay before hiding to allow smooth transition
  platformHideTimeout = setTimeout(() => {
    platformElement.classList.remove('visible');
    connectorOverlay.innerHTML = '';
  }, 100);
}

// Hide platform when mouse leaves the marker-platform area
platformElement.addEventListener('mouseleave', () => {
  hideMarkerPlatform();
});

platformElement.addEventListener('mouseenter', () => {
  if (platformHideTimeout) {
    clearTimeout(platformHideTimeout);
  }
});

// ─────────────────────────────
// FILTER BUTTONS
// ─────────────────────────────

const filters = document.querySelectorAll('.map-filter');

let mapMouseX = 0;
let mapMouseY = 0;

window.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  mapMouseX = (e.clientX - cx) / cx;
  mapMouseY = (e.clientY - cy) / cy;
});

let btnCurrentX = 0;
let btnCurrentY = 0;

function lerpBtn(a, b, t) { return a + (b - a) * t; }

function tickButtons() {
  btnCurrentX = lerpBtn(btnCurrentX, mapMouseY * 5, 0.06);
  btnCurrentY = lerpBtn(btnCurrentY, mapMouseX * 5, 0.06);

  filters.forEach(btn => {
    if (!btn.matches(':hover')) {
      const active = btn.classList.contains('active');
      btn.style.transform = `
        perspective(1200px)
        rotateX(${btnCurrentX * 0.6}deg)
        rotateY(${btnCurrentY * 0.6}deg)
        translateY(${active ? '-4px' : '0px'})
        translateZ(${active ? '24px' : '0px'})
        scale(${active ? '1.04' : '1'})
      `;
    }
  });

  requestAnimationFrame(tickButtons);
}

tickButtons();

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    const isAlreadyActive = btn.classList.contains('active');
    filters.forEach(b => {
      b.classList.remove('active');
      b.style.transform = '';
    });
    if (!isAlreadyActive) {
      btn.classList.add('active');
      renderCategory(btn.dataset.category);
    } else {
      clearMarkers();
    }
  });

  btn.addEventListener('mousemove', (e) => {
    const rect   = btn.getBoundingClientRect();
    const x      = e.offsetX - rect.width  / 2;
    const y      = e.offsetY - rect.height / 2;
    const active = btn.classList.contains('active');
    btn.style.transform = `
      perspective(1200px)
      rotateX(${-y / 10}deg)
      rotateY(${x  / 10}deg)
      translateY(${active ? '-4px' : '-1px'})
      translateZ(${active ? '24px' : '10px'})
      scale(${active ? '1.04' : '1'})
    `;
  });

  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

// ─────────────────────────────
// TACTICAL SEARCH SYSTEM
// ─────────────────────────────

const allLocations = [];
for (const category in MAP_DATABASE) {
  MAP_DATABASE[category].forEach(loc => {
    allLocations.push({ ...loc, category });
  });
}

const searchInput   = document.getElementById('map-search');
const searchResults = document.getElementById('search-results');

function engageLocation(loc) {
  filters.forEach(btn => btn.classList.remove('active'));
  clearMarkers();

  const { el, label } = makeMarkerEl(loc);

  // Force label visible on landing
  label.style.opacity   = '1';
  label.style.transform = 'translateX(0px)';

    const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
    .setLngLat([loc.lng, loc.lat])
    .addTo(map);

  markers.push(marker);

  // FIX: fly-in pitch/bearing respect current 2D/3D mode
  const landingPitch   = is3DMode ? 65        : 0;
  const landingBearing = is3DMode ? (Math.random() * 60) - 30 : 0;

  flyInProgress = true;
  map.flyTo({
    center:    [loc.lng, loc.lat],
    zoom:      16.5,
    pitch:     landingPitch,
    bearing:   landingBearing,
    speed:     1.4,
    curve:     1.2,
    essential: true
  });

  // Sync 3D targets so mouse hover orbits from correct landing angle
  targetPitch   = landingPitch;
  targetBearing = landingBearing;

  searchInput.value          = loc.name;
  searchResults.style.display = 'none';
  searchInput.blur();
}

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  searchResults.innerHTML = '';

  if (!query.length) { searchResults.style.display = 'none'; return; }

  const matches = allLocations.filter(loc =>
    loc.name.toLowerCase().includes(query) ||
    loc.subtitle.toLowerCase().includes(query)
  );

  if (matches.length) {
    searchResults.style.display = 'block';
    matches.forEach(loc => {
      const item = document.createElement('div');
      item.className = 'search-item';
      item.innerHTML = `
        <span class="search-item-title">${loc.name}</span>
        <span class="search-item-sub">// ${loc.category} : ${loc.subtitle}</span>
      `;
      item.addEventListener('mousedown', () => engageLocation(loc));
      searchResults.appendChild(item);
    });
  } else {
    searchResults.style.display = 'none';
  }
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const query = e.target.value.toLowerCase().trim();
    const match = allLocations.find(loc =>
      loc.name.toLowerCase().includes(query) ||
      loc.subtitle.toLowerCase().includes(query)
    );
    if (match) engageLocation(match);
  }
});

searchInput.addEventListener('blur',  () => { searchResults.style.display = 'none'; });
searchInput.addEventListener('focus', () => {
  if (searchInput.value.length && searchResults.children.length) {
    searchResults.style.display = 'block';
  }
});

// ─────────────────────────────
// MAP THEME SYNC
// ─────────────────────────────
const mapThemeToggleBtn = document.getElementById('theme-toggle');

if (mapThemeToggleBtn) {
  mapThemeToggleBtn.addEventListener('click', () => {
    // Add a tiny delay to allow main_script.js to update the data-theme attribute first
    setTimeout(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newStyle = currentTheme === 'light' 
        ? 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' 
        : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
        
      map.setStyle(newStyle);
    }, 10);
  });
}