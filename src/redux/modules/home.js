/* eslint-disable no-case-declarations */
const initState = {
  list: [],
  customIndex: null,
  customList1: [],
  customList: [],
};

export default function reducer(state = initState, action) {
  const { type, payload = {} } = action;
  let newState = JSON.parse(JSON.stringify(state));
  switch (type) {
    case 'SAVE_HOME':
      newState = {
        ...newState,
        ...payload,
      };
      break;
    case 'INIT_DATA':
      newState = {
        ...newState,
        ...payload,
      };
      break;

    default:
      break;
  }
  return newState;
}
