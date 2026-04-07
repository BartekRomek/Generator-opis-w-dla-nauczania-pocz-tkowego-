import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Funkcja do pobierania lokalnego adresu IP (w sieci Wi-Fi/LAN)
function getNetworkIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Szukamy adresu IPv4, który nie jest adresem wewnętrznym (localhost)
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

app.listen(PORT, () => {
  const networkIp = getNetworkIp();
  console.log(`\n✅ Aplikacja jest gotowa! Możesz ją otworzyć w przeglądarce:\n`);
  console.log(`  Local URL:   http://localhost:${PORT}`);
  console.log(`  Network URL: http://${networkIp}:${PORT}\n`);
});