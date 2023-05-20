const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/*

Could not find stylesheet to update. Add the following imports to your stylesheet (e.g. styles.css):

@tailwind components;
@tailwind base;
@tailwind utilities;

*/

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
