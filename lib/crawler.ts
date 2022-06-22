import axios from 'axios';
import { load } from 'cheerio';
import {
  catchPromiseError,
  flatten,
  resolveImages,
  resolveLinks,
} from './utils';
import { writeFileSync } from 'fs';
import { Image } from './model';

async function getImages(url: string, depth = 0): Promise<Image[]> {
  const [error, response] = await catchPromiseError(axios.get(url));

  if (error) {
    console.error(`An error has occurred while fetching the URL: ${url}`);
    return [];
  }

  const $ = load(response.data);
  const links = resolveLinks($('a'), url);
  const images = resolveImages($('img'), url, depth);

  if (depth >= maxDepth) {
    return images;
  }

  const nestedImages = await Promise.all(
    links.map((href) => getImages(href, depth + 1))
  );

  return images.concat(flatten(nestedImages));
}

const [, , url, maxDepthString] = process.argv;

if (!url) {
  throw new Error('<URL> is not specified');
}

if (!maxDepthString) {
  throw new Error('<depth> is not specified');
}

const maxDepth = parseInt(maxDepthString);

if (Number.isNaN(maxDepth)) {
  throw new Error('<depth> is not a valid number');
}

const images = await getImages(url);

writeFileSync('result.json', JSON.stringify({ results: images }, null, 2));
