/* AWAL data.js - Webzombite-Lite */
window.WZ = window.WZ || {};
(function (WZ) {
  'use strict';

  var I = {};
  function item(id, ic, name, desc, extra) {
    var o = { id: id, ic: ic, name: name, desc: desc, type: 'material' };
    for (var k in (extra || {})) o[k] = extra[k];
    I[id] = o;
  }

  /* ---------- Bahan mentah dan rongsokan ---------- */
  item('wood', '🪵', 'Kayu', 'Kayu mentah dari pohon yang ditebang. Digunakan untuk blok kayu, tongkat, furnitur, dan tungku.');
  item('stone', '🪨', 'Batu', 'Ditambang dari bebatuan. Digunakan untuk blok batu dan tungku pelebur.');
  item('wood_sticks', '🥢', 'Tongkat Kayu', 'Tongkat kayu lurus. Pegangan dasar untuk perkakas dan rangka armor kayu.');
  item('gravel', '⚪', 'Kerikil', 'Batu-batu kecil yang keras. Cocok untuk membuat perkakas sederhana.');
  item('soil', '🟤', 'Tanah', 'Segenggam tanah. Belum berguna untuk saat ini.');
  item('broken_plastic_bottle', '🧴', 'Botol Plastik Rusak', 'Retak dan tidak bisa dipakai. Mungkin bisa didaur ulang suatu hari nanti.');
  item('dirty_plastic_bottle', '🧴', 'Botol Plastik Kotor', 'Perlu dibersihkan terlebih dahulu sebelum bisa menampung air.');
  item('dirty_box_food', '📦', 'Kotak Makanan Kotor', 'Kotak makanan bekas yang sudah kotor. Sebaiknya jangan dibuka.');
  item('broken_tin_can', '🥫', 'Kaleng Timah Penyok', 'Penyok, kosong, dan bagian pinggirnya tajam.');
  item('dirty_aluminium_foil', '🪙', 'Aluminium Foil Kotor', 'Kertas foil kusut dengan kilau samar di balik kotoran.');
  item('dirty_paper', '📄', 'Kertas Kotor', 'Kertas penuh noda. Tulisannya sudah hilang.');
  item('broken_leather_cloth', '🟫', 'Kain Kulit Sobek', 'Kulit robek. Mungkin masih bisa dimanfaatkan untuk sesuatu.');
  item('broken_fabric_cloth', '🧵', 'Kain Sobek', 'Kain robek yang kotor, berguna untuk membuat kasur, sofa, dan bantalan armor.');
  item('broken_floppy_drive', '💾', 'Floppy Disk Drive Rusak', 'Andai saja bisa main Pac-Man dari drive ini... benda apa pun di sini tetap lebih baik daripada tidak ada.', { note: 'Membutuhkan Meja Komputer untuk diperbaiki (segera hadir).' });
  item('iron_nugget', '🔩', 'Bongkahan Besi', 'Hmm, mungkin bisa dilebur agar lebih berguna meski ukurannya kecil?', { note: '20 bongkahan dilebur menjadi 1 Batang Besi di Tungku Pelebur.' });
  item('broken_copper_wire', '🪢', 'Kabel Tembaga Putus', 'Sepertinya kabel ini masih bisa menahan arus? Oh tidak, sudah putus...', { note: 'Tidak bisa diperbaiki. 50 kabel dilebur menjadi 1 Batang Tembaga di Tungku Pelebur.' });
  item('broken_cardboards', '📦', 'Kardus Rusak', 'Kardus pipih yang lembap.');
  item('broken_wood_planks', '🪵', 'Papan Kayu Patah', 'Papan kayu terbelah. Masih cukup kokoh untuk memukul.');
  item('iron_ingot', '🧱', 'Batang Besi', 'Sebatang besi murni. Dipakai untuk perkakas besi, wastafel, dan armor besi.');
  item('copper_ingot', '🟧', 'Batang Tembaga', 'Sebatang tembaga murni. Belum ada resep yang memakainya saat ini.');

  /* Draf Tier 3 (segera hadir) */
  item('broken_dvd_player', '📀', 'Pemutar DVD Rusak', 'Andai saja masih bisa memutar DVD kesukaanku...', { note: 'Tidak bisa diperbaiki. Bisa dibongkar menjadi komponen (segera hadir).' });
  item('broken_cd', '💿', 'CD Rusak', 'Yah... tidak bisa main video game lagi...');
  item('broken_dvd', '📀', 'DVD Rusak', 'Kepingan DVD yang tergores parah.');
  item('broken_old_tv', '📺', 'TV Tabung Rusak', 'Teknologi lama, tapi siapa tahu hari ini masih berguna untuk mencari berita tentang kiamat ini!');
  item('metal_casing', '🔲', 'Casing Logam', 'Casing logam sangat berguna untuk merakit teknologi di masa kiamat!');

  /* ---------- Makanan, minuman & medis ---------- */
  item('leftover_food', '🍲', 'Makanan Sisa', 'Ih... Makanan sisa ini masih bisa dimakan... setidaknya untuk bertahan di tengah kiamat...', { type: 'food', eat: { t: 2, h: 4, th: -2, poison: 0.30 } });
  item('contaminated_veg', '🥬', 'Sayuran Terkontaminasi', 'Mmm... apakah ini masih aman dimakan?', { type: 'food', eat: { t: 4, h: 6, th: 1, poison: 0.50 } });
  item('dirty_veg', '🥦', 'Sayuran Kotor', 'Aduh kotor sekali, bisa dicuci di Wastafel (Sink) menjadi Sayuran Segar!', { type: 'food', eat: { t: 4, h: 7, th: 2, stomach: 0.20 } });
  item('contaminated_fruits', '🍎', 'Buah Terkontaminasi', 'Mmm... apakah buah ini masih layak makan?', { type: 'food', eat: { t: 4, h: 6, th: 1, poison: 0.50 } });
  item('dirty_fruits', '🍐', 'Buah Kotor', 'Aduh kotor sekali, bisa dicuci di Wastafel (Sink) menjadi Buah Segar!', { type: 'food', eat: { t: 4, h: 7, th: 2, stomach: 0.20 } });
  item('fresh_veg', '🥗', 'Sayuran Segar', 'Sayuran yang sudah dicuci bersih di Wastafel. Sehat, aman, dan menyegarkan!', { type: 'food', eat: { t: 3, h: 12, th: 5, comfort: 5 } });
  item('fresh_fruits', '🍇', 'Buah Segar', 'Buah segar yang sudah dicuci bersih di Wastafel. Manis, sehat, dan meningkatkan kenyamanan!', { type: 'food', eat: { t: 3, h: 12, th: 6, comfort: 6 } });
  item('plastic_bottled_water', '💧', 'Air Botol Plastik', 'Belum disterilkan sepenuhnya, tapi cukup untuk memulihkan rasa hausmu!', { type: 'drink', eat: { t: 5, h: 0, th: 20, poison: 0.02 } });
  item('medical_bag', '🩹', 'Tas Medis', 'Perlengkapan P3K darurat. Tahan klik kiri 2,5 detik untuk memulihkan 30 Darah.', { type: 'med', eat: { t: 2.5, heal: 30 } });

  /* ---------- Perkakas dan senjata ---------- */
  item('rusty_axe', '🪓', 'Kapak Berkarat', 'Tua, tapi masih tajam untuk menebang kayu.', { type: 'tool', tool: 'axe', bd: 2, dmg: 6 });
  item('rusty_pickaxe', '⛏️', 'Beliung Berkarat', 'Tua, tapi masih kuat memecahkan batu.', { type: 'tool', tool: 'pick', bd: 2, dmg: 5 });
  item('crude_axe', '🪓', 'Kapak Sederhana', 'Buatan sendiri dan kasar. Menebang lebih cepat daripada kapak berkarat.', { type: 'tool', tool: 'axe', bd: 4, dmg: 9 });
  item('crude_pickaxe', '⛏️', 'Beliung Sederhana', 'Buatan sendiri dan kasar. Memecahkan batu lebih cepat.', { type: 'tool', tool: 'pick', bd: 4, dmg: 7 });
  item('iron_axe', '🪓', 'Kapak Besi', 'Kapak besi berkualitas. Pohon tumbang dengan sangat cepat.', { type: 'tool', tool: 'axe', bd: 8, dmg: 16 });
  item('iron_pickaxe', '⛏️', 'Beliung Besi', 'Beliung besi berkualitas. Batu dan bijih hancur dengan cepat.', { type: 'tool', tool: 'pick', bd: 8, dmg: 12 });
  item('wood_club', '🏏', 'Pentungan Kayu', 'Papan patah yang diikat rapat. Cukup keras untuk menghajar zombie.', { type: 'tool', tool: 'club', bd: 1, dmg: 14 });
  item('fists', '✊', 'Tangan Kosong', 'Masih lebih baik daripada tidak melawan sama sekali.', { type: 'tool', tool: 'fist', bd: 1, dmg: 4 });

  /* ---------- Armor Kayu & Armor Besi ---------- */
  item('wood_helmet', '🪖', 'Helm Kayu', 'Pelindung kepala dari kayu ringan. Buff: +3% Kecepatan, hemat Energi & Nyaman.', { type: 'armor', slot: 'head', tier: 'wood', def: 1 });
  item('wood_chest', '🦺', 'Baju Zirah Kayu', 'Pelindung dada dari kayu ringan. Buff: +3% Kecepatan, hemat Energi & Nyaman.', { type: 'armor', slot: 'chest', tier: 'wood', def: 1 });
  item('wood_legs', '👖', 'Pelindung Kaki Kayu', 'Pelindung kaki dari kayu ringan. Buff: +3% Kecepatan, hemat Energi & Nyaman.', { type: 'armor', slot: 'legs', tier: 'wood', def: 1 });
  item('wood_boots', '🥾', 'Sepatu Kayu', 'Sepatu kayu kokoh namun ringan. Buff: +3% Kecepatan, hemat Energi & Nyaman.', { type: 'armor', slot: 'boots', tier: 'wood', def: 1 });

  item('iron_helmet', '🪖', 'Helm Besi', 'Helm baja kuat. Buff: +5 Maks HP, +6% Damage Melee & tahan racun.', { type: 'armor', slot: 'head', tier: 'iron', def: 2 });
  item('iron_chest', '🛡️', 'Baju Zirah Besi', 'Pelindung dada besi tebal. Buff: +5 Maks HP, +6% Damage Melee & tahan racun.', { type: 'armor', slot: 'chest', tier: 'iron', def: 3 });
  item('iron_legs', '👖', 'Pelindung Kaki Besi', 'Pelindung kaki baja kokoh. Buff: +5 Maks HP, +6% Damage Melee & tahan racun.', { type: 'armor', slot: 'legs', tier: 'iron', def: 2 });
  item('iron_boots', '🥾', 'Sepatu Besi', 'Sepatu baja berat. Buff: +5 Maks HP, +6% Damage Melee & tahan racun.', { type: 'armor', slot: 'boots', tier: 'iron', def: 2 });

  /* ---------- Blok & Furnitur yang dapat dipasang & diambil lagi ---------- */
  item('wood_block', '🟫', 'Blok Kayu', 'Blok bangunan 1 m. Agak rapuh, tapi bahannya murah. Klik kanan untuk pasang.', { type: 'block', vox: 1, hp: 30 });
  item('stone_block', '⬜', 'Blok Batu', 'Blok bangunan 1 m. Jauh lebih kuat daripada blok kayu.', { type: 'block', vox: 2, hp: 90 });
  item('furnace', '🔥', 'Tungku Pelebur', 'Melebur bongkahan besi dan kabel menjadi batangan logam. Pasang lalu tekan E di dekatnya.', { type: 'block', vox: 3, hp: 80 });
  item('bed_block', '🛏️', 'Kasur Nyaman', 'Kasur bersih buatan sendiri. Bisa tidur dengan [E] dan dapat dibongkar kembali.', { type: 'block', vox: 4, hp: 50 });
  item('couch_block', '🛋️', 'Sofa Nyaman', 'Sofa bersih buatan sendiri untuk memulihkan Nyaman dengan [E]. Dapat dibongkar kembali.', { type: 'block', vox: 5, hp: 45 });
  item('sink_block', '🚰', 'Wastafel (Sink)', 'Mencuci Sayuran/Buah Kotor menjadi Segar secara gratis! Pasang lalu tekan [E].', { type: 'block', vox: 6, hp: 60 });

  /* ---------- Resep Crafting ---------- */
  var R = [
    { id: 'sticks', out: ['wood_sticks', 2], cost: { wood: 1 } },
    { id: 'gravel', out: ['gravel', 2], cost: { stone: 1 } },
    { id: 'wood_block', out: ['wood_block', 2], cost: { wood: 1 } },
    { id: 'stone_block', out: ['stone_block', 2], cost: { stone: 1 } },
    { id: 'crude_axe', out: ['crude_axe', 1], cost: { wood_sticks: 4, gravel: 2 } },
    { id: 'crude_pickaxe', out: ['crude_pickaxe', 1], cost: { wood_sticks: 4, gravel: 3 } },
    { id: 'wood_club', out: ['wood_club', 1], cost: { broken_wood_planks: 3, broken_cardboards: 2 } },
    { id: 'furnace', out: ['furnace', 1], cost: { stone: 20, wood: 6 } },
    { id: 'bed_block', out: ['bed_block', 1], cost: { wood: 6, broken_fabric_cloth: 2 } },
    { id: 'couch_block', out: ['couch_block', 1], cost: { wood: 5, broken_fabric_cloth: 2, broken_cardboards: 2 } },
    { id: 'sink_block', out: ['sink_block', 1], cost: { iron_ingot: 10, wood: 5 } },
    { id: 'iron_axe', out: ['iron_axe', 1], cost: { iron_ingot: 3, wood_sticks: 2 } },
    { id: 'iron_pickaxe', out: ['iron_pickaxe', 1], cost: { iron_ingot: 3, wood_sticks: 2 } },
    { id: 'wood_helmet', out: ['wood_helmet', 1], cost: { wood: 4, wood_sticks: 2 } },
    { id: 'wood_chest', out: ['wood_chest', 1], cost: { wood: 7, wood_sticks: 2 } },
    { id: 'wood_legs', out: ['wood_legs', 1], cost: { wood: 5, wood_sticks: 2 } },
    { id: 'wood_boots', out: ['wood_boots', 1], cost: { wood: 4, wood_sticks: 2 } },
    { id: 'iron_helmet', out: ['iron_helmet', 1], cost: { iron_ingot: 2 } },
    { id: 'iron_chest', out: ['iron_chest', 1], cost: { iron_ingot: 4 } },
    { id: 'iron_legs', out: ['iron_legs', 1], cost: { iron_ingot: 3 } },
    { id: 'iron_boots', out: ['iron_boots', 1], cost: { iron_ingot: 2 } },
    { id: 'melt_iron', out: ['iron_ingot', 1], cost: { iron_nugget: 20 }, furnace: true, label: 'Lebur Batang Besi' },
    { id: 'melt_copper', out: ['copper_ingot', 1], cost: { broken_copper_wire: 50 }, furnace: true, label: 'Lebur Batang Tembaga' },
    { id: 'wash_veg', out: ['fresh_veg', 1], cost: { dirty_veg: 1 }, sink: true, label: 'Cuci Sayuran Kotor → Segar' },
    { id: 'wash_fruits', out: ['fresh_fruits', 1], cost: { dirty_fruits: 1 }, sink: true, label: 'Cuci Buah Kotor → Segar' }
  ];

  /* ---------- Tabel Loot (total persen = 100) ---------- */
  var LOOT = {
    trash1: { name: 'Sampah (Tier 1)', rolls: 1, enabled: true, t: [['broken_plastic_bottle', 20], ['dirty_plastic_bottle', 20], ['dirty_box_food', 15], ['broken_tin_can', 10], ['leftover_food', 15], ['gravel', 15], ['soil', 5]] },
    trash2: { name: 'Sampah (Tier 2)', rolls: 1, enabled: true, t: [['dirty_aluminium_foil', 15], ['dirty_paper', 16], ['broken_leather_cloth', 5], ['broken_fabric_cloth', 10], ['gravel', 5], ['broken_floppy_drive', 1], ['iron_nugget', 7], ['broken_copper_wire', 7], ['broken_cardboards', 15], ['broken_wood_planks', 15], ['medical_bag', 4]] },
    trash3: { name: 'Sampah (Tier 3)', rolls: 1, enabled: false, t: [['broken_dvd_player', 2], ['broken_cd', 3], ['broken_dvd', 5], ['broken_old_tv', null]] },
    crate1: { name: 'Peti Kayu (Tier 1)', rolls: 3, enabled: true, t: [['contaminated_veg', 20], ['dirty_veg', 20], ['contaminated_fruits', 15], ['dirty_fruits', 15], ['plastic_bottled_water', 20], ['wood_sticks', 10]] },
    crate2: { name: 'Peti Kayu (Tier 2)', rolls: 3, enabled: true, t: [['medical_bag', 20], ['plastic_bottled_water', 20], ['fresh_veg', 15], ['fresh_fruits', 15], ['iron_nugget', 15], ['broken_fabric_cloth', 15]] }
  };

  /* ---------- Zombie ---------- */
  var Z = {
    walker:  { name: 'Pejalan',  hp: 80,  spd: 1.1, dmg: 5,  def: 0, tier: 1, scale: 1.0,  color: 0x6d7a5a, cd: 1.0, w: 40 },
    runner:  { name: 'Pelari',   hp: 50,  spd: 1.6, dmg: 5,  def: 0, tier: 1, scale: 0.92, color: 0x8a6a52, cd: 0.8, w: 22 },
    big:     { name: 'Raksasa',  hp: 150, spd: 0.8, dmg: 8,  def: 0, tier: 1, scale: 1.3,  color: 0x56654f, cd: 1.1, w: 12 },
    bomber:  { name: 'Peledak',  hp: 60,  spd: 1.2, dmg: 60, def: 0, tier: 1, scale: 1.05, color: 0x9a5a2a, cd: 0,   w: 10, splash: 4 },
    brute:   { name: 'Brutal',   hp: 275, spd: 0.5, dmg: 12, def: 0, tier: 2, scale: 1.55, color: 0x4a3f55, cd: 1.3, w: 6 },
    soldier: { name: 'Tentara',  hp: 100, spd: 1.0, dmg: 9,  def: 2, tier: 2, scale: 1.05, color: 0x3d5a3a, cd: 1.0, w: 8 }
  };

  WZ.ITEMS = I;
  WZ.RECIPES = R;
  WZ.LOOT = LOOT;
  WZ.ZOMBIES = Z;
  WZ.ZTYPE_LIST = ['walker', 'runner', 'big', 'bomber', 'brute', 'soldier'];
  WZ.rollLoot = function (key, rnd) {
    var t = LOOT[key].t, r = rnd() * 100, acc = 0;
    for (var i = 0; i < t.length; i++) {
      if (t[i][1] == null) continue;
      acc += t[i][1];
      if (r < acc) return t[i][0];
    }
    return t[0][0];
  };
})(window.WZ);
/* AKHIR data.js */