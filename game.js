/* AWAL game.js - Webzombite-Lite */
(function () {
  'use strict';
  var WZ = window.WZ, ITEMS = WZ.ITEMS, ZDEF = WZ.ZOMBIES, ZTYPES = WZ.ZTYPE_LIST, C = window.WZ_CONFIG || {};
  var Net = WZ.Net, THREE = window.THREE, MAX_PLAYERS = C.maxPlayers || 4;
  var SFX = WZ.Sound || { unlock: function () {}, play: function () {}, setNight: function () {}, toggleMute: function () { return false; }, isMuted: function () { return false; } };
  var DAY_LEN = 480, START_HOUR = 7;

  function $(s) { return document.querySelector(s); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function rnd() { return Math.random(); }
  function r2(v) { return Math.round(v * 100) / 100; }
  function fmtTime(s) { s = Math.floor(s); var m = Math.floor(s / 60); return m + ':' + (s % 60 < 10 ? '0' : '') + (s % 60); }
  function clockInfo(t) {
    var tot = START_HOUR + (t / DAY_LEN) * 24, day = Math.floor(tot / 24) + 1, h = ((tot % 24) + 24) % 24;
    var hh = Math.floor(h), mm = Math.floor((h - hh) * 60);
    var fase = h >= 5.5 && h < 10.5 ? 'Pagi' : h >= 10.5 && h < 15.5 ? 'Siang' : h >= 15.5 && h < 18.8 ? 'Sore' : 'Malam';
    return { day: day, hour: h, str: (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm, fase: fase, night: fase === 'Malam' };
  }

  var scene, camera, renderer, W, torch = null, torchOn = false, autoTorchDone = false;
  var P = { x: -32, y: 0, z: 32, vx: 0, vz: 0, vy: 0, yaw: 0, pitch: 0, onGround: false, hp: 100, hunger: 100, thirst: 100, energy: 100, comfort: 100 };
  var inv = {}, hot = [null, null, null, null, null, null, null, null], sel = 0;
  var T = 0, kills = 0, dead = false, rest = null, status = { poison: 0, stomach: 0 };
  var zombies = [], zMap = Object.create(null), nextZid = 1;
  var keys = {}, lmb = false, swingCd = 0, eatT = 0, spawnT = 3, stepT = 0, groanT = 4, voxVer = 0, cache = { ver: -1, list: [] };
  var mode = 'boot', selItem = null, lastHud = 0, respawnCheck = 0, fallbackLook = false, playerName = 'Penyintas';

  var mp = { role: 'solo', room: '', slot: 0, online: false, peers: Object.create(null), lastHostSeen: 0, lastPoseSent: