import { put, takeEvery, all } from 'redux-saga/effects'

const delay = (ms) => new Promise(res => setTimeout(res, ms))

function* helloSaga() {
  console.log('Hello Sagas!')
}

function* addTodoAsync(action) {
  yield delay(1000); // Simulate async stuff
  yield put({ type: 'ADD_TODO', action.payload.text })
}

function* watchIncrementAsync() {
  yield takeEvery('ADD_TODO_ASYNC', addTodoAsync);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    helloSaga(),
    watchIncrementAsync()
  ])
}

// =================================
// == Interacting Redux with Sagas
// =================================

import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

store.dispatch({type: "ADD_TODO_ASYNC", text: "foobar"});
