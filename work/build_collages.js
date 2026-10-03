const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const PHOTO_DIR = path.join(__dirname, 'photos');
const OUT_DIR = path.join(ROOT, 'outputs');
fs.mkdirSync(PHOTO_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const venues = [
  {
    slug: '01-mnac', name: 'MNAC', fullName: 'National Museum of Contemporary Art',
    admission: 'Admission: 36 RON  |  reduced 18 / 9 RON',
    exhibitions: [
      { slug: 'mnac-campo', title: 'CAMPO SANTO', source: 'https://mnac.ro/event/1366/CAMPO%20SANTO', mnacId: 1366 },
      { slug: 'mnac-lighting', title: 'Cristian Dițoiu: Illuminations', source: 'https://mnac.ro/event/1367/CRISTIAN%20DI%C8%9AOIU.%20ECLERAJE', mnacId: 1367 },
      { slug: 'mnac-crosses', title: 'Bent Crosses: A Victoria & Marian Zidaru Retrospective', source: 'https://www.mnac.ro/event/1368/CRUCI%20%C3%8ENDOITE', mnacId: 1368 },
      { slug: 'mnac-solitudes', title: 'Roman Cotoșman: 110 Solitudes', source: 'https://mnac.ro/event/1369/ROMAN%20COTO%C8%98MAN.%20110%20SINGUR%C4%82T%C4%82%C8%9AI', mnacId: 1369 },
      { slug: 'mnac-pop', title: 'CECI N’EST PAS POP', source: 'https://www.mnac.ro/event/1372/CECI%20N%E2%80%99EST%20PAS%20POP', mnacId: 1372 },
      { slug: 'mnac-boite', title: 'Boîte, Box, Brâncuși', source: 'https://www.mnac.ro/event/1354/Bo%C3%AEte%2C%20Box%2C%20Br%C3%A2ncu%C8%99i', mnacId: 1354 },
    ]
  },
  {
    slug: '02-mnar', name: 'MNAR', fullName: 'National Museum of Art of Romania',
    admission: 'Admission: 32 RON  |  reduced 16 / 8 RON',
    exhibitions: [
      { slug: 'mnar-brancusi', title: 'Brâncuși: The Syndrome', source: 'https://mnar.arts.ro/36-romana/7849-expozi%C8%9Bia-%E2%80%9Ebr%C3%A2ncu%C8%99i-sindromul%E2%80%9D', photo: 'https://www.mnar.arts.ro/components/com_rseventspro/assets/images/events/Sindromul_900x350.jpg' },
      { slug: 'mnar-museums', title: 'The Museum of Museums', source: 'https://www.mnar.arts.ro/descopera/expozitii-temporare/427-expozi%C8%9Bia-eveniment-muzeul-muzeelor', photo: 'https://www.mnar.arts.ro/images/descopera/expozitii_temporare/Muzeul_Muzeelor_2026/hd_MMuzeelor_900x350.jpg' },
      { slug: 'mnar-cotosman', title: 'Cotoșman & Co.: Livius Ciocârlie’s Lesson', source: 'https://www.mnar.arts.ro/evenimente-muzeu/eveniment/885-coto%C8%99man-co-lec%C8%9Bia-lui-livius-cioc%C3%A2rlie', photo: 'https://www.mnar.arts.ro/components/com_rseventspro/assets/images/events/website_MNAR_1140x402px.jpg' },
      { slug: 'mnar-penelope', title: 'Works in Focus: Penelope and Two Suitors', source: 'https://www.mnar.arts.ro/arhiva-evenimentelor/eveniment/895-opere-%C3%AEn-prim-plan', photo: 'https://www.mnar.arts.ro/components/com_rseventspro/assets/images/events/OPP_IUNIE%202026_site.jpg' },
    ]
  },
  {
    slug: '03-mntr', name: 'MNȚR', fullName: 'National Museum of the Romanian Peasant',
    admission: 'Admission: 20 RON  |  reduced 10 / 5 RON',
    exhibitions: [
      { slug: 'mntr-unwritten', title: 'NISCRIATI [Unwritten]', source: 'https://www.mntr.ro/w/niscriati-nescrise-', photo: 'https://www.mntr.ro/documents/20117/145435/macheta+site+MNTR+Niscriati+Lila+Passima.jpg/3a775cb1-8466-c97d-2d78-911ecac331ee?t=1787917910481' },
      { slug: 'mntr-lights', title: 'Lights and Shadows', source: 'https://www.mntr.ro/w/lumini-%C8%99i-umbre', photo: 'https://www.mntr.ro/documents/20117/38576/Macheta+Landscape+16_9.jpg/dfe8086f-335a-0840-1024-fe96c5b8dd1a?t=1787731991781' },
      { slug: 'mntr-tescani', title: 'TESCANI 50', source: 'https://www.mntr.ro/w/tescani-50', photo: 'https://www.mntr.ro/documents/20117/145435/fb0dfcce-9c18-412e-8749-8687f0bcd813.png/d847c303-0be8-48bf-ad5b-b84edc627bad?t=1787221814947' },
      { slug: 'mntr-white', title: 'White on White', source: 'https://www.mntr.ro/w/alb-pe-alb', photo: 'https://www.mntr.ro/documents/20117/145435/cover+event+FB.jpg/45626e83-5404-f271-d88f-2a1f6cc1bd8a?t=1786447063575' },
    ]
  },
  {
    slug: '04-sutu-palace', name: 'SUȚU PALACE', fullName: 'Bucharest Municipality Museum',
    admission: 'Admission: 30 RON all exhibitions  |  20 RON excluding Dacian Fortresses',
    exhibitions: [
      { slug: 'sutu-dacian', title: 'The World of Dacian Fortresses: People, Heroes and Gods', source: 'https://muzeulbucurestiului.ro/expozitia-lumea-cetatilor-dacice/', photo: 'https://muzeulbucurestiului.ro/wp-content/uploads/2026/02/afis-cetati-1-1200x600.jpg' },
      { slug: 'sutu-printing', title: 'Masters of Printing: Bucharest Printers in the 18th Century', source: 'https://muzeulbucurestiului.ro/expozitia-mesterii-tiparului/', photo: 'https://muzeulbucurestiului.ro/wp-content/uploads/2026/02/Atelier-tipografic-1200x600.png' },
      { slug: 'sutu-rescue', title: 'The Bucharest Emergency Service: A Mission for Life', source: 'https://muzeulbucurestiului.ro/expozitia-tematica-societatea-de-salvare/', photo: 'https://muzeulbucurestiului.ro/wp-content/uploads/2025/12/Rainbow-Pride-Month-Events-Instagram-Post-1-1080x600.png' },
    ]
  },
  {
    slug: '05-mare', name: 'MARe', fullName: 'Museum of Recent Art',
    admission: 'Admission: 30 RON  |  reduced 15 RON',
    exhibitions: [
      { slug: 'mare-spritz', title: 'Late Summer Spritz', source: 'https://mare.ro/exhibition/late-summer-spritz/', photo: 'https://mare.ro/wp-content/uploads/2026/07/MARe_slider_LateSummer_2560x1389p-1024x556.jpg' },
      { slug: 'mare-brancusi', title: 'Photographs by Constantin Brâncuși: Vintage Prints', source: 'https://mare.ro/exhibition/photographs-constantin-brancusi/', photo: 'https://mare.ro/wp-content/uploads/2026/05/CB230-image-2.jpg' },
    ]
  },
  {
    slug: '06-tinp', name: 'TINP', fullName: 'Tomorrow Is Not Promised · Benjamin Franklin 10',
    admission: 'Admission: no price published',
    exhibitions: [
      { slug: 'tinp-hide', title: 'Hide and Seek', source: 'https://uap.ro/hide-and-seek-bucuresti/?lang=ro', photo: 'https://uap.ro/wp-content/uploads/2026/08/125-Hide-uand-Seek.jpg' },
      { slug: 'tinp-minimal', title: 'Minimal Complexity', source: 'https://neoartconnect.ro/', photo: 'https://freight.cargo.site/t/original/i/0126987977903538db419ddc07134b5b78c410ba14b728fb15c299e249b8e13a/tenu-cina.jpeg' },
    ]
  },
  {
    slug: '07-artmark', name: 'PALATUL CESIANU–RACOVIȚĂ', fullName: 'Artmark',
    admission: 'Admission: free',
    exhibitions: [
      { slug: 'artmark-collecting', title: 'Collecting Now', source: 'https://www.artmark.ro/ro/licitatie/collecting-now-licitatia-de-arta-postmoderna-si-contemporana-6582026', photo: 'https://s3-eu-west-1.amazonaws.com/a10ro/Auction/1180224/conversions/vinieta_4-main-image.jpg' },
      { slug: 'artmark-shine', title: 'Time to Shine', source: 'https://www.artmark.ro/ro/licitatie/time-to-shine-licitatia-de-bijuterii-6592026', photo: 'https://s3-eu-west-1.amazonaws.com/a10ro/Auction/1180504/conversions/vinieta_bijusep1-main-image.jpg' },
    ]
  },
];

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
}

