import * as rx from "rxjs"
import * as rxop from "rxjs/operators";
import * as util from "./util.js";

const EVENT_SYM = Symbol("potok:event");
const IS_UPDATE = Symbol("potok:is-update");
const IS_WATCH = Symbol("potok:is-watch");
const IS_EFFECT = Symbol("potok:is-effect");

export function isUpdate(event) {
  if (!util.isDefined(event)) return false;
  if (util.isFunction(event)) return true;
  return !!event[IS_UPDATE];
}

export function isWatch(event) {
  if (!util.isDefined(event)) return false;
  return !!event[IS_WATCH];
}

export function isEffect(event) {
  if (!util.isDefined(event)) return false;
  return !!event[IS_EFFECT];
}

export class Event {
  static new(params) {
    return new Event(param);
  }

  constructor(params) {
    this.params = params;
    this[EVENT_SYM] = true;

    if (util.isFunction(this.update)) {
      this[IS_UPDATE] = true;
    }
    if (util.isFunction(this.watch)) {
      this[IS_WATCH] = true;
    }
    if (util.isFunction(this.effect)) {
      this[IS_EFFECT] = true;
    }
  }
}

export function store(options={}) {
  const state = options.state || null;
  const onError = options.onError || util.noop;

  const inputSubject = new rx.Subject();
  const stateSubject = new rx.BehaviorSubject(state);

  const handleError = (error) => {
    onError(error);
    return rx.throwError(error);
  };

  // inputSubject.subscribe(function(event) {
  //   console.log("INPUT_SUBJECT", event);
  // });

  const stateStream = inputSubject.pipe(
    rxop.filter(isUpdate),
    rxop.scan((state, event) => {
      if (util.isFunction(event)) {
        return event(state);
      } else {
        return event.update(state)
      }
    }, state),
    rxop.catchError(handleError),
    rxop.retry(Number.MAX_SAFE_INTEGER)
  )
  const watchStream = inputSubject.pipe(
    rxop.filter(isWatch),
    rxop.withLatestFrom(stateSubject, stateSubject),
    rxop.flatMap(([event, state]) => event.watch(state, inputSubject)),
    rxop.catchError(handleError),
    rxop.retry(Number.MAX_SAFE_INTEGER)
  );

  const effectStream = inputSubject.pipe(
    rxop.filter(isEffect),
    rxop.withLatestFrom(stateSubject, stateSubject),
    rxop.tap(([event, state]) => event.effect(state, inputSubject)),
    rxop.catchError(handleError),
    rxop.retry(Number.MAX_SAFE_INTEGER)
  );

  const subs = stateStream.subscribe(stateSubject);
  const subw = watchStream.subscribe(inputSubject);
  const sube = effectStream.subscribe(util.noop);

  return {
    push(...events) {
      events.forEach(o => inputSubject.next(o));
    },

    subscribe(observer) {
      return stateSubject.subscribe(observer);
    },

    close() {
      subs.unsubscribe();
      subw.unsubscribe();
      sube.unsubscribe();
      inputSubject.complete();
    }
  };
}
