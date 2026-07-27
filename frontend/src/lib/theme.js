export const PRESETS = {
  indigo: { light: '#4F6EF7', dark: '#4F6EF7' },
  teal:   { light: '#0F6E56', dark: '#2DD4BF' },
  coral:  { light: '#D85A30', dark: '#D85A30' },
  slate:  { light: '#24292F', dark: '#94A3B8' },
};

export function resolveAccentColor(preset, mode) {
  return PRESETS[preset]?.[mode] ?? PRESETS.indigo[mode];
}
