/** Kenney Furniture Kit `bookcaseOpen` native bounds (CC0, www.kenney.nl). */

export const CASE_SCALE = 1.22;

export const KENNEY_CENTER = { x: -2, y: 4.4, z: 1.25 };

/** Usable plank tops in Kenney space, top → bottom rows (ids 1–6, 7–12, 13–17). */
export const KENNEY_PLANK_TOPS = [6.1, 3.7, 1.3] as const;

/** Underside of the plank above each row (opening height = 2.1 native). */
export const KENNEY_OPENING_CEILINGS = [8.2, 5.8, 3.4] as const;

export const KENNEY_INNER_X = { min: -3.8, max: -0.2 };
export const KENNEY_INNER_Z = { min: 0.2, max: 2.3 };

export const SIDE_INSET = 0.1;
export const BACK_GAP = 0.05;
export const SIT_EPSILON = 0.006;
export const BOOK_GAP = 0.045;

export const PULL_DISTANCE = 1.08;
export const HOVER_PULL = 0.13;
export const PULL_DURATION_MS = 560;
export const PUSH_DURATION_MS = 500;

export function kenneyToWorld(
  x: number,
  y: number,
  z: number,
): [number, number, number] {
  return [
    (x - KENNEY_CENTER.x) * CASE_SCALE,
    (y - KENNEY_CENTER.y) * CASE_SCALE,
    (z - KENNEY_CENTER.z) * CASE_SCALE,
  ];
}

export const SHELF_TOPS: [number, number, number] = [
  kenneyToWorld(0, KENNEY_PLANK_TOPS[0], 0)[1],
  kenneyToWorld(0, KENNEY_PLANK_TOPS[1], 0)[1],
  kenneyToWorld(0, KENNEY_PLANK_TOPS[2], 0)[1],
];

export const SHELF_CEILINGS: [number, number, number] = [
  kenneyToWorld(0, KENNEY_OPENING_CEILINGS[0], 0)[1],
  kenneyToWorld(0, KENNEY_OPENING_CEILINGS[1], 0)[1],
  kenneyToWorld(0, KENNEY_OPENING_CEILINGS[2], 0)[1],
];

export const INNER_X_MIN = kenneyToWorld(KENNEY_INNER_X.min, 0, 0)[0];
export const INNER_X_MAX = kenneyToWorld(KENNEY_INNER_X.max, 0, 0)[0];
export const BACK_Z = kenneyToWorld(0, 0, KENNEY_INNER_Z.min)[2];
export const FRONT_Z = kenneyToWorld(0, 0, KENNEY_INNER_Z.max)[2];

export function easeOutCubic(t: number) {
  const u = Math.min(1, Math.max(0, t));
  return 1 - (1 - u) ** 3;
}

export function easeInOutCubic(t: number) {
  const u = Math.min(1, Math.max(0, t));
  return u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2;
}
