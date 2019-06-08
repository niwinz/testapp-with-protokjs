// ==========================
// == Actions
// ==========================

// Define the type of action
const ADD_TODO = 'ADD_TODO';

// This is how action looks:
{
  type: ADD_TODO,
  text: 'Build my first Redux app'
}

// You may want to have action creators
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  };
}

// ==========================
// == Reducers & Store
// ==========================
const initialState = {
  todos: [],
}

function mainReducer(state=initialState, action) {
  switch(action.type) {
  case ADD_TODO:
    return Object.assign({}, state, {
      todos: [...state.todos, {text: action.text, completed: false}]
    });
  default:
    return state;
  }
}

import { createStore } from 'redux'
const store = createStore(mainReducer);

// ==========================
// == Interacting with Store
// ==========================

store.subscribe(() => console.log(store.getState()))
store.dispatch(addTodo('Learn about actions'))
store.dispatch(addTodo('Learn about reducers'))
store.dispatch(addTodo('Learn about store'))
