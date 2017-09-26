import { resolveIconUrl } from './resolveIconUrl';

export function resolveIconSource(icon) {
  const iconUrl = resolveIconUrl(icon);
  return iconUrl ? { uri: iconUrl } : undefined;
}
