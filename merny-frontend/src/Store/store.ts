import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../Reducers/MainReducer';

const store = createStore(reducer, {}, applyMiddleware(thunk));

export type TStore = ReturnType<typeof store.getState>;

console.log(store.getState());
store.subscribe(() => console.log(store.getState()))

export default store;