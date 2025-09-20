// List of default avatar image URLs
export const DEFAULT_AVATARS = [
  '/assets/avatar1.png',
  '/assets/avatar2.png',
  '/assets/avatar3.png',
];

export function getRandomAvatar() {
  const idx = Math.floor(Math.random() * DEFAULT_AVATARS.length);
  return DEFAULT_AVATARS[idx];
}
