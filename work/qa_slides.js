const fs = require('fs');
const sharp = require('sharp');

const file = process.argv[2];
const html = fs.readFileSync(file, 'utf8');
const slides = [...html.matchAll(/<section class="slide(?: active)?"[^>]*aria-label="([^"]+)"[\s\S]*?<\/section>/g)];
const cards = [...html.matchAll(/<article class="exhibition-card">/g)];
const sources = [...html.matchAll(/<a class="ex-title" href="([^"]+)"/g)].map(m => m[1]);
const images = [...html.matchAll(/<img src="data:image\/jpeg;base64,([^"]+)" alt="([^"]+)"/g)];

(async () => {
  const badImages = [];
  const dimensions = [];
  for (const [, b64, alt] of images) {
    try {
      const meta = await sharp(Buffer.from(b64, 'base64')).metadata();
      dimensions.push([meta.width, meta.height]);
      if (!meta.width || !meta.height || meta.width < 500 || meta.height < 180) badImages.push({ alt, width: meta.width, height: meta.height });
    } catch (error) {
      badImages.push({ alt, error: error.message });
    }
  }
  const uniqueSources = new Set(sources);
  const hours = [...html.matchAll(/<div class="hours"><b>OPENING HOURS<\/b>[\s\S]*?<\/div>/g)];
  const errors = [];
  if (slides.length !== 14) errors.push(`expected 14 slides, got ${slides.length}`);
  if (cards.length !== 32) errors.push(`expected 32 exhibition cards, got ${cards.length}`);
  if (images.length !== 41) errors.push(`expected 41 images, got ${images.length}`);
  if (sources.length !== 32 || uniqueSources.size !== 32) errors.push(`expected 32 unique source links, got ${sources.length}/${uniqueSources.size}`);
  if (badImages.length) errors.push(`${badImages.length} invalid or undersized images`);
  if (hours.length !== 14) errors.push(`expected 14 opening-time blocks, got ${hours.length}`);
  for (const [index, block] of hours.entries()) {
    for (const day of ['Fri', 'Sat', 'Sun']) if (!block[0].includes(`<span>${day} `)) errors.push(`opening-time block ${index + 1} is missing ${day}`);
  }
  if (/Admission price not published/i.test(html)) errors.push('obsolete admission-price wording remains');
  if (!html.includes("addEventListener('keydown'")) errors.push('keyboard navigation missing');
  if (!html.includes('@media print')) errors.push('print layout missing');

  console.log(JSON.stringify({
    ok: errors.length === 0,
    slides: slides.map(m => m[1]),
    exhibitionCards: cards.length,
    sourceLinks: sources.length,
    embeddedImages: images.length,
    openingTimeBlocks: hours.length,
    imageWidthRange: [Math.min(...dimensions.map(d => d[0])), Math.max(...dimensions.map(d => d[0]))],
    imageHeightRange: [Math.min(...dimensions.map(d => d[1])), Math.max(...dimensions.map(d => d[1]))],
    errors,
    badImages,
  }, null, 2));
  if (errors.length) process.exit(1);
})();
