# Bucharest exhibition editor: current map implementation

The map is a custom Leaflet implementation, not Google Maps. It has two closely related renderers: one inside the editor and another embedded into exported HTML/PDF decks.

Source: `outputs/bucharest-exhibitions-editor.html`

## 1. Dependencies

The editor loads:

```html
<link rel="stylesheet"
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">

<link rel="stylesheet"
      href="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css">

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js"></script>
```

Exports additionally load:

```html
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js"></script>
```

Internet access is therefore required for libraries, map tiles, unresolved geocoding, and non-embedded image URLs.

## 2. Project data model

The saved project has this shape:

```js
{
  version: 3,
  venues: [Venue, ...],
  detailMaps: [DetailMap, ...]
}
```

Relevant venue fields:

```js
{
  name: "Full slide/location name",
  mapLabel: "Optional shorter map name",
  address: "Displayed address",
  mapCoordinates: [latitude, longitude],
  mapOffset: { angle: radians } | null,
  exhibitions: [
    {
      images: ["first image used by map", ...]
    }
  ]
}
```

Relevant detail-map fields:

```js
{
  bounds: [
    [southLatitude, westLongitude],
    [northLatitude, eastLongitude]
  ],

  // Venue-array indexes included in this map.
  locationIndexes: [0, 3, 6],

  // One manual label position per venue.
  offsets: [
    null,
    { angle: radians },
    null
  ]
}
```

The default embedded data is repaired project 13: eight venues with fixed `mapCoordinates`. `/SAC @ Malmaison` and Recent Art Museum are not in that default dataset.

## 3. Location records generated for the map

Each venue becomes:

```js
{
  index: venueIndex,
  number: String(venueIndex + 1).padStart(2, "0"),
  name: venue.mapLabel.trim() || venue.name || "Untitled location",
  address: venue.address || combinedSubtitleAndAddress,
  coordinates: venue.mapCoordinates || null,
  photo: venue.exhibitions?.[0]?.images?.[0] || "",
  offset: venue.mapOffset || null,
  offsets: [
    venue.mapOffset || null,
    ...detailMaps.map(map => map.offsets?.[venueIndex] || null)
  ]
}
```

Numbers are derived from current slide order. Reordering location slides changes map numbers.

The map photo is always the first image from the first item on that location slide.

## 4. Coordinate resolution

Coordinate resolution follows this order:

1. Use `venue.mapCoordinates` if it is a valid two-number array.
2. Check `localStorage` for a previously resolved Photon result.
3. Query Photon using the cleaned address.
4. If that fails, query Photon using the location name.
5. Omit the location only if every method fails.

The primary query is:

```text
{address before the first " · "}, Bucharest, Romania
```

The fallback is:

```text
{venue name}, Bucharest, Romania
```

Geocoder endpoint:

```text
https://photon.komoot.io/api/?limit=1&q={encoded query}
```

Resolved coordinates are cached under:

```text
bucharest-map:{query}
```

An incrementing `mapRenderToken` prevents results from an obsolete asynchronous render from being inserted into a newer map.

## 5. Base map

Every map begins temporarily at:

```js
center = [44.4268, 26.1025]
zoom = 12
```

It is then automatically fitted, so this starting view should never determine the final output.

The base layer is Esri satellite imagery:

```text
https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
```

A separate, quiet labels-only pane is placed above it:

```text
https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}
```

Label-pane configuration:

```js
zIndex: 350
pointerEvents: "none"
opacity: 0.72
maxZoom: 19
```

The World Transportation overlay is not used.

Attribution controls are disabled. A metric scale is placed at the top right:

```js
L.control.scale({
  position: "topright",
  metric: true,
  imperial: false,
  maxWidth: 90 // editor; 100 in exports
})
```

The editor has ordinary Leaflet zoom and pan controls. Zoom level and pan position are not persisted; every render recalculates the view automatically. Exported maps hide the zoom controls.

## 6. Map 1 versus detail maps

Map 1 is always generated.

For Map 1:

```js
visibleLocations =
  detailEditMode
    ? allLocations
    : locationsNotAssignedToAnyDetailMap
```

For Map 2 and later:

```js
visibleLocations =
  locationsAssignedToThatDetailMap
```

Map 1 displays each detail-map boundary as a translucent rectangle with:

```text
See Map N for locations
```

When detail-map editing starts, Map 1 temporarily shows all locations. When editing ends, detail-map locations are hidden from Map 1 again.

