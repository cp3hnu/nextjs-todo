const lintStagedConfig = {
  "*.{js,jsx,ts,tsx}": ["npm run lint"],
  "*.{json,css,md}": ["npm run format-fix"],
};

export default lintStagedConfig;
