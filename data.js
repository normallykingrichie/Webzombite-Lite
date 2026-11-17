/* Webzombite-Lite - Data game: item, resep crafting, tabel loot, dan statistik zombie (Bahasa Indonesia). */
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
  item('wood', '🪵', 'Kayu', 'Kayu mentah dari pohon yang ditebang. Digunakan untuk blok kayu, tongkat, dan tungku.');
  item('stone', '🪨', 'Batu', 'Ditambang dari bebatuan. Digunakan untuk blok batu dan tungku pelebur.');
  item('wood_sticks', '🥢', 'Tongkat Kayu', 'Tongkat kayu lurus. Pegangan dasar untuk setiap perkakas.');
  item('gravel', '⚪', 'Kerikil', 'Batu-batu kecil yang keras. Cocok untuk membuat perkakas sederhana.');
  item('soil', '🟤', 'Tanah', 'Segenggam tanah. Belum berguna untuk saat ini.');
  item('broken_plastic_bottle', '🧴', 'Botol Plastik Rusak', 'Retak dan tidak bisa dipakai. Mungkin bisa didaur ulang suatu hari nanti.');
  item('dirty_plastic_bottle', '🧴', 'Botol Plastik Kotor', 'Perlu dibersihkan terlebih dahulu sebelum bisa menampung air.');
  item('dirty_box_food', '📦', 'Kotak Makanan Kotor', 'Kotak makanan bekas yang sudah kotor. Sebaiknya jangan dibuka.');
  item('broken_tin_can', '🥫', 'Kaleng Timah Penyok', 'Penyok, kosong, dan bagian pinggirnya tajam.');
  item('dirty_aluminium_foil', '🪙', 'Aluminium Foil Kotor', 'Kertas foil kusut dengan kilau samar di balik kotoran.');
  item('dirty_paper', '📄', 'Kertas Kotor', 'Kertas penuh noda. Tulisannya sudah hilang.');
  item('broken_leather_cloth', '🟫', 'Kain Kulit Sobek', 'Kulit robek. Mungkin masih bisa dimanfaatkan untuk sesuatu.');
  item('broken_fabric_cloth', '🧵', 'Kain Sobek', 'Kain robek yang kotor, tapi masih bisa dipakai sebagai lap.');
  item('broken_floppy_drive', '💾', 'Floppy Disk Drive Rusak', 'Andai saja bisa main Pac-Man dari drive ini... benda apa pun di sini tetap lebih baik daripada tidak ada.', { note: 'Membutuhkan Meja Komputer untuk diperbaiki (segera hadir).' });
  item('iron_nugget', '🔩', 'Bongkahan Besi', 'Hmm, mungkin bisa dilebur agar lebih berguna meski ukurannya kecil?', { note: '20 bongkahan dilebur menjadi 1 Batang Besi di Tungku Pelebur.' });
  item('broken_copper_wire', '🪢', 'Kabel Tembaga Putus', 'Sepertinya kabel ini masih bisa menahan arus? Oh tidak, sudah putus...', { note: 'Tidak bisa diperbaiki. 50 kabel dilebur menjadi 1 Batang Tembaga di Tungku Pelebur.' });
  item('broken_cardboards', '📦', 'Kardus Rusak', 'Kardus pipih yang lembap.');
  item('broken_wood_planks', '🪵', 'Papan Kayu Patah', 'Papan kayu terbelah. Masih cukup kokoh untuk memukul.');
  item('iron_ingot', '🧱', 'Batang Besi', 'Sebatang besi murni. Ini baru perlengkapan serius!');
  item('copper_ingot', '🟧', 'Batang Tembaga', 'Sebatang tembaga murni. Belum ada resep yang memakainya saat ini.');

  /* Draf Tier 3 (segera hadir) */
  item('broken_dvd_player', '📀', 'Pemutar DVD Rusak', 'Andai saja masih bisa memutar DVD kesukaanku...', { note: 'Tidak bisa diperbaiki. Bisa dibongkar menjadi komponen (segera hadir).' });
  item('broken_cd', '💿', 'CD Rusak', 'Yah... tidak bisa main video game lagi...');
  item('broken_dvd', '📀', 'DVD Rusak', 'Kepingan DVD yang tergores parah.');
  item('broken_old_tv', '📺', 'TV Tabung Rusak', 'Teknologi lama, tapi siapa tahu hari ini masih berguna untuk mencari berita tentang kiamat ini!');
  item('metal_casing', '🔲', 'Casing Logam', 'Casing logam sangat berguna untuk merakit teknologi di masa kiamat!');

  /* ---------- Makanan dan minuman ---------- */
  item('leftover_food', '🍲', 'Makanan Sisa', 'Ih... Makanan sisa ini masih bisa dimakan... setidaknya untuk bertahan di tengah kiamat...', { type: 'food', eat: { t: 2, h: 4, th: -2, poison: 0.30 } });
  item('contaminated_veg', '🥬', 'Sayuran Terkontaminasi', 'Mmm... apakah ini masih aman dimakan?', { type: 'food', eat: { t: 4, h: 6, th: 1, poison: 0.50 } });
  item('dirty_veg', '🥦', 'Sayuran Kotor', 'Aduh kotor sekali, tapi semoga masih ada vitaminnya...', { type: 'food', eat: { t: 4, h: 7, th: 2, stomach: 0.20 } });
  item('contaminated_fruits', '🍎', 'Buah Terkontaminasi', 'Mmm... apakah buah ini masih layak makan?', { type: 'food', eat: { t: 4, h: 6, th: 1, poison: 0.50 } });
  item('dirty_fruits', '🍐', 'Buah Kotor', 'Aduh kotor sekali, tapi semoga masih ada vitaminnya...', { type: 'food', eat: { t: 4, h: 7, th: 2, stomach: 0.20 } });
  item('plastic_bottled_water', '💧', 'Air Botol Plastik', 'Belum disterilkan sepenuhnya, tapi cukup untuk memulihkan rasa hausmu!', { type: 'drink', eat: { t: 5, h: 0, th: 20, poison: 0.02 } });

  /* ---------- Perkakas dan senjata ---------- */
  item('rusty_axe', '🪓', 'Kapak Berkarat', 'Tua, tapi masih tajam untuk menebang kayu.', { type: 'tool', tool: 'axe', bd: 2, dmg: 6 });
  item('rusty_pickaxe', '⛏️', 'Beliung Berkarat', 'Tua, tapi masih kuat memecahkan batu.', { type: 'tool', tool: 'pick', bd: 2, dmg: 5 });
  item('crude_axe', '🪓', 'Kapak Sederhana', 'Buatan sendiri dan kasar. Menebang lebih cepat daripada kapak berkarat.', { type: 'tool', tool: 'axe', bd: 4, dmg: 9 });
  item('crude_pickaxe', '⛏️', 'Beliung Sederhana', 'Buatan sendiri dan kasar. Memecahkan batu lebih cepat.', { type: 'tool', tool: 'pick', bd: 4, dmg: 7 });
  item('iron_axe', '🪓', 'Kapak Besi', 'Kapak besi berkualitas. Pohon tumbang dengan sangat cepat.', { type: 'tool', tool: 'axe', bd: 8, dmg: 16 });
  item('iron_pickaxe', '⛏️', 'Beliung Besi', 'Beliung besi berkualitas. Batu dan bijih hancur dengan cepat.', { type: 'tool', tool: 'pick', bd: 8, dmg: 12 });
  item('wood_club', '🏏', 'Pentungan Kayu', 'Papan patah yang diikat rapat. Cukup keras untuk menghajar zombie.', { type: 'tool', tool: 'club', bd: 1, dmg: 14 });
  item('fists', '✊', 'Tangan Kosong', 'Masih lebih baik daripada tidak melawan sama sekali.', { type: 'tool', tool: 'fist', bd: 1, dmg: 4 });

  /* ---------- Blok yang dapat dipasang ---------- */
  item('wood_block', '🟫', 'Blok Kayu', 'Blok bangunan 1 m. Agak rapuh, tapi bahannya murah. Klik kanan untuk pasang.', { type: 'block', vox: 1, hp: 30 });
  item('stone_block', '⬜', 'Blok Batu', 'Blok bangunan 1 m. Jauh lebih kuat daripada blok kayu.', { type: 'block', vox: 2, hp: 90 });
  item('furnace', '🔥', 'Tungku Pelebur', 'Melebur bongkahan besi dan kabel menjadi batangan logam. Pasang lalu tekan E di dekatnya.', { type: 'block', vox: 3, hp: 80 });

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
    { id: 'iron_axe', out: ['iron_axe', 1], cost: { iron_ingot: 3, wood_sticks: 2 } },
    { id: 'iron_pickaxe', out: ['iron_pickaxe', 1], cost: { iron_ingot: 3, wood_sticks: 2 } },
    { id: 'melt_iron', out: ['iron_ingot', 1], cost: { iron_nugget: 20 }, furnace: true, label: 'Lebur Batang Besi' },
    { id: 'melt_copper', out: ['copper_ingot', 1], cost: { broken_copper_wire: 50 }, furnace: true, label: 'Lebur Batang Tembaga' }
  ];

  /* ---------- Tabel Loot (total persen = 100) ---------- */
  var LOOT = {
    trash1: { name: 'Sampah (Tier 1)', rolls: 1, enabled: true, t: [['broken_plastic_bottle', 20], ['dirty_plastic_bottle', 20], ['dirty_box_food', 15], ['broken_tin_can', 10], ['leftover_food', 15], ['gravel', 15], ['soil', 5]] },
    trash2: { name: 'Sampah (Tier 2)', rolls: 1, enabled: true, t: [['dirty_aluminium_foil', 15], ['dirty_paper', 20], ['broken_leather_cloth', 5], ['broken_fabric_cloth', 10], ['gravel', 5], ['broken_floppy_drive', 1], ['iron_nugget', 7], ['broken_copper_wire', 7], ['broken_cardboards', 15], ['broken_wood_planks', 15]] },
    trash3: { name: 'Sampah (Tier 3)', rolls: 1, enabled: false, t: [['broken_dvd_player', 2], ['broken_cd', 3], ['broken_dvd', 5], ['broken_old_tv', null]] },
    crate1: { name: 'Peti Kayu (Tier 1)', rolls: 3, enabled: true, t: [['contaminated_veg', 20], ['dirty_veg', 20], ['contaminated_fruits', 15], ['dirty_fruits', 15], ['plastic_bottled_water', 20], ['wood_sticks', 10]] }
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