import { Cheerio, Element } from 'cheerio';
import { Image } from './model';

export async function catchPromiseError<T>(
  promise: Promise<T>
): Promise<[Error, undefined] | [undefined, T]> {
  try {
    return [undefined, await promise];
  } catch (e) {
    return [e, undefined];
  }
}

export function flatten<T>(items: T[][] = []): T[] {
  return ([] as T[]).concat(...items);
}

export function resolveUrl(from: string, to: string): string {
  const resolvedUrl = new URL(to, new URL(from, 'resolve://'));

  if (resolvedUrl.protocol === 'resolve:') {
    const { pathname, search, hash } = resolvedUrl;

    return pathname + search + hash;
  }

  return resolvedUrl.toString();
}

export function mapToAttribute<
  T extends Record<'attribs', Record<string, string>>
>(list: T[], attribute: string): string[] {
  return list.map((link) => link.attribs[attribute]);
}

export function resolveLinks(links: Cheerio<Element>, url: string): string[] {
  return mapToAttribute(links.toArray(), 'href')
    .filter((href) => /^http[s]/.test(href))
    .map((href) => resolveUrl(url, href));
}

export function resolveImages(
  images: Cheerio<Element>,
  url: string,
  depth: number
): Image[] {
  const imagesUrls = mapToAttribute(images.toArray(), 'src').map((href) =>
    resolveUrl(url, href)
  );

  return imagesUrls.map((imageUrl) => ({
    depth,
    imageUrl,
    sourceUrl: url,
  }));
}
