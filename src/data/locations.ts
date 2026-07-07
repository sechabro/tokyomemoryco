// ────────────────────────────────────────────────────────────────────────────
//  Calendar gallery — one photo per month.
//
//  The Calendar page shows every entry that has a matching image in
//  src/assets/calendar/, newest first. Add an entry here and drop the image in
//  that folder. The description is rendered as e.g. "June 2025, Lisbon, Portugal".
//
//  The entries below are EXAMPLES that match the bundled placeholder images
//  (2025-01.jpg … 2025-12.jpg). Replace the locations with real ones, and add
//  new months as you go. An entry whose image isn't present yet is skipped, so
//  you can stage future months without showing them.
// ────────────────────────────────────────────────────────────────────────────

export interface LocationEntry { // 1–12
  location: string; // shown after the month, e.g. "Lisbon, Portugal"
  file: string; // filename in src/assets/locations/
  description: string; // description of location
}

export const location: LocationEntry[] = [
  { location: "You Choose", file: "2025-07.jpg", description: "You pick your favorite neighborhood within Tokyo's 23 wards. We'll meet you there and do the shoot!" },
  { location: "Ueno", file: "2025-08.jpg", description: "Ueno showcases a beautiful juxtaposition of old-school Tokyo grit and natural textures. From the bustling, neon-lit underpasses of Ameyoko market to the soft, diffused light filtering through the giant trees of Ueno Park, this location offers incredible tonal variety and depth. We recommend a two-hour shoot here." },
  { location: "Asakusa", file: "2025-09.jpg", description: "Asakusa is timeless atmosphere and traditional textures. The historic, narrow side streets, and classic Showa-era low-rise storefronts offer a highly cinematic backdrop for your shoot." },
  { location: "Shinjuku", file: "2025-10.jpg", description: "High-contrast urban corridors, cinematic neon reflections, and endless energy. Ideal for dramatic evening sessions and gritty street style." },
  { location: "Harajuku", file: "2025-11.jpg", description: "A bright combination of subcultures, shifting from the bright, high-energy fashion of Takeshita Dori to the towering, quiet forest borders near Meiji-Jingu Shrine." },
  { location: "Shibuya", file: "2025-12.jpg", description: "From the world-reknown Shibuya Crossing to old-world charm of Nonbei Yokocho, Shibuya is a canvas for dramatic street portraiture. Day or night, but definitely night! Intense neon signs, massive digital displays, and even bigger crowds."},

  // Stage future months here — they appear once the image exists in the folder:
  // { year: 2026, month: 1, location: 'Somewhere new', file: '2026-01.jpg' },
];
