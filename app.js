'use strict';
/* Rasid client: map + route lines + live buses + position sharing + route recorder. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var qs = new URLSearchParams(location.search);

  /* ---------- text (ru / tg are drafts: have a native speaker check them) ---------- */
  var T = {
    en: { routes: 'Routes', share: 'Share', rec: 'Record route', online: 'live', offline: 'connecting…', noRoutes: 'No routes yet. Record one in the "Record route" tab.',
      noBuses: 'no bus now', next: 'next', min: 'min', sec: 's', km: 'km', m: 'm', onTime: 'on time', late: 'late', early: 'early', slow: 'slower than planned', fast: 'faster than planned', unk: 'new bus',
      you: 'People on the bus', stops: 'stops', length: 'length', pick: 'Choose how to share', rider: 'I am waiting (only I see my location)', onbus: 'I am on a bus (optional)', driver: 'I drive', localOnly: 'Your location stays on this phone. Nothing is sent.',
      route: 'Route', type: 'Vehicle', bus: 'Bus', trolley: 'Trolleybus', mini: 'Minibus', start: 'Start sharing', stopShare: 'Stop sharing', code: 'Driver code',
      sharingNow: 'Sharing. A position goes out every', gps: 'Waiting for GPS…', lastSent: 'Last sent', offRoute: 'You are off the route line', tracked: 'Matched to the route',
      gpsDenied: 'Location is blocked. Allow it in the browser settings.', noGps: 'This browser has no location.', needRoute: 'Choose a route first.', sentFail: 'Could not reach the server',
      adminCode: 'Admin code', routeId: 'Route number (letters/digits, max 6)', routeName: 'Name', recStart: 'Start recording', recStop: 'Stop and save', addStop: 'Add stop here', stopName: 'Stop name',
      points: 'points', recHint: 'Ride the whole route once with this open. Add a stop at every stop. Then press save.', saved: 'Saved', hereStop: 'Stop', twoWay: 'Same line used both ways', speed: 'Planned speed km/h', delete: 'Delete this route', adminOff: 'Route editing is off on this server (no ADMIN_CODE).',
      arrivals: 'Arrivals at', buses: 'buses', passengers: 'phones', fromDriver: 'driver', now: 'now', ago: 'ago', watching: 'Phones sharing now' },
    ru: { routes: 'Маршруты', share: 'Поделиться', rec: 'Записать маршрут', online: 'онлайн', offline: 'подключение…', noRoutes: 'Маршрутов пока нет. Запишите маршрут во вкладке «Записать маршрут».',
      noBuses: 'автобусов нет', next: 'далее', min: 'мин', sec: 'с', km: 'км', m: 'м', onTime: 'по графику', late: 'опаздывает', early: 'раньше', slow: 'медленнее плана', fast: 'быстрее плана', unk: 'новый автобус',
      you: 'Людей в автобусе', stops: 'остановок', length: 'длина', pick: 'Как поделиться', rider: 'Только смотрю', onbus: 'Я в автобусе', driver: 'Я за рулём',
      route: 'Маршрут', type: 'Транспорт', bus: 'Автобус', trolley: 'Троллейбус', mini: 'Маршрутка', start: 'Начать', stopShare: 'Остановить', code: 'Код водителя',
      sharingNow: 'Передача включена. Позиция уходит каждые', gps: 'Ждём GPS…', lastSent: 'Отправлено', offRoute: 'Вы вне линии маршрута', tracked: 'Привязано к маршруту',
      gpsDenied: 'Геолокация заблокирована. Разрешите её в настройках браузера.', noGps: 'В этом браузере нет геолокации.', needRoute: 'Сначала выберите маршрут.', sentFail: 'Нет связи с сервером',
      adminCode: 'Код администратора', routeId: 'Номер маршрута (буквы/цифры, до 6)', routeName: 'Название', recStart: 'Начать запись', recStop: 'Остановить и сохранить', addStop: 'Остановка здесь', stopName: 'Название остановки',
      points: 'точек', recHint: 'Проедьте весь маршрут с открытой страницей. На каждой остановке нажимайте «Остановка здесь». Потом сохраните.', saved: 'Сохранено', hereStop: 'Остановка', twoWay: 'Одна линия в обе стороны', speed: 'Плановая скорость км/ч', delete: 'Удалить маршрут', adminOff: 'Редактирование выключено на сервере (нет ADMIN_CODE).',
      arrivals: 'Прибытие на', buses: 'автобусов', passengers: 'телефонов', fromDriver: 'водитель', now: 'сейчас', ago: 'назад', watching: 'Телефонов передают' },
    tg: { routes: 'Хатсайрҳо', share: 'Мубодила', rec: 'Сабти хатсайр', online: 'онлайн', offline: 'пайвастшавӣ…', noRoutes: 'Ҳоло хатсайр нест. Дар «Сабти хатсайр» сабт кунед.',
      noBuses: 'автобус нест', next: 'навбатӣ', min: 'дақ', sec: 'сон', km: 'км', m: 'м', onTime: 'сари вақт', late: 'дер мекунад', early: 'барвақт', slow: 'аз нақша суст', fast: 'аз нақша тез', unk: 'автобуси нав',
      you: 'Одамон дар автобус', stops: 'истгоҳ', length: 'дарозӣ', pick: 'Чӣ тавр мубодила', rider: 'Фақат мебинам', onbus: 'Ман дар автобус', driver: 'Ман ронанда',
      route: 'Хатсайр', type: 'Нақлиёт', bus: 'Автобус', trolley: 'Троллейбус', mini: 'Маршрутка', start: 'Оғоз', stopShare: 'Қатъ', code: 'Рамзи ронанда',
      sharingNow: 'Мубодила фаъол аст. Мавқеъ ҳар', gps: 'Интизори GPS…', lastSent: 'Фиристода шуд', offRoute: 'Шумо берун аз хатсайр ҳастед', tracked: 'Ба хатсайр пайваст шуд',
      gpsDenied: 'Ҷойгиршавӣ масдуд аст. Дар танзимоти браузер иҷозат диҳед.', noGps: 'Ин браузер ҷойгиршавӣ надорад.', needRoute: 'Аввал хатсайрро интихоб кунед.', sentFail: 'Сервер дастнорас аст',
      adminCode: 'Рамзи администратор', routeId: 'Рақами хатсайр (то 6 ҳарф/рақам)', routeName: 'Ном', recStart: 'Оғози сабт', recStop: 'Қатъ ва захира', addStop: 'Истгоҳ дар ин ҷо', stopName: 'Номи истгоҳ',
      points: 'нуқта', recHint: 'Тамоми хатсайрро бо саҳифаи кушода тай кунед. Дар ҳар истгоҳ тугмаро пахш кунед. Сипас захира кунед.', saved: 'Захира шуд', hereStop: 'Истгоҳ', twoWay: 'Як хат ба ду тараф', speed: 'Суръати нақшавӣ км/соат', delete: 'Хатсайрро нест кунед', adminOff: 'Таҳрир дар сервер хомӯш аст (ADMIN_CODE нест).',
      arrivals: 'Расидан ба', buses: 'автобус', passengers: 'телефон', fromDriver: 'ронанда', now: 'ҳоло', ago: 'пеш', watching: 'Телефонҳои фаъол' }
  };
  var lang = 'en';
  try { lang = localStorage.getItem('rasid.lang') || ((navigator.language || 'en').slice(0, 2) === 'ru' ? 'ru' : (navigator.language || '').slice(0, 2) === 'tg' ? 'tg' : 'en'); } catch (e) {}
  function t(k) { return (T[lang] && T[lang][k]) || T.en[k] || k; }

  /* ---------- state ---------- */
  var cfg = { pingMs: 60000, tiles: null, driverCodeRequired: false, adminEnabled: false };
  var routes = [], routeById = {}, state = { ts: 0, buses: [], loose: [], riders: [] }, stateAt = 0;
  var selected = null;            // route id selected in list
  var selectedStop = null;        // {route, stop}
  var layers = {}, busMarkers = {}, looseMarkers = {}, map, meMarker = null;
  var deviceId = (function () {
    try { var v = localStorage.getItem('rasid.id'); if (v && /^[A-Za-z0-9_-]{16,64}$/.test(v)) return v; } catch (e) {}
    var a = new Uint8Array(18); (window.crypto || window.msCrypto).getRandomValues(a);
    var id = btoa(String.fromCharCode.apply(null, a)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    try { localStorage.setItem('rasid.id', id); } catch (e) {}
    return id;
  })();
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }

  /* ---------- helpers ---------- */
  function fmtEta(sec) { if (sec == null) return '–'; if (sec < 45) return t('now'); return Math.max(1, Math.round(sec / 60)) + ' ' + t('min'); }
  function fmtDist(m) { return m >= 1000 ? (m / 1000).toFixed(1) + ' ' + t('km') : Math.round(m / 10) * 10 + ' ' + t('m'); }
  function statusText(b) {
    var d = b.delaySec, mins = d == null ? '' : ' ' + Math.max(1, Math.round(Math.abs(d) / 60)) + ' ' + t('min');
    if (b.status === 'late') return t('late') + mins;
    if (b.status === 'early') return t('early') + mins;
    if (b.status === 'slow') return t('slow');
    if (b.status === 'fast') return t('fast');
    if (b.status === 'ontime') return t('onTime');
    return t('unk');
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function el(html) { var d = document.createElement('div'); d.innerHTML = html; return d.firstElementChild; }
  function api(path, opt) { return fetch(path, opt).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw Object.assign(new Error(j.error || r.status), { status: r.status }); return j; }); }); }

  /* route geometry on the client, to move markers smoothly between updates */
  function prep(r) {
    var cum = [0];
    for (var i = 1; i < r.path.length; i++) cum.push(cum[i - 1] + dist(r.path[i - 1], r.path[i]));
    r._cum = cum;
  }
  function dist(a, b) {
    var R = 6371008.8, rad = Math.PI / 180, dLat = (b[0] - a[0]) * rad, dLng = (b[1] - a[1]) * rad;
    var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(x)));
  }
  function pointAt(r, s) {
    var cum = r._cum, total = cum[cum.length - 1];
    s = Math.max(0, Math.min(total, s));
    var lo = 0, hi = cum.length - 2;
    while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (cum[mid] <= s) lo = mid; else hi = mid - 1; }
    var seg = cum[lo + 1] - cum[lo], f = seg > 0 ? (s - cum[lo]) / seg : 0;
    return [r.path[lo][0] + (r.path[lo + 1][0] - r.path[lo][0]) * f, r.path[lo][1] + (r.path[lo + 1][1] - r.path[lo][1]) * f];
  }

  /* ---------- map ---------- */
  function initMap() {
    map = L.map('map', { zoomControl: false, attributionControl: true }).setView([38.5598, 68.787], 12);   // Dushanbe
    L.control.zoom({ position: 'topright' }).addTo(map);
    var tl = cfg.tiles || {};
    L.tileLayer(tl.url || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: tl.maxZoom || 19, attribution: tl.attribution || '© OpenStreetMap contributors' }).addTo(map);
  }

  function drawRoutes() {
    Object.keys(layers).forEach(function (k) { map.removeLayer(layers[k]); });
    layers = {};
    routes.forEach(function (r) {
      var g = L.layerGroup();
      var sel = selected === r.id;
      L.polyline(r.path, { color: '#0E1B16', weight: sel ? 9 : 7, opacity: 0.9 }).addTo(g);
      L.polyline(r.path, { color: r.color || '#F2A900', weight: sel ? 5 : 4, opacity: 1 }).addTo(g);
      r.stops.forEach(function (s) {
        var m = L.circleMarker([s.lat, s.lng], { radius: sel ? 7 : 5, color: '#0E1B16', weight: 2, fillColor: '#fff', fillOpacity: 1 });
        m.bindTooltip(esc(s.name) + ' · ' + fmtDist(s.s));
        m.on('click', function () { selectStop(r.id, s.id); });
        m.addTo(g);
      });
      g.addTo(map);
      layers[r.id] = g;
    });
  }

  function iconFor(b) {
    var r = routeById[b.route];
    var col = b.status === 'late' || b.status === 'slow' ? '#FF8A7E' : (r && r.color) || '#F2A900';
    return L.divIcon({ className: '', html: '<div class="busicon' + (b.stale ? ' stale' : '') + '" style="background:' + col + '">' + esc(b.route) + '</div>', iconSize: [34, 34], iconAnchor: [17, 17] });
  }
  function livePos(b) {
    var r = routeById[b.route];
    if (!r || !r._cum) return [b.lat, b.lng];
    var dt = Math.min(60, Math.max(0, (Date.now() - stateAt) / 1000));
    var s = b.sNow + b.dir * (b.vMove || 0) * dt;
    return pointAt(r, s);
  }
  function popupHtml(b) {
    var h = '<b>' + esc(b.name) + '</b><br><span class="st-' + b.status + '">' + esc(statusText(b)) + '</span>';
    h += '<br>' + t('you') + ': ' + b.count + (b.hasDriver ? ' · ' + t('fromDriver') : '');
    (b.etas || []).slice(0, 3).forEach(function (e) { h += '<br>' + esc(e.name) + ' — <b>' + fmtEta(e.etaSec) + '</b> (' + fmtDist(e.distM) + ')'; });
    return h;
  }
  function renderBuses() {
    var seen = {};
    state.buses.forEach(function (b) {
      seen[b.id] = 1;
      var m = busMarkers[b.id];
      if (!m) { m = busMarkers[b.id] = L.marker(livePos(b), { icon: iconFor(b), zIndexOffset: 500 }); m.addTo(map); }
      m.setIcon(iconFor(b)); m.bindPopup(popupHtml(b));
      m._bus = b;
    });
    Object.keys(busMarkers).forEach(function (id) { if (!seen[id]) { map.removeLayer(busMarkers[id]); delete busMarkers[id]; } });
    var seenL = {};
    state.loose.forEach(function (p) {
      seenL[p.id] = 1;
      if (!looseMarkers[p.id]) looseMarkers[p.id] = L.marker([p.lat, p.lng], { icon: L.divIcon({ className: '', html: '<div class="rider"></div>', iconSize: [10, 10] }) }).addTo(map);
      else looseMarkers[p.id].setLatLng([p.lat, p.lng]);
    });
    Object.keys(looseMarkers).forEach(function (id) { if (!seenL[id]) { map.removeLayer(looseMarkers[id]); delete looseMarkers[id]; } });
  }
  setInterval(function () { Object.keys(busMarkers).forEach(function (id) { var m = busMarkers[id]; if (m._bus) m.setLatLng(livePos(m._bus)); }); }, 1000);

  /* ---------- routes tab ---------- */
  function renderRoutes() {
    var p = $('paneRoutes');
    if (!routes.length) { p.innerHTML = '<div class="mut">' + esc(t('noRoutes')) + '</div>'; return; }
    var h = '';
    if (selectedStop) {
      var r0 = routeById[selectedStop.route], st = r0 && r0.stops.filter(function (s) { return s.id === selectedStop.stop; })[0];
      if (st) {
        h += '<h3>' + esc(t('arrivals')) + ' ' + esc(st.name) + ' <button class="btn ghost" id="closeStop" style="padding:3px 10px;float:right">×</button></h3>';
        var list = [];
        state.buses.forEach(function (b) { if (b.route !== r0.id) return; var e = (b.etas || []).filter(function (x) { return x.stop === st.id; })[0]; if (e) list.push({ b: b, e: e }); });
        list.sort(function (a, b) { return a.e.etaSec - b.e.etaSec; });
        if (!list.length) h += '<div class="mut">' + esc(t('noBuses')) + '</div>';
        list.forEach(function (x) {
          h += '<div class="card"><div class="t"><span class="chip" style="background:' + esc(r0.color) + '">' + esc(r0.id) + '</span><div><div class="st-' + x.b.status + '">' + esc(statusText(x.b)) + '</div><div class="sub">' + fmtDist(x.e.distM) + ' · ' + x.b.count + ' ' + t('passengers') + '</div></div><div class="eta">' + fmtEta(x.e.etaSec) + '</div></div></div>';
        });
        h += '<hr style="border-color:var(--line)">';
      }
    }
    routes.forEach(function (r) {
      var bs = state.buses.filter(function (b) { return b.route === r.id; });
      h += '<div class="card" data-route="' + esc(r.id) + '" style="cursor:pointer;' + (selected === r.id ? 'border-color:var(--accent)' : '') + '"><div class="t"><span class="chip" style="background:' + esc(r.color) + '">' + esc(r.id) + '</span><div><b>' + esc(r.name) + '</b><div class="sub">' + fmtDist(r.length) + ' · ' + r.stops.length + ' ' + t('stops') + ' · ' + bs.length + ' ' + t('buses') + '</div></div></div>';
      bs.forEach(function (b) {
        var nx = (b.etas || [])[0];
        h += '<div class="sub"><span class="st-' + b.status + '">● ' + esc(statusText(b)) + '</span>' + (nx ? ' · ' + t('next') + ': ' + esc(nx.name) + ' ' + fmtEta(nx.etaSec) : '') + '</div>';
      });
      h += '</div>';
    });
    p.innerHTML = h;
    var cs = $('closeStop'); if (cs) cs.onclick = function () { selectedStop = null; renderRoutes(); };
    Array.prototype.forEach.call(p.querySelectorAll('[data-route]'), function (n) { n.onclick = function () { selectRoute(n.getAttribute('data-route')); }; });
  }
  function selectRoute(id) {
    selected = selected === id ? null : id; selectedStop = null;
    drawRoutes(); renderRoutes();
    var r = routeById[id]; if (selected && r) map.fitBounds(L.polyline(r.path).getBounds(), { padding: [30, 30] });
  }
  function selectStop(rid, sid) { selectedStop = { route: rid, stop: sid }; renderRoutes(); $('paneRoutes').scrollTop = 0; setTab('routes'); }

  /* ---------- tabs ---------- */
  function setTab(name) {
    ['routes', 'share', 'rec'].forEach(function (k) { $('pane' + k[0].toUpperCase() + k.slice(1)).classList.toggle('on', k === name); document.querySelector('nav [data-tab="' + k + '"]').classList.toggle('on', k === name); });
  }
  function labels() {
    $('tabRoutes').textContent = t('routes'); $('tabShare').textContent = t('share'); $('tabRec').textContent = t('rec');
    $('lang').value = lang; setConn(conn);
  }

  /* ---------- sharing ---------- */
  var share = { mode: store('rasid.mode') || 'rider', route: store('rasid.route') || '', type: store('rasid.type') || 'bus', code: store('rasid.code') || '', on: false, watch: null, fix: null, timer: null, lastSent: 0, info: null, err: '', wake: null };
  var interval = qs.get('fast') ? 5000 : null;
  function renderShare() {
    var p = $('paneShare');
    if (share.on) {
      var h = '<h3>' + esc(t(share.mode)) + (share.route ? ' · ' + esc(share.route) : '') + '</h3>';
      h += '<div class="msg">' + (share.mode === 'rider' ? esc(t('localOnly')) : esc(t('sharingNow')) + ' ' + Math.round((interval || cfg.pingMs) / 1000) + ' ' + t('sec') + '.') + '</div>';
      h += '<div class="msg" id="shareStat">' + shareStat() + '</div>';
      if (share.err) h += '<div class="msg err">' + esc(share.err) + '</div>';
      h += '<div class="row"><button class="btn stop" id="shStop">' + esc(t('stopShare')) + '</button></div>';
      p.innerHTML = h; $('shStop').onclick = stopShare; return;
    }
    var h2 = '<h3>' + esc(t('pick')) + '</h3><div class="seg" id="modeSeg">';
    ['rider', 'onbus', 'driver'].forEach(function (m) { h2 += '<button data-m="' + m + '" class="' + (share.mode === m ? 'on' : '') + '">' + esc(t(m)) + '</button>'; });
    h2 += '</div>';
    if (share.mode !== 'rider') {
      h2 += '<label>' + esc(t('route')) + '</label><select id="shRoute"><option value="">–</option>';
      routes.forEach(function (r) { h2 += '<option value="' + esc(r.id) + '"' + (share.route === r.id ? ' selected' : '') + '>' + esc(r.id + ' · ' + r.name) + '</option>'; });
      h2 += '</select><label>' + esc(t('type')) + '</label><select id="shType">';
      ['bus', 'trolley', 'mini'].forEach(function (k) { h2 += '<option value="' + k + '"' + (share.type === k ? ' selected' : '') + '>' + esc(t(k)) + '</option>'; });
      h2 += '</select>';
      if (share.mode === 'driver' && cfg.driverCodeRequired) h2 += '<label>' + esc(t('code')) + '</label><input id="shCode" type="password" value="' + esc(share.code) + '">';
    }
    if (share.err) h2 += '<div class="msg err">' + esc(share.err) + '</div>';
    h2 += '<div class="row"><button class="btn" id="shStart">' + esc(t('start')) + '</button></div>';
    p.innerHTML = h2;
    Array.prototype.forEach.call(p.querySelectorAll('#modeSeg button'), function (b) { b.onclick = function () { share.mode = b.getAttribute('data-m'); store('rasid.mode', share.mode); share.err = ''; renderShare(); }; });
    var rs = $('shRoute'); if (rs) rs.onchange = function () { share.route = rs.value; store('rasid.route', share.route); };
    var ty = $('shType'); if (ty) ty.onchange = function () { share.type = ty.value; store('rasid.type', share.type); };
    var co = $('shCode'); if (co) co.oninput = function () { share.code = co.value; store('rasid.code', share.code); };
    $('shStart').onclick = startShare;
  }
  function shareStat() {
    var h = share.fix ? '' : esc(t('gps'));
    if (share.fix) h += 'GPS ±' + Math.round(share.fix.acc || 0) + ' ' + t('m');
    if (share.lastSent) h += ' · ' + esc(t('lastSent')) + ' ' + Math.round((Date.now() - share.lastSent) / 1000) + ' ' + t('sec') + ' ' + t('ago');
    if (share.info && share.mode !== 'rider') h += '<br>' + esc(share.info.offRoute || share.info.routeKnown === false ? t('offRoute') : t('tracked') + (share.info.progressM != null ? ' · ' + fmtDist(share.info.progressM) : ''));
    return h;
  }
  function startShare() {
    share.err = '';
    if (share.mode !== 'rider' && !share.route) { share.err = t('needRoute'); return renderShare(); }
    if (!navigator.geolocation) { share.err = t('noGps'); return renderShare(); }
    share.on = true; share.fix = null; renderShare();
    share.watch = navigator.geolocation.watchPosition(function (pos) {
      var first = !share.fix;
      share.fix = { lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy, speed: pos.coords.speed, ts: Date.now() };
      if (!meMarker) meMarker = L.marker([share.fix.lat, share.fix.lng], { icon: L.divIcon({ className: '', html: '<div class="me"></div>', iconSize: [16, 16] }), zIndexOffset: 900 }).addTo(map);
      else meMarker.setLatLng([share.fix.lat, share.fix.lng]);
      if (first) { send(); if (share.mode === 'rider') map.setView([share.fix.lat, share.fix.lng], Math.max(map.getZoom(), 15)); }
    }, function (err) {
      share.err = err.code === 1 ? t('gpsDenied') : String(err.message || err); stopShare(true);
    }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 30000 });
    share.timer = setInterval(send, interval || cfg.pingMs);
    try { if (navigator.wakeLock) navigator.wakeLock.request('screen').then(function (w) { share.wake = w; }, function () {}); } catch (e) {}
  }
  function stopShare(keepErr) {
    if (share.watch != null) navigator.geolocation.clearWatch(share.watch);
    clearInterval(share.timer); share.watch = share.timer = null;
    if (share.wake) { try { share.wake.release(); } catch (e) {} share.wake = null; }
    if (share.on) { try { navigator.sendBeacon ? navigator.sendBeacon('/api/leave', new Blob([JSON.stringify({ id: deviceId })], { type: 'application/json' })) : null; } catch (e) {} }
    share.on = false; share.info = null; share.lastSent = 0;
    if (meMarker) { map.removeLayer(meMarker); meMarker = null; }
    if (keepErr !== true) share.err = '';
    renderShare();
  }
  function send() {
    if (!share.fix || !share.on || share.mode === 'rider') return;   // waiting riders: location stays on this phone
    var body = { id: deviceId, mode: share.mode, lat: share.fix.lat, lng: share.fix.lng, acc: share.fix.acc, speed: share.fix.speed };
    if (share.mode !== 'rider') { body.route = share.route; body.type = share.type; if (share.mode === 'driver') body.code = share.code; }
    api('/api/ping', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(function (r) {
      share.lastSent = Date.now(); share.info = r; share.err = '';
    }).catch(function (e) { share.err = e.status === 403 ? 'Wrong driver code' : t('sentFail') + ': ' + e.message; if (e.status === 403) stopShare(true); });
  }
  setInterval(function () { var n = $('shareStat'); if (n && share.on) n.innerHTML = shareStat(); }, 1000);
  window.addEventListener('pagehide', function () { if (share.on) stopShare(); });

  /* ---------- recorder ---------- */
  var rec = { on: false, pts: [], stops: [], watch: null, last: null, code: store('rasid.admin') || '', id: '', name: '', type: 'bus', speed: '', twoWay: false, msg: '', err: '' };
  function renderRec() {
    var p = $('paneRec');
    if (!cfg.adminEnabled) { p.innerHTML = '<div class="msg">' + esc(t('adminOff')) + '</div>'; return; }
    var h = '<div class="mut">' + esc(t('recHint')) + '</div>';
    if (!rec.on) {
      h += '<label>' + esc(t('adminCode')) + '</label><input id="rcCode" type="password" value="' + esc(rec.code) + '">';
      h += '<label>' + esc(t('routeId')) + '</label><input id="rcId" maxlength="6" value="' + esc(rec.id) + '">';
      h += '<label>' + esc(t('routeName')) + '</label><input id="rcName" value="' + esc(rec.name) + '">';
      h += '<label>' + esc(t('type')) + '</label><select id="rcType">';
      ['bus', 'trolley', 'mini'].forEach(function (k) { h += '<option value="' + k + '"' + (rec.type === k ? ' selected' : '') + '>' + esc(t(k)) + '</option>'; });
      h += '</select><label>' + esc(t('speed')) + '</label><input id="rcSpeed" inputmode="decimal" value="' + esc(rec.speed) + '" placeholder="20">';
      h += '<label><input type="checkbox" id="rcTwo" style="width:auto"' + (rec.twoWay ? ' checked' : '') + '> ' + esc(t('twoWay')) + '</label>';
      if (rec.pts.length > 1) h += '<div class="msg">' + rec.pts.length + ' ' + t('points') + ' · ' + rec.stops.length + ' ' + t('stops') + '</div>';
      if (rec.msg) h += '<div class="msg">' + esc(rec.msg) + '</div>';
      if (rec.err) h += '<div class="msg err">' + esc(rec.err) + '</div>';
      h += '<div class="row"><button class="btn" id="rcStart">' + esc(t('recStart')) + '</button>' + (rec.pts.length > 1 ? '<button class="btn ghost" id="rcSave">' + esc(t('recStop')) + '</button>' : '') + '</div>';
      if (routes.length) h += '<label>' + esc(t('delete')) + '</label><div class="row"><select id="rcDel" style="flex:1">' + routes.map(function (r) { return '<option value="' + esc(r.id) + '">' + esc(r.id + ' · ' + r.name) + '</option>'; }).join('') + '</select><button class="btn ghost" id="rcDelBtn">' + esc(t('delete')) + '</button></div>';
    } else {
      h += '<div class="msg" id="rcStat"></div><label>' + esc(t('stopName')) + '</label><input id="rcStopName" placeholder="' + esc(t('hereStop')) + ' ' + (rec.stops.length + 1) + '">';
      h += '<div class="row"><button class="btn" id="rcAddStop">' + esc(t('addStop')) + '</button><button class="btn stop" id="rcStop">' + esc(t('recStop')) + '</button></div>';
    }
    p.innerHTML = h;
    var g = function (id) { return $(id); };
    if (!rec.on) {
      ['rcCode', 'rcId', 'rcName', 'rcSpeed'].forEach(function (id) { var n = g(id); if (n) n.oninput = function () { rec[{ rcCode: 'code', rcId: 'id', rcName: 'name', rcSpeed: 'speed' }[id]] = n.value; if (id === 'rcCode') store('rasid.admin', n.value); }; });
      g('rcType').onchange = function () { rec.type = g('rcType').value; };
      g('rcTwo').onchange = function () { rec.twoWay = g('rcTwo').checked; };
      g('rcStart').onclick = recStart;
      if (g('rcSave')) g('rcSave').onclick = recSave;
      if (g('rcDelBtn')) g('rcDelBtn').onclick = function () {
        api('/api/admin/route?id=' + encodeURIComponent(g('rcDel').value), { method: 'DELETE', headers: { 'X-Admin-Code': rec.code } }).then(function () { rec.msg = t('saved'); rec.err = ''; return loadRoutes(); }).catch(function (e) { rec.err = e.message; renderRec(); });
      };
    } else { g('rcAddStop').onclick = recAddStop; g('rcStop').onclick = recFinish; recStat(); }
  }
  function recStat() { var n = $('rcStat'); if (n) n.textContent = rec.pts.length + ' ' + t('points') + ' · ' + rec.stops.length + ' ' + t('stops') + (rec.last ? ' · GPS ±' + Math.round(rec.last.acc || 0) + ' ' + t('m') : ' · ' + t('gps')); }
  function recStart() {
    rec.err = rec.msg = '';
    if (!/^[A-Za-z0-9]{1,6}$/.test(rec.id)) { rec.err = t('routeId'); return renderRec(); }
    if (!navigator.geolocation) { rec.err = t('noGps'); return renderRec(); }
    rec.pts = []; rec.stops = []; rec.last = null; rec.on = true; renderRec();
    rec.watch = navigator.geolocation.watchPosition(function (pos) {
      var f = { lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy };
      rec.last = f;
      if (f.acc > 60) { recStat(); return; }
      var lp = rec.pts[rec.pts.length - 1];
      if (!lp || dist(lp, [f.lat, f.lng]) >= 8) rec.pts.push([Math.round(f.lat * 1e6) / 1e6, Math.round(f.lng * 1e6) / 1e6]);
      recStat();
    }, function (err) { rec.err = err.code === 1 ? t('gpsDenied') : String(err.message); recFinish(true); }, { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 });
  }
  function recAddStop() {
    if (!rec.last) return;
    var n = $('rcStopName');
    rec.stops.push({ name: (n && n.value) || (t('hereStop') + ' ' + (rec.stops.length + 1)), lat: rec.last.lat, lng: rec.last.lng });
    if (n) n.value = ''; recStat();
  }
  function recFinish(skip) {
    if (rec.watch != null) navigator.geolocation.clearWatch(rec.watch);
    rec.watch = null; rec.on = false; renderRec();
    if (skip !== true && rec.pts.length > 1) recSave();
  }
  function recSave() {
    var body = { id: rec.id, name: rec.name || ('Route ' + rec.id), type: rec.type, path: rec.pts, stops: rec.stops, twoWay: rec.twoWay };
    if (Number(rec.speed) > 0) body.plannedSpeedKmh = Number(rec.speed);
    api('/api/admin/route', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Admin-Code': rec.code }, body: JSON.stringify(body) }).then(function (r) {
      rec.msg = t('saved') + ': ' + r.id + ' · ' + fmtDist(r.lengthM) + ' · ' + r.stops + ' ' + t('stops'); rec.err = ''; rec.pts = []; rec.stops = [];
      return loadRoutes();
    }).catch(function (e) { rec.err = e.message; renderRec(); });
  }

  /* ---------- data ---------- */
  var conn = false;
  function setConn(on) { conn = on; $('conn').className = on ? 'on' : ''; $('connTxt').textContent = on ? t('online') : t('offline'); }
  function loadRoutes() {
    return api('/api/routes').then(function (list) {
      routes = list; routeById = {}; routes.forEach(function (r) { routeById[r.id] = r; prep(r); });
      drawRoutes(); renderRoutes(); renderShare(); renderRec(); renderBuses();
      if (!window._fitted && routes.length) { window._fitted = true; var b = L.latLngBounds([]); routes.forEach(function (r) { r.path.forEach(function (p) { b.extend(p); }); }); map.fitBounds(b, { padding: [30, 30] }); }
    });
  }
  function onState(s) { state = s; stateAt = Date.now(); renderBuses(); if (!rec.on && !share.on) renderRoutes(); else if ($('paneRoutes').classList.contains('on')) renderRoutes(); window.__rasid = { state: s, routes: routes }; }
  var lastRouteCount = -1;
  function connect() {
    var es = new EventSource('/api/stream');
    es.onopen = function () { setConn(true); };
    es.addEventListener('state', function (e) {
      setConn(true);
      var s = JSON.parse(e.data);
      onState(s);
    });
    es.onerror = function () { setConn(false); };
  }
  setInterval(function () {   // pick up routes added by someone else
    api('/api/routes').then(function (list) { var sig = list.map(function (r) { return r.id + ':' + r.length + ':' + r.stops.length; }).join(','); if (sig !== window._sig) { window._sig = sig; if (window._sigSet) loadRoutes(); window._sigSet = true; } }).catch(function () {});
  }, 30000);

  /* ---------- start ---------- */
  document.querySelector('nav').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setTab(b.getAttribute('data-tab')); });
  $('lang').onchange = function () { lang = $('lang').value; store('rasid.lang', lang); labels(); renderRoutes(); renderShare(); renderRec(); };
  api('/api/config').then(function (c) { cfg = c; }).catch(function () {}).then(function () {
    initMap(); labels();
    return loadRoutes();
  }).then(function () { connect(); }).catch(function (e) { $('paneRoutes').textContent = String(e.message || e); });
})();
