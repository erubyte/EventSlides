const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const OLD = path.join(__dirname, 'photos');
const NEW = path.join(__dirname, 'slides_photos');
const OUT = path.join(ROOT, 'outputs', 'bucharest-exhibitions-sept-4-6-2026.html');
fs.mkdirSync(NEW, { recursive: true });
fs.mkdirSync(path.dirname(OUT), { recursive: true });

const e = (slug, title, dates, price, href, photos) => ({ slug, title, dates, price, href, photos });
const local = slug => ({ file: path.join(OLD, `${slug}.img`) });
const remote = url => ({ url });

const venues = [
  {
    name: 'PALATUL CESIANU–RACOVIȚĂ', sub: 'Artmark · Strada C.A. Rosetti 5',
    hours: ['Fri 10:00–20:00', 'Sat 10:00–20:00', 'Sun 10:00–20:00'],
    admission: 'Admission: free',
    exhibitions: [
      e('artmark-collecting', 'Collecting Now', '10 Aug – 22 Sep 2026', 'Free admission', 'https://www.artmark.ro/ro/licitatie/collecting-now-licitatia-de-arta-postmoderna-si-contemporana-6582026', [local('artmark-collecting')]),
      e('artmark-shine', 'Time to Shine', '10 Aug – 24 Sep 2026', 'Free admission', 'https://www.artmark.ro/ro/licitatie/time-to-shine-licitatia-de-bijuterii-6592026', [local('artmark-shine')]),
    ]
  },
  {
    name: 'ARCUL DE TRIUMF', sub: 'Triumphal Arch · Piața Arcul de Triumf',
    hours: ['Fri 10:00–18:00 · last entry 17:30', 'Sat 11:00–19:00 · last entry 18:30', 'Sun 11:00–19:00 · last entry 18:30'],
    admission: 'Admission: 15 RON · reduced 8 RON',
    exhibitions: [
      e('arc-wwi', 'Commemorating the Participants of the First World War', '10 May – 31 Oct 2026', '15 RON · reduced 8 RON', 'https://palatebrancovenesti.ro/evocarea-participantilor-din-primul-razboi-mondial/', [
        remote('https://palatebrancovenesti.ro/wp-content/uploads/2026/04/1.Afis-Evocarea-participantilor-din-PRM.jpeg')
      ])
    ]
  },
  {
    name: 'MNAC', sub: 'National Museum of Contemporary Art · Palace of Parliament',
    hours: ['Fri 11:00–18:30 · last entry 18:00', 'Sat 11:00–18:30 · last entry 18:00', 'Sun 11:00–18:30 · last entry 18:00'],
    admission: 'Admission: 36 RON · reduced 18 / 9 RON',
    exhibitions: [
      e('mnac-campo', 'CAMPO SANTO', '23 May – 18 Oct 2026', 'Included in museum admission', 'https://mnac.ro/event/1366/CAMPO%20SANTO', [local('mnac-campo')]),
      e('mnac-lighting', 'Cristian Dițoiu: Illuminations', '23 May – 18 Oct 2026', 'Included in museum admission', 'https://mnac.ro/event/1367/CRISTIAN%20DI%C8%9AOIU.%20ECLERAJE', [local('mnac-lighting')]),
      e('mnac-crosses', 'Bent Crosses: A Victoria & Marian Zidaru Retrospective', '23 May – 18 Oct 2026', 'Included in museum admission', 'https://www.mnac.ro/event/1364/Vernisajul%20sezonului%20expozi%C8%9Bional%20de%20var%C4%83%202026', [local('mnac-crosses')]),
      e('mnac-solitudes', 'Roman Cotoșman: 110 Solitudes', '23 May – 18 Oct 2026', 'Included in museum admission', 'https://mnac.ro/event/1369/ROMAN%20COTO%C8%98MAN.%20110%20SINGUR%C4%82T%C4%82%C8%9AI', [local('mnac-solitudes')]),
      e('mnac-pop', 'CECI N’EST PAS POP', '23 May – 18 Oct 2026', 'Included in museum admission', 'https://www.mnac.ro/event/1372/CECI%20N%E2%80%99EST%20PAS%20POP', [local('mnac-pop')]),
      e('mnac-boite', 'Boîte, Box, Brâncuși', '19 Feb – 15 Oct 2026', 'Included in museum admission', 'https://www.mnac.ro/event/1354/Bo%C3%AEte%2C%20Box%2C%20Br%C3%A2ncu%C8%99i', [local('mnac-boite')]),
    ]
  },
  {
    name: 'MARe', sub: 'Museum of Recent Art · Bulevardul Primăverii 15',
    hours: ['Fri 11:00–19:00', 'Sat 11:00–19:00', 'Sun 11:00–19:00'],
    admission: 'Admission: 30 RON · reduced 15 RON',
    exhibitions: [
      e('mare-spritz', 'Late Summer Spritz', '13 Aug – 15 Nov 2026', 'Included in museum admission', 'https://mare.ro/exhibition/late-summer-spritz/', [local('mare-spritz')]),
      e('mare-brancusi', 'Photographs by Constantin Brâncuși: Vintage Prints', '22 May – 27 Sep 2026', 'Included in museum admission', 'https://mare.ro/exhibition/photographs-constantin-brancusi/', [local('mare-brancusi')]),
    ]
  },
  {
    name: 'EVA FOUNDATION', sub: 'Strada I.C. Visarion 17 · appointment required',
    hoursNote: 'By hourly appointment',
    hours: ['Fri 11:00–18:00', 'Sat 11:00–18:00', 'Sun Closed'],
    admission: '',
    exhibitions: [
      e('eva-sirens', 'Sirens', 'On view during 4–6 Sep 2026', '', 'https://evafoundation.art/', [
        remote('https://cdn.sanity.io/images/gq7yyuis/production/9bba41b297a5141781368e05f1ced551245f7f5c-5311x3579.png?auto=format&fit=max&w=1600'),
        remote('https://cdn.sanity.io/images/gq7yyuis/production/5724d68d502fab44254975e2fec418659e606faa-8192x5464.jpg?auto=format&fit=max&w=1600'),
        remote('https://cdn.sanity.io/images/gq7yyuis/production/84ce7bb1ba0ce1172766d6f2fa14391a7dc51fb3-2000x1334.jpg?auto=format&fit=max&w=1600'),
        remote('https://cdn.sanity.io/images/gq7yyuis/production/a65abb32fcca629d5c8c6863019f2cf402e164f6-6999x4666.jpg?auto=format&fit=max&w=1600')
      ])
    ]
  },
  {
    name: 'MNȚR', sub: 'National Museum of the Romanian Peasant · Șoseaua Kiseleff 3',
    hours: ['Fri 10:00–18:00 · last entry 17:00', 'Sat 10:00–18:00 · last entry 17:00', 'Sun 10:00–18:00 · last entry 17:00'],
    admission: 'Admission: 20 RON · reduced 10 / 5 RON',
    exhibitions: [
      e('mntr-unwritten', 'NISCRIATI [Unwritten]', '3 – 20 Sep 2026', 'Included in museum admission', 'https://www.mntr.ro/w/niscriati-nescrise-', [local('mntr-unwritten')]),
      e('mntr-lights', 'Lights and Shadows', '1 – 6 Sep 2026', 'Included in museum admission', 'https://www.mntr.ro/w/lumini-%C8%99i-umbre', [local('mntr-lights')]),
      e('mntr-tescani', 'TESCANI 50', '26 Aug – 27 Sep 2026', 'Included in museum admission', 'https://www.mntr.ro/w/tescani-50', [local('mntr-tescani')]),
      e('mntr-white', 'White on White', '20 Aug – 13 Sep 2026', 'Included in museum admission', 'https://www.mntr.ro/w/alb-pe-alb', [local('mntr-white')]),
    ]
  },
  {
    name: 'SUȚU PALACE', sub: 'Bucharest Municipality Museum · Bulevardul I.C. Brătianu 2',
    hours: ['Fri 10:00–18:00 · last entry 17:30', 'Sat 10:00–18:00 · last entry 17:30', 'Sun 10:00–18:00 · last entry 17:30'],
    admission: '30 RON all exhibitions · 20 RON excluding Dacian Fortresses',
    exhibitions: [
      e('sutu-dacian', 'The World of Dacian Fortresses: People, Heroes and Gods', 'From 20 May 2026', '30 RON all-exhibitions ticket', 'https://muzeulbucurestiului.ro/expozitia-lumea-cetatilor-dacice/', [local('sutu-dacian')]),
      e('sutu-printing', 'Masters of Printing: Bucharest Printers in the 18th Century', 'From 5 Jun 2026', '20 RON · also included in 30 RON ticket', 'https://muzeulbucurestiului.ro/expozitia-mesterii-tiparului/', [local('sutu-printing')]),
      e('sutu-rescue', 'The Bucharest Emergency Service: A Mission for Life', 'From 26 Jun 2026', '20 RON · also included in 30 RON ticket', 'https://muzeulbucurestiului.ro/expozitia-tematica-societatea-de-salvare/', [local('sutu-rescue')]),
    ]
  },
  {
    name: 'MNAR', sub: 'National Museum of Art of Romania · Calea Victoriei 49–53',
    hours: ['Fri 10:00–18:00 · last entry 17:00', 'Sat 11:00–19:00 · last entry 18:00', 'Sun 11:00–19:00 · last entry 18:00'],
    admission: 'Admission: 32 RON · reduced 16 / 8 RON',
    exhibitions: [
      e('mnar-brancusi', 'Brâncuși: The Syndrome', '12 Jun – 25 Oct 2026', 'Included in museum admission', 'https://mnar.arts.ro/36-romana/7849-expozi%C8%9Bia-%E2%80%9Ebr%C3%A2ncu%C8%99i-sindromul%E2%80%9D', [local('mnar-brancusi')]),
      e('mnar-museums', 'The Museum of Museums', '12 Jun – 4 Oct 2026', 'Included in museum admission', 'https://www.mnar.arts.ro/descopera/expozitii-temporare/427-expozi%C8%9Bia-eveniment-muzeul-muzeelor', [local('mnar-museums')]),
      e('mnar-cotosman', 'Cotoșman & Co.: Livius Ciocârlie’s Lesson', '8 May – 13 Sep 2026', 'Included in museum admission', 'https://www.mnar.arts.ro/evenimente-muzeu/eveniment/885-coto%C8%99man-co-lec%C8%9Bia-lui-livius-cioc%C3%A2rlie', [local('mnar-cotosman')]),
      e('mnar-penelope', 'Works in Focus: Penelope and Two Suitors', '1 Jul – 7 Oct 2026', 'Included in museum admission', 'https://www.mnar.arts.ro/arhiva-evenimentelor/eveniment/895-opere-%C3%AEn-prim-plan', [local('mnar-penelope')]),
    ]
  },
  {
    name: 'TINP', sub: 'Tomorrow Is Not Promised · Strada Benjamin Franklin 10',
    hoursNote: 'No regular exhibition hours',
    hours: ['Fri Event access from 20:00', 'Sat Hours not listed', 'Sun Hours not listed'],
    admission: '',
    exhibitions: [
      e('tinp-hide', 'Hide and Seek', '27 Aug – 1 Oct 2026', '', 'https://uap.ro/hide-and-seek-bucuresti/?lang=ro', [local('tinp-hide')]),
      e('tinp-minimal', 'Minimal Complexity', '27 Aug – 1 Oct 2026', '', 'https://neoartconnect.ro/', [local('tinp-minimal')]),
    ]
  },
  {
    name: 'ARSMONITOR', sub: 'House of the Free Press · Wing A2, 3rd floor',
    hoursNote: 'Weekend visits by appointment',
    hours: ['Fri 14:00–19:00', 'Sat By appointment', 'Sun By appointment'],
    admission: '',
    exhibitions: [
      e('ars-iconoflux', 'ICONOFLUX', '3 Sep – 22 Oct 2026', '', 'https://arsmonitor.ro/', [
        remote('https://static-assets.artlogic.net/w_2000,h_2000,c_limit,f_auto,fl_lossy,q_auto/ws-artlogicwebsite2219/usr/images/exhibitions/home_page_image/items/b5/b5a7bf6c7c4e4d0b8b36e719ef37733b/iconofluxweb.png')
      ])
    ]
  },
  {
    name: '/SAC @ MINCU GALLERY', sub: 'Ion Mincu University of Architecture · Strada Academiei 18–20',
    hours: ['Fri 14:00–20:00', 'Sat 14:00–20:00', 'Sun Closed'],
    admission: '',
    exhibitions: [
      e('sac-offside', 'Offside: Plans, Goals and Points', '16 Jul – 12 Sep 2026', '', 'https://sacbucharest.com/offside-eng', [
        remote('https://images.squarespace-cdn.com/content/v1/5bc57b3ffb22a52798f8a52d/1786031412417-HUKUW6PFEXPGGV5FC2L1/OFFSIDE_SAC_Mincu_DV_57A5167-min.jpg?format=1500w'),
        remote('https://images.squarespace-cdn.com/content/v1/5bc57b3ffb22a52798f8a52d/1786031412414-7F4P5O3FHDK5RXM30G3M/OFFSIDE_SAC_Mincu_DV_57A5193+%281%29-min.jpg?format=1500w'),
        remote('https://images.squarespace-cdn.com/content/v1/5bc57b3ffb22a52798f8a52d/1786031424517-Q3G2WU6D3G7TH131G504/OFFSIDE_SAC_Mincu_DV_57A5492-min.jpg?format=1500w'),
        remote('https://images.squarespace-cdn.com/content/v1/5bc57b3ffb22a52798f8a52d/1786031424784-BH1BO7HVRLJL8INSEI5O/OFFSIDE_SAC_Mincu_DV_57A5514-min.jpg?format=1500w')
      ])
    ]
  },
  {
    name: 'SCÂNTEIA+', sub: 'House of the Free Press · Piața Presei Libere',
    hoursNote: 'Exhibition hours',
    hours: ['Fri 14:00–18:00', 'Sat 14:00–18:00', 'Sun Closed'],
    admission: '',
    exhibitions: [
      e('scanteia-picture', 'THE PICTURE: Explaining Photography in 39 Works', 'Through 6 Sep 2026', '', 'https://scanteia.org/events/', [
        remote('https://empowerartists.org/wp-content/uploads/2026/07/730481099_18419087467180095_489468134040645230_n-1170x730.jpg'),
        remote('https://empowerartists.org/wp-content/uploads/2026/07/730558845_18419087500180095_2632969724411652312_n-1170x730.jpg'),
        remote('https://empowerartists.org/wp-content/uploads/2026/07/730573588_18419087545180095_4994983755566255780_n-1170x730.jpg'),
        remote('https://empowerartists.org/wp-content/uploads/2026/07/730640416_18419087683180095_6911658840488375866_n-1170x730.jpg')
      ])
    ]
  },
  {
    name: 'MUSEUM OF ART COLLECTIONS', sub: 'Calea Victoriei 111',
    hours: ['Fri 10:00–18:00 · last entry 17:00', 'Sat 11:00–19:00 · last entry 18:00', 'Sun 11:00–19:00 · last entry 18:00'],
    admission: 'Admission: 32 RON',
    exhibitions: [
      e('collections-map', 'Old Maps and New Art', '15 May – 22 Sep 2026', '32 RON', 'https://mail.mnar.ro/evenimente-muzeu/eveniment/886-hart%C4%83-veche-%C8%99i-art%C4%83-nou%C4%83', [
        remote('https://www.mnar.arts.ro/components/com_rseventspro/assets/images/events/Site_Expo%20Emilian%20Radu.jpg')
      ])
    ]
  },
  {
    name: 'MOGOȘOAIA PALACE', sub: 'Palatele Brâncovenești · Strada Valea Parcului 1, Mogoșoaia',
    hours: ['Fri 10:00–18:00 · last entry 17:30', 'Sat 11:00–19:00 · last entry 18:30', 'Sun 11:00–19:00 · last entry 18:30'],
    admission: 'Admission: 15 RON · reduced 8 RON',
    exhibitions: [
      e('mogosoaia-sign', '12. Sign. Symbol. Meaning', '3 – 18 Sep 2026', 'Included in palace admission', 'https://palatebrancovenesti.ro/semn-simbol-semnificatie/', [remote('https://palatebrancovenesti.ro/wp-content/uploads/2026/08/Afis-Semn.-Simbol.-Semnificatie-724x1024.jpg')]),
      e('mogosoaia-connections', '(In)visible Connections', '27 Aug – 13 Sep 2026', 'Included in palace admission', 'https://palatebrancovenesti.ro/invisible-connections/', [remote('https://palatebrancovenesti.ro/wp-content/uploads/2026/08/2.-Afis-Invisible-connections-724x1024.jpg')]),
      e('mogosoaia-identity', 'Identity', '27 Aug – 13 Sep 2026', 'Included in palace admission', 'https://palatebrancovenesti.ro/identitate/', [remote('https://palatebrancovenesti.ro/wp-content/uploads/2026/08/1.-Afis-identitate-724x1024.jpg')]),
    ]
  },
];

