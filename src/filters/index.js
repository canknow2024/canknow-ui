import { importAllAsObject } from 'canknow-core/src/utils/moduleUtil';
export default importAllAsObject(require.context('.', false, /\.js$/));
