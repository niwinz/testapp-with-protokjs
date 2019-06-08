import * as potok from "./potok.js";

export let state = {};
export const store = potok.store({state, onError})

function onError(error) {
  console.log("ERROR:", error);
}

export function emit(...events) {
  return store.push(...events);
}

store.subscribe(function(_state) {
  state = Object.freeze(_state);
  console.log("STATE:", _state);
});