function esc(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function fileNameFor(ex, i) { return path.join(NEW, `${ex.slug}-${i}.img`); }

async function download(url, dest) {
  if (fs.existsSync(dest)) {
    try { await sharp(dest).metadata(); return; } catch { fs.unlinkSync(dest); }
  }
  const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0', 'accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  await sharp(dest).metadata();
}

async function dataUri(photo, ex, i) {
  let file = photo.file;
  if (!file) { file = fileNameFor(ex, i); await download(photo.url, file); }
  const buf = await sharp(file).rotate().resize({ width: 1600, height: 1200, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function hydrate() {
  for (const v of venues) for (const ex of v.exhibitions) {
    ex.images = [];
    for (let i = 0; i < ex.photos.length; i++) {
      ex.images.push(await dataUri(ex.photos[i], ex, i));
      process.stdout.write(`✓ ${ex.slug} ${i + 1}/${ex.photos.length}\n`);
    }
  }
}

function imageGrid(ex) {
  return `<div class="photo-grid p${ex.images.length}">${ex.images.map((src,i)=>`<img src="${src}" alt="${esc(ex.title)} — image ${i+1}" loading="eager">`).join('')}</div>`;
}

function card(ex, i) {
  const details = [ex.dates, ex.price].filter(Boolean).map(item => `<span>${esc(item)}</span>`).join('');
  return `<article class="exhibition-card">${imageGrid(ex)}<div class="shade"></div><div class="card-copy"><div class="index">${String(i+1).padStart(2,'0')}</div><a class="ex-title" href="${esc(ex.href)}" target="_blank" rel="noreferrer">${esc(ex.title)} <span>↗</span></a><div class="details">${details}</div></div></article>`;
}

function slide(v, i) {
  const admission = v.admission ? `<div class="admission">${esc(v.admission)}</div>` : '';
  const hoursNote = v.hoursNote ? `<em>${esc(v.hoursNote)}</em>` : '';
  const hours = v.hours.map(line => `<span>${esc(line)}</span>`).join('');
  return `<section class="slide${i===0?' active':''}" id="slide-${i+1}" aria-label="${esc(v.name)}"><header><div><div class="eyebrow">BUCHAREST · 4–6 SEPTEMBER 2026</div><h1>${esc(v.name)}</h1><p>${esc(v.sub)}</p></div><div class="top-meta"><div class="hours"><b>OPENING HOURS</b>${hoursNote}${hours}</div>${admission}</div></header><main class="cards n${v.exhibitions.length}">${v.exhibitions.map(card).join('')}</main><footer><span>${String(i+1).padStart(2,'0')} / ${String(venues.length).padStart(2,'0')}</span><span>${v.exhibitions.length} exhibition${v.exhibitions.length===1?'':'s'}</span></footer></section>`;
}

function html() {
  const slides = venues.map(slide).join('\n');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bucharest exhibitions · 4–6 September 2026</title><style>
  :root{--bg:#080808;--panel:#111;--line:rgba(255,255,255,.16);--muted:#b8b8b8;--pad:clamp(28px,4.2vw,78px)}*{box-sizing:border-box}html,body{margin:0;background:#000;color:#fff;font-family:Inter,Helvetica Neue,Arial,sans-serif;overflow:hidden}a{color:inherit}.deck{width:100vw;height:100vh;position:relative;background:#000}.slide{display:none;width:100vw;height:100vh;padding:var(--pad);padding-bottom:calc(var(--pad) - 12px);background:radial-gradient(circle at 78% 0%,#222 0,#0b0b0b 29%,#060606 68%);grid-template-rows:auto 1fr auto;gap:clamp(18px,2.6vh,34px)}.slide.active{display:grid}header{display:flex;justify-content:space-between;gap:32px;align-items:flex-start;border-bottom:1px solid var(--line);padding-bottom:clamp(18px,2.4vh,30px)}.eyebrow{font-size:clamp(11px,.9vw,15px);font-weight:700;letter-spacing:.22em;color:#9c9c9c;margin-bottom:12px}h1{font-size:clamp(32px,4vw,72px);line-height:.95;letter-spacing:-.045em;margin:0 0 11px;max-width:1100px}header p{font-size:clamp(14px,1.15vw,20px);color:var(--muted);margin:0}.top-meta{width:min(500px,38vw);display:grid;gap:9px;flex:0 0 auto}.hours{border-left:2px solid #fff;padding:3px 0 3px 15px;display:grid;gap:3px;line-height:1.2}.hours b{font-size:10px;letter-spacing:.2em;color:#9c9c9c;margin-bottom:3px}.hours em{font-size:clamp(12px,.9vw,15px);font-style:normal;color:#bdbdbd;margin-bottom:2px}.hours span{display:block;font-size:clamp(12px,.92vw,15px);font-weight:650}.admission{border:1px solid rgba(255,255,255,.28);border-radius:999px;padding:8px 15px;font-size:clamp(11px,.85vw,13px);line-height:1.2;text-align:left;background:rgba(255,255,255,.05)}.cards{min-height:0;display:grid;gap:clamp(12px,1.3vw,24px)}.cards.n1{grid-template-columns:1fr}.cards.n2{grid-template-columns:repeat(2,1fr)}.cards.n3{grid-template-columns:repeat(3,1fr)}.cards.n4{grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(2,1fr)}.cards.n5,.cards.n6{grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr)}.exhibition-card{position:relative;overflow:hidden;border:1px solid var(--line);border-radius:3px;background:#161616;min-height:0}.photo-grid{display:grid;width:100%;height:100%;gap:2px;background:#222;grid-template-rows:1fr}.photo-grid.p1{grid-template-columns:1fr}.photo-grid.p2{grid-template-columns:repeat(2,minmax(0,1fr))}.photo-grid.p3{grid-template-columns:repeat(3,minmax(0,1fr))}.photo-grid.p4{grid-template-columns:repeat(4,minmax(0,1fr))}.photo-grid img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.9) contrast(1.03)}.shade{position:absolute;inset:28% 0 0;background:linear-gradient(transparent,rgba(0,0,0,.45) 26%,rgba(0,0,0,.95) 100%);pointer-events:none}.card-copy{position:absolute;left:clamp(16px,1.5vw,28px);right:clamp(16px,1.5vw,28px);bottom:clamp(16px,2vh,28px);z-index:2}.index{font-size:11px;letter-spacing:.2em;color:#bcbcbc;font-weight:700;margin-bottom:7px}.ex-title{font-size:clamp(18px,1.55vw,30px);line-height:1.03;letter-spacing:-.025em;font-weight:700;text-decoration:none;display:block;max-width:96%}.ex-title:hover{text-decoration:underline;text-underline-offset:5px}.ex-title span{font-size:.66em;color:#bfbfbf}.details{display:flex;flex-wrap:wrap;gap:7px 16px;margin-top:10px;color:#d4d4d4;font-size:clamp(11px,.82vw,14px)}.details span+span:before{content:'·';margin-right:16px;color:#777}.cards.n5 .ex-title,.cards.n6 .ex-title{font-size:clamp(15px,1.22vw,23px)}.cards.n5 .details,.cards.n6 .details{font-size:clamp(10px,.72vw,12px);margin-top:7px}.cards.n5 .card-copy,.cards.n6 .card-copy{bottom:15px}.cards.n5 .index,.cards.n6 .index{margin-bottom:4px}.cards.n1 .exhibition-card{min-height:0}.cards.n1 .ex-title{font-size:clamp(28px,3vw,52px);max-width:1000px}.cards.n1 .details{font-size:clamp(13px,1.15vw,19px)}footer{display:flex;justify-content:space-between;color:#8e8e8e;font-size:12px;letter-spacing:.12em;text-transform:uppercase}.nav{position:fixed;right:20px;bottom:18px;display:flex;gap:8px;z-index:20}.nav button{width:42px;height:42px;border:1px solid rgba(255,255,255,.25);border-radius:50%;background:rgba(0,0,0,.65);backdrop-filter:blur(12px);color:white;font-size:18px;cursor:pointer}.nav button:hover{background:#fff;color:#000}.progress{position:fixed;left:0;bottom:0;height:3px;background:#fff;z-index:30;transition:width .35s ease}.hint{position:fixed;left:20px;bottom:18px;color:#777;font-size:11px;letter-spacing:.12em;text-transform:uppercase;z-index:20}
  @media(max-width:800px){.slide{padding:24px;gap:14px}header{display:block}.top-meta{width:100%;margin-top:14px}.admission{display:inline-block}h1{font-size:34px}.cards.n2,.cards.n3,.cards.n4,.cards.n5,.cards.n6{grid-template-columns:1fr 1fr;grid-template-rows:auto;overflow:auto}.exhibition-card{min-height:280px}.hint{display:none}.nav{bottom:10px;right:10px}.slide footer{padding-right:90px}}
  html,body{background:#d9efff;color:#14283b}.deck{background:#d9efff}.slide{background:radial-gradient(circle at 78% 0%,#eef8ff 0,#d9efff 36%,#c9e5f8 100%)}header{border-color:rgba(20,40,59,.2)}.eyebrow{color:#4f6d85}header p{color:#405f78}.hours{border-color:#17364f}.hours b,.hours em{color:#4f6d85}.admission{border-color:rgba(20,40,59,.3);background:rgba(255,255,255,.3);color:#17364f}.exhibition-card,.exhibition-card a{color:#fff}footer,.hint{color:#4f6d85}.nav button{border-color:#17364f;background:#17364f;color:#fff}.nav button:hover{background:#fff;color:#17364f}.progress{background:#17364f}
  @media print{@page{size:landscape;margin:0}html,body{overflow:visible;background:#d9efff}.deck{height:auto}.slide,.slide.active{display:grid;break-after:page;width:100vw;height:100vh}.nav,.progress,.hint{display:none}}
  </style></head><body><div class="deck">${slides}</div><div class="progress" id="progress"></div><div class="hint">← → navigate · click exhibition titles for sources</div><div class="nav"><button id="prev" aria-label="Previous slide">←</button><button id="next" aria-label="Next slide">→</button></div><script>
  const slides=[...document.querySelectorAll('.slide')];let current=Math.max(0,Math.min(slides.length-1,(parseInt(location.hash.replace(/\\D/g,''),10)||1)-1));function show(n){slides[current].classList.remove('active');current=(n+slides.length)%slides.length;slides[current].classList.add('active');document.getElementById('progress').style.width=((current+1)/slides.length*100)+'%';history.replaceState(null,'','#slide-'+(current+1));}document.getElementById('prev').onclick=()=>show(current-1);document.getElementById('next').onclick=()=>show(current+1);addEventListener('keydown',e=>{if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();show(current+1)}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(current-1)}if(e.key==='Home')show(0);if(e.key==='End')show(slides.length-1)});let x=null;addEventListener('touchstart',e=>x=e.touches[0].clientX,{passive:true});addEventListener('touchend',e=>{if(x===null)return;const d=e.changedTouches[0].clientX-x;if(Math.abs(d)>50)show(current+(d<0?1:-1));x=null},{passive:true});show(current);
  </script></body></html>`;
}

async function main() {
  await hydrate();
  fs.writeFileSync(OUT, html());
  console.log(`→ ${OUT}`);
}

if (require.main === module) main().catch(err=>{console.error(err);process.exit(1)});

module.exports = { venues, hydrate, html, OUT };