function wrap(text, max) {
  const words = text.split(/\s+/); const lines = []; let line = '';
  for (const word of words) {
    if (!line) line = word;
    else if ((line + ' ' + word).length <= max) line += ' ' + word;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines;
}

async function download(url, dest) {
  if (fs.existsSync(dest)) return;
  const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 Codex exhibition guide' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

async function resolvePhotos() {
  for (const venue of venues) for (const ex of venue.exhibitions) {
    if (ex.mnacId) {
      const data = await (await fetch(`https://www.mnac.ro/public/event/get/one/${ex.mnacId}`)).json();
      const item = data.eventImageGalleryResourceList && data.eventImageGalleryResourceList[0];
      if (!item) throw new Error(`No MNAC image for ${ex.mnacId}`);
      ex.photo = `https://www.mnac.ro/image/event/gallery/original/${ex.mnacId}/${item.imageName}`;
      ex.credit = item.imageCreditEN || item.imageCreditRO || '';
    }
    ex.file = path.join(PHOTO_DIR, `${ex.slug}.img`);
    await download(ex.photo, ex.file);
    await sharp(ex.file).metadata();
    process.stdout.write(`✓ ${ex.slug}\n`);
  }
}

function layoutFor(n) {
  if (n === 6) return { cols: 2, rows: 3 };
  if (n === 4) return { cols: 2, rows: 2 };
  if (n === 3) return { cols: 1, rows: 3 };
  return { cols: 1, rows: 2 };
}

async function makeVenue(venue) {
  const W = 1600, H = 2000, margin = 80, top = 330, gap = 24;
  const { cols, rows } = layoutFor(venue.exhibitions.length);
  const cardW = Math.floor((W - margin * 2 - gap * (cols - 1)) / cols);
  const cardH = Math.floor((H - top - margin - gap * (rows - 1)) / rows);
  const base = sharp({ create: { width: W, height: H, channels: 4, background: '#0a0a0a' } });
  const layers = [];
  const head = `<svg width="${W}" height="${top}"><style>
    .k{font-family:Arial,Helvetica,sans-serif;fill:#9c9c9c;font-size:24px;font-weight:700;letter-spacing:4px}
    .n{font-family:Arial,Helvetica,sans-serif;fill:white;font-size:70px;font-weight:700;letter-spacing:-2px}
    .f{font-family:Arial,Helvetica,sans-serif;fill:#bdbdbd;font-size:28px;font-weight:400}
    .a{font-family:Arial,Helvetica,sans-serif;fill:white;font-size:28px;font-weight:600}
  </style><text class="k" x="${margin}" y="70">BUCHAREST · 4–6 SEPTEMBER 2026</text>
  <text class="n" x="${margin}" y="155">${esc(venue.name)}</text>
  <text class="f" x="${margin}" y="207">${esc(venue.fullName)}</text>
  <line x1="${margin}" y1="242" x2="${W-margin}" y2="242" stroke="#303030" stroke-width="2"/>
  <text class="a" x="${margin}" y="292">${esc(venue.admission)}</text></svg>`;
  layers.push({ input: Buffer.from(head), left: 0, top: 0 });

  for (let i = 0; i < venue.exhibitions.length; i++) {
    const ex = venue.exhibitions[i];
    const col = i % cols, row = Math.floor(i / cols);
    const x = margin + col * (cardW + gap), y = top + row * (cardH + gap);
    const img = await sharp(ex.file).rotate().resize(cardW, cardH, { fit: 'cover', position: 'attention' }).modulate({ brightness: .82, saturation: .9 }).png().toBuffer();
    layers.push({ input: img, left: x, top: y });
    const maxChars = cols === 2 ? 30 : 54;
    const fsTitle = cols === 2 ? 32 : 36;
    const lines = wrap(ex.title, maxChars).slice(0, 3);
    const overlayH = Math.max(160, 75 + lines.length * (fsTitle + 8));
    let tspans = lines.map((l,j) => `<tspan x="36" dy="${j===0 ? 0 : fsTitle+10}">${esc(l)}</tspan>`).join('');
    const ov = `<svg width="${cardW}" height="${cardH}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".92"/></linearGradient></defs><rect x="0" y="${cardH-overlayH-80}" width="${cardW}" height="${overlayH+80}" fill="url(#g)"/><style>.num{font-family:Arial,Helvetica,sans-serif;fill:#cfcfcf;font-size:20px;font-weight:700;letter-spacing:3px}.title{font-family:Arial,Helvetica,sans-serif;fill:white;font-size:${fsTitle}px;font-weight:700}</style><text class="num" x="36" y="${cardH-overlayH+20}">${String(i+1).padStart(2,'0')}</text><text class="title" x="36" y="${cardH-overlayH+70}">${tspans}</text></svg>`;
    layers.push({ input: Buffer.from(ov), left: x, top: y });
  }
  const dest = path.join(OUT_DIR, `${venue.slug}.png`);
  await base.composite(layers).png({ compressionLevel: 9 }).toFile(dest);
  process.stdout.write(`→ ${path.basename(dest)}\n`);
}

async function main() {
  await resolvePhotos();
  for (const venue of venues) await makeVenue(venue);
  fs.writeFileSync(path.join(OUT_DIR, 'sources.json'), JSON.stringify(venues.map(v => ({
    location: v.name, admission: v.admission,
    exhibitions: v.exhibitions.map(e => ({ title: e.title, page: e.source, image: e.photo, credit: e.credit || null }))
  })), null, 2));
}

main().catch(e => { console.error(e); process.exit(1); });
