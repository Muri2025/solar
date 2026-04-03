const https = require('https');
const fs = require('fs');
const path = require('path');

const textures = [
  '8k_sun.jpg',
  '8k_mercury.jpg',
  '8k_venus_surface.jpg',
  '8k_earth_daymap.jpg',
  '8k_mars.jpg',
  '8k_jupiter.jpg',
  '8k_saturn.jpg',
  '8k_saturn_ring_alpha.png',
  '2k_uranus.jpg',
  '2k_neptune.jpg',
  '8k_stars_milky_way.jpg'
];

const dir = path.join(__dirname, 'textures');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

textures.forEach(file => {
  const url = `https://www.solarsystemscope.com/textures/download/${file}`;
  const dest = path.join(dir, file);
  
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36',
      'Referer': 'https://www.solarsystemscope.com/textures/',
      'Accept': 'image/avif,image/webp,*/*'
    }
  };

  https.get(url, options, (res) => {
    if(res.statusCode !== 200) {
      console.log(`Failed to get ${file}: ${res.statusCode}`);
      return;
    }
    const fileStream = fs.createWriteStream(dest);
    res.pipe(fileStream);
    fileStream.on('finish', () => console.log(`Downloaded ${file}`));
  }).on('error', (err) => console.error(err));
});
