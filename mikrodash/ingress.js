// Faz o app (que usa URLs absolutas "/...") funcionar sob o prefixo do ingress do HA.
(function () {
  var m = location.pathname.match(/^\/api\/hassio_ingress\/[^\/]+/);
  if (!m) return;
  var P = m[0];
  function fix(u) {
    if (typeof u !== 'string' || u.charAt(0) !== '/' || u.charAt(1) === '/') return u;
    return (u === P || u.indexOf(P + '/') === 0) ? u : P + u;
  }
  function fixAbs(u) {
    try {
      var a = new URL(u, location.href);
      if (a.host === location.host) a.pathname = fix(a.pathname);
      return a.href;
    } catch (e) { return u; }
  }
  // O roteador do app le location.pathname: mostra "/pagina" em vez do prefixo.
  window.__ingressFix = fix;
  history.replaceState(history.state, '', (location.pathname.slice(P.length) || '/') + location.search + location.hash);

  var f = window.fetch;
  window.fetch = function (i, o) {
    if (typeof i === 'string') i = fix(i);
    else if (i && i.url) { var u = fixAbs(i.url); if (u !== i.url) i = new Request(u, i); }
    return f.call(this, i, o);
  };
  var xo = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (mt, u) {
    arguments[1] = fix(String(u)); return xo.apply(this, arguments);
  };
  var W = window.WebSocket;
  window.WebSocket = function (u, p) { return p === undefined ? new W(fixAbs(String(u).replace(/^ws/, 'http')).replace(/^http/, 'ws')) : new W(fixAbs(String(u).replace(/^ws/, 'http')).replace(/^http/, 'ws'), p); };
  window.WebSocket.prototype = W.prototype;
  ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(function (k) { window.WebSocket[k] = W[k]; });
  var E = window.EventSource;
  if (E) window.EventSource = function (u, o) { return new E(fix(u), o); };
  var wo = window.open;
  window.open = function (u) { arguments[0] = fix(u); return wo.apply(this, arguments); };

  var sa = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (n, v) {
    if (n === 'src' || n === 'href' || n === 'action') v = fix(String(v));
    return sa.call(this, n, v);
  };
  [[HTMLImageElement, 'src'], [HTMLScriptElement, 'src'], [HTMLLinkElement, 'href'],
   [HTMLAnchorElement, 'href'], [HTMLIFrameElement, 'src'], [HTMLFormElement, 'action']].forEach(function (x) {
    var d = Object.getOwnPropertyDescriptor(x[0].prototype, x[1]);
    if (!d || !d.set) return;
    Object.defineProperty(x[0].prototype, x[1], { get: d.get, configurable: true, enumerable: d.enumerable,
      set: function (v) { d.set.call(this, fix(String(v))); } });
  });
  // Links e forms gerados em runtime: corrige no clique/envio.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (a) { var h = a.getAttribute('href'); if (fix(h) !== h) sa.call(a, 'href', fix(h)); }
  }, true);
  document.addEventListener('submit', function (e) {
    var a = e.target.getAttribute && e.target.getAttribute('action');
    if (a && fix(a) !== a) sa.call(e.target, 'action', fix(a));
  }, true);
})();
