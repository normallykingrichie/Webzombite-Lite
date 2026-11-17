/* Pengaturan publik Webzombite-Lite. Tidak menggunakan koneksi database / Supabase. */
window.WZ_CONFIG = {
  appName: 'Webzombite-Lite',
  coreUrl: 'https://best-xking-all-platforms-core-web.louisstevenhrt05.workers.dev/',
  maxPlayers: 4,
  mqttBrokers: [
    'wss://broker.emqx.io:8084/mqtt',
    'wss://broker.hivemq.com:8884/mqtt'
  ]
};