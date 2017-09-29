const dev = (process.env.NODE_ENV === 'development');

const getWindowSize = exports.getWindowSize = () => {
  let vWidth = (dev) ? 1024 : 400;
  let vHeight = (dev) ? 768 : 506;

  const isWin = /^win/.test(process.platform);

  if (isWin && !dev) {
    vWidth = 400;
    vHeight = 544;
  }

  return {vWidth, vHeight};
};
