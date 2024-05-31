export default function(value){
  if (null == value || value === ''){
    return '0';
  }
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let index = 0;
  const sourceSize = parseFloat(value);
  index = Math.floor(Math.log(sourceSize) / Math.log(1024));
  let size = sourceSize / Math.pow(1024, index);
  size = size.toFixed(2);
  return size + units[index];
}
