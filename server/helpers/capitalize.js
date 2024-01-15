module.exports = (str) =>
  str
    .split('')
    .map((x, i) => (i === 0 ? x.toUpperCase() : x.toLowerCase()))
    .join('')
