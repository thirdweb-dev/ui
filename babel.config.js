module.exports = {
  presets: [
    "@babel/preset-typescript",
    "@babel/preset-react",
    [
      "@babel/preset-env",
      {
        bugfixes: true,
        loose: true,
        targets: "> 1%, not dead, not ie 11, not op_mini all",
      },
    ],
  ],
};
