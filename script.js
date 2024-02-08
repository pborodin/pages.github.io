console.log('Hello!');

// Global vars to cache event state
const evCache = [];
let prevDiff = -1;
let el 


function init() {
  // Install event handlers for the pointer target
  el = document.getElementById("svg");
  el.onpointerdown = pointerdownHandler;
  el.onpointermove = pointermoveHandler;

  // Use same handler for pointer{up,cancel,out,leave} events since
  // the semantics for these events - in this app - are the same.
  el.onpointerup = pointerupHandler;
  el.onpointercancel = pointerupHandler;
  el.onpointerout = pointerupHandler;
  el.onpointerleave = pointerupHandler;
}

function pointerdownHandler(ev) {
  // The pointerdown event signals the start of a touch interaction.
  // This event is cached to support 2-finger gestures
  evCache.push(ev);
  console.log("pointerDown", ev);
}

function pointermoveHandler(ev) {
  ev.preventDefault()
  if(el) el.setPointerCapture(ev.pointerId);
  // This function implements a 2-pointer horizontal pinch/zoom gesture.
  //
  // If the distance between the two pointers has increased (zoom in),
  // the target element's background is changed to "pink" and if the
  // distance is decreasing (zoom out), the color is changed to "lightblue".
  //
  // This function sets the target element's border to "dashed" to visually
  // indicate the pointer's target received a move event.
  log("pointerMove", ev);
  ev.target.style.border = "dashed";

  // Find this event in the cache and update its record with this event
  const index = evCache.findIndex(
    (cachedEv) => cachedEv.pointerId === ev.pointerId,
  );
  evCache[index] = ev;

  // If two pointers are down, check for pinch gestures
  if (evCache.length === 2) {
    // Calculate the distance between the two pointers
    const curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);

    if (prevDiff > 0) {
      if (curDiff > prevDiff) {
        // The distance between the two pointers has increased
        log("Pinch moving OUT -> Zoom in", ev);
        ev.target.style.background = "pink";
      }
      if (curDiff < prevDiff) {
        // The distance between the two pointers has decreased
        log("Pinch moving IN -> Zoom out", ev);
        ev.target.style.background = "lightblue";
      }
    }

    // Cache the distance for the next move event
    prevDiff = curDiff;
  }
}

function removeEvent(ev) {
  // Remove this event from the target's cache
  const index = evCache.findIndex(
    (cachedEv) => cachedEv.pointerId === ev.pointerId,
  );
  evCache.splice(index, 1);
}


function pointerupHandler(ev) {
  console.log(ev.type, ev);
  // Remove this pointer from the cache and reset the target's
  // background and border
  removeEvent(ev);
  ev.target.style.background = "white";
  ev.target.style.border = "1px solid black";

  // If the number of pointers down is less than two then reset diff tracker
  if (evCache.length < 2) {
    prevDiff = -1;
  }
}


function log(prefix, ev) {
  const log = document.getElementById("log");
  const s =
    `${prefix}:<br>` +
    `  pointerID   = ${ev.pointerId}<br>` +
    `  pointerType = ${ev.pointerType}<br>` +
    `  isPrimary   = ${ev.isPrimary}`;
    log.innerHTML = `${s}<br>`;
}



init()