Removing a detail map deletes only the detail-map definition. Its locations remain in the venue array and consequently return to Map 1.

## 7. Creating a detail map

The user draws a Leaflet.Draw rectangle on Map 1.

The editor:

1. Finds all location coordinates contained by the drawn rectangle.
2. Rejects the rectangle if it contains no locations.
3. Discards the approximate hand-drawn boundary.
4. Calculates the exact bounding box of the selected locations.
5. Adds 10% geographic padding using `bounds.pad(0.1)`.
6. Stores the selected venue indexes and tightened bounds.
7. Creates a separate map slide.

For a single-location detail map, the point is first expanded by ±0.003 degrees in both axes, then padded.

Editing a detail rectangle repeats the selection and tightening process.

## 8. Marker construction

Each Leaflet marker is an HTML `L.divIcon`:

```html
<div class="map-location-marker side-right">
  <span class="map-location-number">01</span>

  <span class="map-location-tail">
    <span class="map-location-label">
      <strong class="map-location-name">Location name</strong>
    </span>

    <span class="map-location-photo">
      <img>
    </span>
  </span>
</div>
```

Preview icon configuration:

```js
L.divIcon({
  className: "map-location-icon",
  iconSize: [230, 46],
  iconAnchor: [14, 14]
})
```

The number is the geographic anchor. The name and photograph form one movable “tail” attached to it.

The address is retained in the data but there are no expanding popups.

## 9. Marker styling and layers

Preview photograph:

```css
width: 46px;
height: 46px;
border-radius: 50%;
clip-path: circle(50%);
object-fit: cover;
object-position: 50% 50%;
```

Export photograph size is 54 × 54 px.

Layer order:

```text
location name: z-index 30
number:        z-index 20
photograph:    z-index 20
```

The location name has no rectangular background. It uses a four-pixel white text stroke:

```css
-webkit-text-stroke: 4px rgba(255,255,255,.96);
paint-order: stroke fill;
```

This produces the white blob-like outline.

The rendered width is measured using `Range.getClientRects()`. The width is set to the longest rendered line, capped at:

```text
135 px in the editor
145 px in exports
```

## 10. Automatic left/right placement

Without a manual angle, every marker gets two candidates:

```text
number → name → image
image → name → number
```

For 18 locations or fewer, the code tests every possible left/right combination:

```text
2^numberOfLocations
```

Candidate scoring is:

```js
score =
  outOfBoundsPixels * 10000
  + totalPairwiseOverlapArea
```

The combination with the lowest score is selected.

For more than 18 locations, it switches to a greedy calculation because exhaustive `2^N` evaluation becomes too expensive.

This is side selection only. It is not a general-purpose collision solver.

## 11. Manual pivoting

Dragging either the number or the name/photo tail starts manual placement.

During dragging:

1. The marker’s visual stacking level is temporarily raised.
2. Leaflet map panning is disabled.
3. The cursor angle around the number centre is calculated:

```js
angle = Math.atan2(
  cursorY - numberCenterY,
  cursorX - numberCenterX
)
```

Only this angle is saved.

Given:

```js
unitX = Math.cos(angle)
unitY = Math.sin(angle)
```

The side is:

```js
side = unitX >= 0 ? "right" : "left"
```

The code determines where a ray from the number intersects the text rectangle:

```js
textRayRadius = Math.min(
  Math.abs(unitX) > 1e-6 ? textHalfWidth  / Math.abs(unitX) : Infinity,
  Math.abs(unitY) > 1e-6 ? textHalfHeight / Math.abs(unitY) : Infinity
)
```

The text centre is positioned at:

```js
distance = numberRadius + textRayRadius - 1

targetX = numberCenterX + unitX * distance
targetY = numberCenterY + unitY * distance
```

The `-1` produces one pixel of overlap.

The photograph is not included in the pivot calculation. It moves as part of the tail after the text position is calculated.

At pointer release or cancellation, map panning is re-enabled and the angle is marked as an unsaved project change.

## 12. Detail-map editing appearance

While selecting or editing a detail-map area on Map 1:

```css
location-name opacity: 0.5
location-photo display: none
```

Numbers remain fully visible.

This state is temporary and is not used in exports.

## 13. Automatic map dimensions

Map slides do not use the fixed 16:9 location-slide dimensions.

The initial aspect ratio is calculated from geographic bounds:

