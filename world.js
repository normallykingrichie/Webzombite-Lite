/* Webzombite-Lite - Dunia 500 m x 500 m reruntuhan kota XKing.
   Digenerasi dari seed tetap & dioptimalkan (merge mesh gedung & jalan) agar aman untuk GPU & RAM. */
(function (WZ) {
  'use strict';

  WZ.HALF = 250;           /* area bermain: -250..250 di kedua sumbu = 500 m x 500 m */
  WZ.SPAWN_HALF = 262.5;   /* zombie muncul di batas luar 525 m x 525 m */

  function mulberry(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  WZ.createWorld = function (THREE, scene) {
    var R = mulberry(20261116);
    function rr(a, b) { return a + R() * (b - a); }
    function pick(a) { return a[(R() * a.length) | 0]; }

    var W = { half: WZ.HALF, ents: [], trees: [], rocks: [], piles: [], crates: [], furn: [], rects: [], roads: [], spawn: { x: -32, y: 0, z: 32 } };
    var ROADS = [-224, -160, -96, -32, 32, 96, 160, 224], RW = 10;
    W.roads = ROADS;

    /* ---------------- collider statis ---------------- */
    var CELL = 8, sgrid = new Map();
    function ck(cx, cz) { return (cx + 80) * 256 + (cz + 80); }
    function addBox(x0, x1, y0, y1, z0, z1) {
      var b = { x0: x0, x1: x1, y0: y0, y1: y1, z0: z0, z1: z1, on: true };
      for (var cx = Math.floor(x0 / CELL); cx <= Math.floor(x1 / CELL); cx++) {
        for (var cz = Math.floor(z0 / CELL); cz <= Math.floor(z1 / CELL); cz++) {
          var k = ck(cx, cz), l = sgrid.get(k);
          if (!l) { l = []; sgrid.set(k, l); }
          l.push(b);
        }
      }
      return b;
    }
    W.addBox = addBox;

    /* ---------------- voxel (blok buatan pemain) ---------------- */
    var vox = new Map();
    function vk(x, y, z) { return ((x + 300) * 1024 + (z + 300)) * 64 + y; }
    W.vkey = vk;
    var VMAX = 40;
    var info = { top: 0, bottom: 0, vox: null, box: null };
    W.hit = function (x0, x1, y0, y1, z0, z1) {
      var found = false; info.top = -1e9; info.bottom = 1e9; info.vox = null; info.box = null;
      var cx0 = Math.floor(x0 / CELL), cx1 = Math.floor(x1 / CELL), cz0 = Math.floor(z0 / CELL), cz1 = Math.floor(z1 / CELL), cx, cz, i, l, b;
      for (cx = cx0; cx <= cx1; cx++) for (cz = cz0; cz <= cz1; cz++) {
        l = sgrid.get(ck(cx, cz)); if (!l) continue;
        for (i = 0; i < l.length; i++) {
          b = l[i];
          if (b.on && x1 > b.x0 && x0 < b.x1 && y1 > b.y0 && y0 < b.y1 && z1 > b.z0 && z0 < b.z1) {
            found = true; if (b.y1 > info.top) info.top = b.y1; if (b.y0 < info.bottom) info.bottom = b.y0; info.box = b;
          }
        }
      }
      if (vox.size) {
        var ix0 = Math.floor(x0), ix1 = Math.ceil(x1) - 1, iy0 = Math.max(0, Math.floor(y0)), iy1 = Math.ceil(y1) - 1, iz0 = Math.floor(z0), iz1 = Math.ceil(z1) - 1, ix, iy, iz, key;
        for (ix = ix0; ix <= ix1; ix++) for (iz = iz0; iz <= iz1; iz++) for (iy = iy0; iy <= iy1; iy++) {
          key = vk(ix, iy, iz);
          if (vox.has(key)) { found = true; if (iy + 1 > info.top) info.top = iy + 1; if (iy < info.bottom) info.bottom = iy; info.vox = key; }
        }
      }
      return found ? info : null;
    };
    W.solidAt = function (x, y, z) {
      var cx = Math.floor(x / CELL), cz = Math.floor(z / CELL), l = sgrid.get(ck(cx, cz)), i, b;
      if (l) for (i = 0; i < l.length; i++) { b = l[i]; if (b.on && x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1 && z > b.z0 && z < b.z1) return 'static'; }
      if (y >= 0 && vox.size) { var key = vk(Math.floor(x), Math.floor(y), Math.floor(z)); if (vox.has(key)) return key; }
      return null;
    };

    /* ---------------- helper InstancedMesh (kapasitas & usage aman) ---------------- */
    var Mx = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new THREE.Vector3(), S = new THREE.Vector3(), C = new THREE.Color(), UP = new THREE.Vector3(0, 1, 0);
    function inst(geo, mat, cap, isDynamic) {
      var m = new THREE.InstancedMesh(geo, mat, cap);
      m.count = 0;
      m.frustumCulled = false;
      var usage = isDynamic ? THREE.DynamicDrawUsage : THREE.StaticDrawUsage;
      if (m.instanceMatrix && m.instanceMatrix.setUsage) m.instanceMatrix.setUsage(usage);
      m.setColorAt(0, C.set(0xffffff));
      if (m.instanceColor) {
        m.instanceColor.array.fill(1);
        if (m.instanceColor.setUsage) m.instanceColor.setUsage(usage);
      }
      scene.add(m);
      return m;
    }
    function put(m, x, y, z, sx, sy, sz, ry, col, at) {
      var cap = m.instanceMatrix.count;
      var i = at == null ? m.count : at;
      if (i >= cap) return cap - 1;
      if (at == null) m.count++;
      P.set(x, y, z); S.set(sx, sy, sz); Q.setFromAxisAngle(UP, ry || 0); Mx.compose(P, Q, S);
      m.setMatrixAt(i, Mx);
      if (col != null) m.setColorAt(i, C.set(col));
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
      return i;
    }
    W.put = put;
    var box1 = new THREE.BoxGeometry(1, 1, 1);
    var boxB = new THREE.BoxGeometry(1, 1, 1); boxB.translate(0, 0.5, 0);
    function lam(c, o) { var p = { color: c }; for (var k in (o || {})) p[k] = o[k]; return new THREE.MeshLambertMaterial(p); }

    /* ---------------- tekstur prosedural hemat VRAM ---------------- */
    function setTexColorSpace(t) {
      if ('SRGBColorSpace' in THREE) t.colorSpace = THREE.SRGBColorSpace;
      else if ('sRGBEncoding' in THREE) t.encoding = THREE.sRGBEncoding;
    }
    function canvasTex(w, h, draw) {
      var c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
      var t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = 1;
      setTexColorSpace(t);
      return t;
    }
    function facadeTex(base, seed) {
      var r = mulberry(seed);
      return canvasTex(128, 128, function (g, w, h) {
        g.fillStyle = base; g.fillRect(0, 0, w, h);
        for (var i = 0; i < 200; i++) { g.fillStyle = 'rgba(0,0,0,' + (r() * 0.07) + ')'; g.fillRect(r() * w, r() * h, 2 + r() * 14, 2 + r() * 10); }
        for (var fy = 0; fy < 2; fy++) for (var fx = 0; fx < 2; fx++) {
          var x = fx * 64 + 14, y = fy * 64 + 10, k = r();
          g.fillStyle = k < 0.18 ? '#4a3a2c' : k < 0.3 ? '#1d252b' : '#26323b';
          g.fillRect(x, y, 36, 44);
          if (k < 0.18) {
            g.strokeStyle = '#2a1f17'; g.lineWidth = 3;
            for (var j = 0; j < 4; j++) { g.beginPath(); g.moveTo(x, y + j * 12 + 4); g.lineTo(x + 36, y + j * 12 + 10); g.stroke(); }
          } else if (k > 0.65) {
            g.strokeStyle = 'rgba(210,225,235,.55)'; g.lineWidth = 1.2;
            g.beginPath(); g.moveTo(x + 6, y); g.lineTo(x + 22, y + 24); g.lineTo(x + 36, y + 14); g.moveTo(x + 22, y + 24); g.lineTo(x + 12, y + 44); g.stroke();
          }
          g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x, y + 40, 36, 4);
        }
        var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(30,22,10,.28)');
        g.fillStyle = gr; g.fillRect(0, 0, w, h);
      });
    }
    var FACADE_MATS = [['#8d8a82', 11], ['#9a9184', 12], ['#7b8187', 13], ['#8f7f72', 14], ['#6f7679', 15], ['#a39b8c', 16]]
      .map(function (a) { return lam(0xffffff, { map: facadeTex(a[0], a[1]) }); });

    var groundTex = canvasTex(256, 256, function (g, w, h) {
      var r = mulberry(5); g.fillStyle = '#5b5a44'; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 2000; i++) { var v = (r() * 40) | 0; g.fillStyle = 'rgba(' + (60 + v) + ',' + (62 + v) + ',' + (40 + v / 2) + ',.55)'; g.fillRect(r() * w, r() * h, 1 + r() * 4, 1 + r() * 4); }
    });
    groundTex.repeat.set(120, 120);

    var roadTex = canvasTex(128, 128, function (g, w, h) {
      var r = mulberry(6); g.fillStyle = '#34363a'; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 1000; i++) { var v = (r() * 30) | 0; g.fillStyle = 'rgba(' + (50 + v) + ',' + (52 + v) + ',' + (56 + v) + ',.6)'; g.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 3); }
      g.strokeStyle = 'rgba(15,15,15,.6)'; g.lineWidth = 1;
      for (var k = 0; k < 4; k++) { g.beginPath(); g.moveTo(r() * w, 0); g.lineTo(r() * w, h); g.stroke(); }
    });

    var plankTex = canvasTex(64, 64, function (g, w, h) {
      g.fillStyle = '#8a6238'; g.fillRect(0, 0, w, h); g.strokeStyle = '#5b3d1f'; g.lineWidth = 2;
      for (var y = 0; y < h; y += 16) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
      g.strokeStyle = 'rgba(0,0,0,.18)';
      for (var i = 0; i < 20; i++) { g.beginPath(); var yy = R() * h; g.moveTo(0, yy); g.lineTo(w, yy + 2); g.stroke(); }
    });
    var stoneTex = canvasTex(64, 64, function (g, w, h) {
      g.fillStyle = '#8b8f95'; g.fillRect(0, 0, w, h); g.strokeStyle = '#5f6368'; g.lineWidth = 2; g.strokeRect(1, 1, w - 2, h - 2);
      for (var i = 0; i < 120; i++) { var v = (R() * 50) | 0; g.fillStyle = 'rgba(' + (110 + v) + ',' + (112 + v) + ',' + (118 + v) + ',.5)'; g.fillRect(R() * w, R() * h, 3, 3); }
    });
    var furnTex = canvasTex(64, 64, function (g, w, h) {
      g.fillStyle = '#3a3633'; g.fillRect(0, 0, w, h); g.fillStyle = '#ff7a1a'; g.fillRect(18, 30, 28, 22); g.fillStyle = '#ffd36a'; g.fillRect(24, 38, 16, 10);
      g.strokeStyle = '#1b1917'; g.lineWidth = 3; g.strokeRect(2, 2, w - 4, h - 4);
    });

    /* ---------------- tanah & jalan (1 draw call untuk semua jalan) ---------------- */
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(1100, 1100), lam(0xffffff, { map: groundTex }));
    ground.rotation.x = -Math.PI / 2; scene.add(ground);

    (function buildMergedRoads() {
      var pos = [], norm = [], uv = [], idx = [];
      function pushQuad(v0, v1, v2, v3, uMax, vMax, swapUV) {
        var b = pos.length / 3;
        pos.push(v0[0], v0[1], v0[2], v1[0], v1[1], v1[2], v2[0], v2[1], v2[2], v3[0], v3[1], v3[2]);
        for (var i = 0; i < 4; i++) norm.push(0, 1, 0);
        if (swapUV) uv.push(0, 0, 0, uMax, vMax, uMax, vMax, 0);
        else uv.push(0, 0, uMax, 0, uMax, vMax, 0, vMax);
        idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
      }
      ROADS.forEach(function (c) {
        pushQuad([c - RW / 2, 0.02, 270], [c + RW / 2, 0.02, 270], [c + RW / 2, 0.02, -270], [c - RW / 2, 0.02, -270], 1, 54, false);
        pushQuad([-270, 0.022, c + RW / 2], [270, 0.022, c + RW / 2], [270, 0.022, c - RW / 2], [-270, 0.022, c - RW / 2], 1, 54, true);
      });
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeBoundingSphere();
      scene.add(new THREE.Mesh(g, lam(0xffffff, { map: roadTex })));
    })();

    var dashes = inst(boxB, lam(0xd9b640), 1400, false);
    ROADS.forEach(function (c) {
      for (var t = -255; t < 255; t += 7) {
        put(dashes, c, 0.03, t, 0.18, 0.01, 3.2, 0, null);
        put(dashes, t, 0.032, c, 3.2, 0.01, 0.18, 0, null);
      }
    });

    /* ---------------- helper penempatan ---------------- */
    var occupied = [];
    function onRoad(x, z, m) { for (var i = 0; i < ROADS.length; i++) if (Math.abs(x - ROADS[i]) < RW / 2 + m || Math.abs(z - ROADS[i]) < RW / 2 + m) return true; return false; }
    function inOcc(x, z, m) { for (var i = 0; i < occupied.length; i++) { var o = occupied[i]; if (x > o[0] - m && x < o[1] + m && z > o[2] - m && z < o[3] + m) return true; } return false; }
    function zoneOf(x, z) { var d = Math.hypot(x, z); return d < 105 ? 'down' : d < 190 ? 'mid' : 'out'; }

    /* ---------------- gedung tinggi digabung per tekstur (6 draw call + 1 atap) ---------------- */
    var walls = inst(box1, lam(0xffffff), 2500, false);
    var roofCols = [0x4a4743, 0x55504a, 0x3f4349];
    var facadeBuckets = FACADE_MATS.map(function () { return { pos: [], norm: [], uv: [], idx: [] }; });
    var roofBucket = { pos: [], norm: [], col: [], idx: [] };

    function pushQuadSide(bk, p0, p1, p2, p3, nx, ny, nz, uRep, vRep) {
      var b = bk.pos.length / 3;
      bk.pos.push(p0[0], p0[1], p0[2], p1[0], p1[1], p1[2], p2[0], p2[1], p2[2], p3[0], p3[1], p3[2]);
      for (var i = 0; i < 4; i++) bk.norm.push(nx, ny, nz);
      bk.uv.push(0, 0, uRep, 0, uRep, vRep, 0, vRep);
      bk.idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    }

    function tallBuilding(x0, x1, z0, z1, h) {
      var w = x1 - x0, d = z1 - z0, fi = (R() * FACADE_MATS.length) | 0, bk = facadeBuckets[fi];
      var uw = w / 8, ud = d / 8, vh = h / 8;
      pushQuadSide(bk, [x0, 0, z1], [x1, 0, z1], [x1, h, z1], [x0, h, z1], 0, 0, 1, uw, vh);
      pushQuadSide(bk, [x1, 0, z0], [x0, 0, z0], [x0, h, z0], [x1, h, z0], 0, 0, -1, uw, vh);
      pushQuadSide(bk, [x1, 0, z1], [x1, 0, z0], [x1, h, z0], [x1, h, z1], 1, 0, 0, ud, vh);
      pushQuadSide(bk, [x0, 0, z0], [x0, 0, z1], [x0, h, z1], [x0, h, z0], -1, 0, 0, ud, vh);

      var rc = new THREE.Color(pick(roofCols)), rb = roofBucket.pos.length / 3;
      roofBucket.pos.push(x0, h, z1, x1, h, z1, x1, h, z0, x0, h, z0);
      for (var i = 0; i < 4; i++) { roofBucket.norm.push(0, 1, 0); roofBucket.col.push(rc.r, rc.g, rc.b); }
      roofBucket.idx.push(rb, rb + 1, rb + 2, rb, rb + 2, rb + 3);

      addBox(x0, x1, 0, h, z0, z1);
      occupied.push([x0 - 1, x1 + 1, z0 - 1, z1 + 1]);
      W.rects.push({ x0: x0, x1: x1, z0: z0, z1: z1, c: '#555' });
      if (R() < 0.6) { var bx = rr(x0 + 2, x1 - 2), bz = rr(z0 + 2, z1 - 2); put(walls, bx, h + 1, bz, 3, 2, 3, 0, 0x3b3f44); }
    }

    function wallSeg(x0, x1, z0, z1, y0, y1, col) {
      put(walls, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, x1 - x0, y1 - y0, z1 - z0, 0, col);
      addBox(x0, x1, y0, y1, z0, z1);
    }

    var bedM = inst(box1, lam(0xffffff), 400, false), couchM = inst(box1, lam(0xffffff), 400, false);
    function addBed(x, z, clean) {
      put(bedM, x, 0.3, z, 2.0, 0.6, 1.0, 0, clean ? 0xd9d3c4 : 0x4a3d33);
      put(bedM, x - 0.9, 0.65, z, 0.18, 0.5, 1.0, 0, clean ? 0xb98a5a : 0x2e2620);
      addBox(x - 1.0, x + 1.0, 0, 0.6, z - 0.5, z + 0.5);
      var e = { k: 'bed', x: x, z: z, y: 0, r: 1.3, h: 0.8, clean: clean, alive: true };
      addEnt(e); return e;
    }
    function addCouch(x, z, clean) {
      put(couchM, x, 0.3, z, 1.9, 0.6, 0.9, 0, clean ? 0x6f8a62 : 0x3d342c);
      put(couchM, x, 0.75, z - 0.38, 1.9, 0.6, 0.2, 0, clean ? 0x55704a : 0x2a231d);
      addBox(x - 0.95, x + 0.95, 0, 0.6, z - 0.45, z + 0.45);
      var e = { k: 'couch', x: x, z: z, y: 0, r: 1.15, h: 0.9, clean: clean, alive: true };
      addEnt(e); return e;
    }

    function house(px, pz, face) {
      var hw = rr(12, 15), hd = rr(10, 12), x0 = px - hw / 2, x1 = px + hw / 2, z0 = pz - hd / 2, z1 = pz + hd / 2, t = 0.4, H = 3.2;
      var col = pick([0xb7ab97, 0xa59a88, 0x9c8f86, 0xbdb4a2, 0x93897c]);
      occupied.push([x0 - 1, x1 + 1, z0 - 1, z1 + 1]);
      W.rects.push({ x0: x0, x1: x1, z0: z0, z1: z1, c: '#7a6f60' });
      var dx = (x0 + x1) / 2 + rr(-hw / 4, hw / 4), dz = (z0 + z1) / 2 + rr(-hd / 4, hd / 4), gap = 1.0;
      [[z0, 'n'], [z1, 's']].forEach(function (s) {
        if (face === s[1]) {
          wallSeg(x0, dx - gap, s[0] - t / 2, s[0] + t / 2, 0, H, col);
          wallSeg(dx + gap, x1, s[0] - t / 2, s[0] + t / 2, 0, H, col);
          wallSeg(dx - gap, dx + gap, s[0] - t / 2, s[0] + t / 2, 2.4, H, col);
        } else {
          wallSeg(x0, x1, s[0] - t / 2, s[0] + t / 2, 0, H, col);
        }
      });
      [[x0, 'w'], [x1, 'e']].forEach(function (s) {
        if (face === s[1]) {
          wallSeg(s[0] - t / 2, s[0] + t / 2, z0 + t / 2, dz - gap, 0, H, col);
          wallSeg(s[0] - t / 2, s[0] + t / 2, dz + gap, z1 - t / 2, 0, H, col);
          wallSeg(s[0] - t / 2, s[0] + t / 2, dz - gap, dz + gap, 2.4, H, col);
        } else {
          wallSeg(s[0] - t / 2, s[0] + t / 2, z0 + t / 2, z1 - t / 2, 0, H, col);
        }
      });
      wallSeg(x0, x1, z0, z1, H, H + 0.4, 0x4a4540);
      var cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, back = face === 'n' ? 1 : face === 's' ? -1 : 0, backx = face === 'w' ? 1 : face === 'e' ? -1 : 0;
      var bx = cx + (backx ? backx * (hw / 2 - 1.6) : -hw / 4), bz = cz + (back ? back * (hd / 2 - 1.2) : -hd / 4);
      addBed(bx, bz, R() < 0.5);
      var kx = cx + (backx ? backx * (hw / 2 - 1.2) : hw / 4), kz = cz + (back ? back * (hd / 2 - 1.2) : hd / 4) + (backx ? 3 : 0);
      if (backx || back) addCouch(kx + (backx ? 0 : 1), kz, R() < 0.5);
      if (R() < 0.6) {
        var crx = cx + rr(-hw / 4, hw / 4), crz = cz + rr(-hd / 5, hd / 5);
        if (Math.hypot(crx - bx, crz - bz) > 1.8) addCrate(crx, crz);
      }
    }

    /* ---------------- entitas yang dapat berinteraksi ---------------- */
    var egrid = new Map();
    function addEnt(e) {
      W.ents.push(e);
      var k = ck(Math.floor(e.x / CELL), Math.floor(e.z / CELL)), l = egrid.get(k);
      if (!l) { l = []; egrid.set(k, l); }
      l.push(e);
    }
    W.entsNear = function (x, z, rad, out) {
      out.length = 0;
      for (var cx = Math.floor((x - rad) / CELL); cx <= Math.floor((x + rad) / CELL); cx++) {
        for (var cz = Math.floor((z - rad) / CELL); cz <= Math.floor((z + rad) / CELL); cz++) {
          var l = egrid.get(ck(cx, cz)); if (!l) continue;
          for (var i = 0; i < l.length; i++) {
            var e = l[i];
            if (e.alive && Math.hypot(e.x - x, e.z - z) < rad + e.r) out.push(e);
          }
        }
      }
      return out;
    };

    /* pohon */
    var trunkG = new THREE.CylinderGeometry(0.22, 0.34, 1, 7); trunkG.translate(0, 0.5, 0);
    var crownG = new THREE.ConeGeometry(1, 1, 8); crownG.translate(0, 0.5, 0);
    var trunkM = inst(trunkG, lam(0x5b4128), 650, true), crownM = inst(crownG, lam(0xffffff), 650, true);
    function treeMatrix(t, on) {
      if (!on) {
        put(trunkM, 0, -50, 0, 0.0001, 0.0001, 0.0001, 0, null, t.ix);
        put(crownM, 0, -50, 0, 0.0001, 0.0001, 0.0001, 0, null, t.ix);
        return;
      }
      put(trunkM, t.x, 0, t.z, 1.2 * t.s, t.th, 1.2 * t.s, t.ry, null, t.ix);
      put(crownM, t.x, t.th * 0.62, t.z, 2.6 * t.s, 3.4 * t.s, 2.6 * t.s, t.ry, t.cc, t.ix);
    }
    W.setTree = function (t, on) { treeMatrix(t, on); t.box.on = on; t.alive = on; };
    function addTree(x, z) {
      var s = Math.pow(R(), 1.6) * 1.5 + 0.7, th = 3.0 * s;
      var t = {
        k: 'tree', idx: W.trees.length, x: x, z: z, y: 0, s: s, th: th, ry: R() * 6.28, r: 0.55 * s + 0.15, h: th * 0.62 + 3.4 * s, alive: true,
        max: Math.round(34 * s * s), hp: 