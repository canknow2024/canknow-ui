export default (value) => {
  if (value === null || value === undefined || value === '' || value === 0) {
    return value;
  }
  return Math.abs(value);
};