```js
latitude = (south + north) / 2
height = Math.max(1e-6, north - south)
width = Math.max(
  1e-6,
  (east - west) * Math.cos(latitude * Math.PI / 180)
)

aspect = clamp(width / height, 0.55, 3)
```

Editor sizing:

```css
.preview-wrap.map-preview-dynamic {
  aspect-ratio: var(--map-aspect);
  width: min(
    100%,
    calc((100vh - 145px) * var(--map-aspect))
  );
}
```

Export sizing:

```css
.map-slide {
  width: min(100vw, calc(100vh * var(--map-aspect)));
  height: min(100vh, calc(100vw / var(--map-aspect)));
  margin: auto;
}
```

Thus the slide is allowed to range from approximately 0.55:1 to 3:1.

## 14. Rendered-content fitting

Geographic point bounds alone do not account for the large HTML labels and photographs. The implementation therefore performs a second pixel-aware fitting stage.

Algorithm:

1. Fit the geographic location bounds with 10–12 px padding.
2. Arrange marker sides and manual offsets.
3. Read each number, name, photograph, and detail-area label using `getBoundingClientRect()`.
4. Calculate their leftmost, topmost, rightmost, and bottommost pixel coordinates.
5. Convert those container pixels back to latitude/longitude using `map.containerPointToLatLng([x, y])`.
6. Extend the geographic bounds with those converted points.
7. Calculate the Leaflet zoom needed to contain the result:

```js
map.getBoundsZoom(contentBounds, false, [padding, padding])
```

8. Recenter and apply that zoom.
9. Repeat four times, with roughly 45 ms between passes.
10. Measure the complete rendered content’s width/height.
11. Update `--map-aspect`.
12. Invalidate the Leaflet size and run the fit again once.

Maximum automatic zoom is 18. A single-point map initially uses zoom 17.

Map 1’s base bounds include visible locations and all detail-map rectangles. Detail-map bounds come from their contained locations.

## 15. Reset behavior

**Reset maps** performs:

```js
detailMaps = []

for every venue:
  venue.mapOffset = null

detailEditMode = false
current slide = Map 1
```

It does not delete venues, exhibitions, addresses, photographs, or fixed coordinates.

## 16. Persistence

Saving produces:

```js
JSON.stringify({
  version: 3,
  venues: state,
  detailMaps
}, null, 2)
```

This preserves:

- Fixed `mapCoordinates`
- Map labels
- Main-map angles
- Detail-map angles
- Detail-map membership
- Detail-map bounds

It does not preserve interactive Leaflet pan or zoom state.

Loading accepts either:

```js
{ venues: [...], detailMaps: [...] }
```

or a legacy top-level venue array.

Detail-map offset arrays are truncated or extended to match the current venue count.

## 17. HTML export

The export generates one ordinary slide per venue, followed by:

```text
Map 1
Map 2
Map 3
...
```

It embeds:

```js
window.MAP_LOCATIONS = [...]
window.MAP_DETAILS = [...]
```

The export reconstructs all Leaflet maps from those arrays.

Final exported layers are:

- Esri World Imagery
- Esri World Boundaries and Places labels
- Metric scale
- Custom numbered HTML markers
- Detail-area overlays on Map 1

Export removes:

- Leaflet attribution control
- Zoom controls
- Editor buttons
- Leaflet.Draw tools
- Editing-mode opacity
- Interactive label dragging

One implementation discrepancy remains: the editor primarily uses stored `locationIndexes` for detail-map membership, while export membership is determined geometrically from the stored detail-map bounds. Because boundaries are automatically tightened around selected locations, they normally produce the same result.

## 18. PDF export

PDF generation occurs inside a temporary exported-deck window.

For every slide:

1. Make that slide active.
2. If it contains a map, invalidate the Leaflet size.
3. Run the rendered-content fitting algorithm.
4. Wait 800 ms.
5. Wait up to six seconds for map tiles.
6. Wait for slide images.
7. Capture the slide with `html2canvas`.
8. Embed the PNG in a PDF page using PDF-Lib.

Capture scale:

```js
scale = clamp(2400 / slidePixelWidth, 1, 2)
```

PDF dimensions:

```js
pageWidthPoints  = slidePixelWidth  * 0.75
pageHeightPoints = slidePixelHeight * 0.75
```

This preserves the individually calculated aspect ratio of every map page.
