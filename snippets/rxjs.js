const { fromEvent } = rxjs;
const { bufferCount, map } = rxjs.operators;

// Definition

const clicks = (
  fromEvent(document, "keypress").pipe(
    map((event) => event.key),
    bufferCount(2,1)
  )
);

// Suscription

clicks.subscribe(x => console.log(x));
// => ["a", "a"]
// => ["a", "s"]
// => ["s", "d"]
// => ["d", "f"]
// => ["f", "g"]
// => ["g", "h"]
