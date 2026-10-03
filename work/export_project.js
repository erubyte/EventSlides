const fs = require('fs');
const vm = require('vm');

const input = process.argv[2];
const output = process.argv[3];
const venues = (JSON.parse(fs.readFileSync(input, 'utf8')).venues || []);
const source = fs.readFileSync(__dirname + '/build_editor.js', 'utf8');
const constant = name => {
  const match = source.match(new RegExp("const " + name + "=('(?:\\\\.|[^'])*');"));
  if (!match) throw new Error('Missing ' + name);
  return vm.runInNewContext(match[1]);
};
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const photos = ex => ex.images?.length
  ? `<div class="photo-grid p${ex.images.length}">${ex.images.map((src, i) => `<img src="${src}" alt="${esc(ex.title)} — image ${i + 1}">`).join('')}</div>`
  : '<div class="empty">No image</div>';
const card = (ex, i) => {
  const description = ex.description ? `<div class="description">${esc(ex.description)}</div>` : '';
  const details = [ex.dates, ex.price].filter(Boolean).map(x => `<span>${esc(x)}</span>`).join('');
  return `<article class="exhibition-card">${photos(ex)}<div class="shade"></div><div class="card-copy"><div class="index">${String(i + 1).padStart(2, '0')}</div><a class="ex-title" href="${esc(ex.href || '#')}" target="_blank" rel="noreferrer">${esc(ex.title)} <small>↗</small></a>${description}<div class="details">${details}</div></div></article>`;
};
const slide = (v, i) => {
  const note = v.hoursNote ? `<em>${esc(v.hoursNote)}</em>` : '';
  const hours = (v.hours || []).map(x => `<span>${esc(x)}</span>`).join('');
  const admission = v.admission ? `<div class="admission">${esc(v.admission)}</div>` : '';
  return `<section class="slide ${i === 0 ? 'active' : ''}" id="slide-${i + 1}"><header><div><div class="eyebrow">BUCHAREST · 4–6 SEPTEMBER 2026</div><h1>${esc(v.name)}</h1><p>${esc(v.sub)}</p></div><div class="top-meta"><div class="hours"><b>OPENING HOURS</b>${note}${hours}</div>${admission}</div></header><main class="cards n${v.exhibitions.length}">${v.exhibitions.map(card).join('')}</main><footer><span>${String(i + 1).padStart(2, '0')} / ${String(venues.length).padStart(2, '0')}</span><span>${v.exhibitions.length} exhibition${v.exhibitions.length === 1 ? '' : 's'}</span></footer></section>`;
};
let css = constant('DECK_CSS').replace('inset:24% 0 0', 'inset:60% 0 0');
css += '@media print{.cards.n2{grid-template-columns:repeat(2,1fr)!important;grid-template-rows:1fr!important}.cards.n3{grid-template-columns:repeat(3,1fr)!important;grid-template-rows:1fr!important}.cards.n4{grid-template-columns:repeat(2,1fr)!important;grid-template-rows:repeat(2,1fr)!important}.cards.n5,.cards.n6{grid-template-columns:repeat(3,1fr)!important;grid-template-rows:repeat(2,1fr)!important}.cards.n2,.cards.n3,.cards.n4,.cards.n5,.cards.n6{overflow:visible!important}.exhibition-card{min-height:0!important}}';
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bucharest exhibitions · 4–6 September 2026</title><style>${css}${constant('DECK_BLUE_CSS')}</style></head><body><div class="deck">${venues.map(slide).join('')}</div><div class="progress" id="progress"></div><div class="hint">← → navigate · click exhibition titles for sources</div><div class="nav"><button id="prev">←</button><button id="next">→</button></div><script>${constant('DECK_JS')}</script></body></html>`;
fs.writeFileSync(output, html);
console.log(output);
