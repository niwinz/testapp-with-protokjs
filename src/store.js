import * as potok from "./potok.js";

export let state = {};
export let store = null;

export function init(state) {
  store = potok.store({state, onError})
  return store;
}

function onError(error) {
  console.log("ERROR:", error);
}

export function emit(...events) {
  return store.push(...events);
}

