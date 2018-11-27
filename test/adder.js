module.exports = function add(a, b) {
  if (typeof a !== 'number') {
    throw new Error(':(');
  }
  if (typeof b !== 'number') {
    throw new Error(':(');
  }

  return a + b;
};
