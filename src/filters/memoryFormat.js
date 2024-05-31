export default function(value) {
  if (value >= 1024 * 1024 * 1024 * 1024) {
    return (value / (1024 * 1024 * 1024 * 1024)).toFixed(2) + 'T';
  }
  else if (value >= 1024 * 1024 * 1024) {
    return (value / (1024 * 1024 * 1024)).toFixed(2) + 'G';
  }
  else if (value >= 1024 * 1024) {
    return (value / (1024 * 1024)).toFixed(2) + 'M';
  }
  else {
    return value.toFixed(2) + 'B';
  }
}
