# Image crawler
This is a simple image crawler written with node.js.

# Installation
Run `yarn` to install the packages.

# Build and run
In order to run the crawler, follow the below steps:
- run `yarn build`;
- run `yarn test <URL> <depth>`

Given a URL, the crawler will scan the webpage for any images,
continue to every link inside that page and scan it as well.

The crawling will stop once `<depth>` is reached.

The results will be saved to `result.json` file.
