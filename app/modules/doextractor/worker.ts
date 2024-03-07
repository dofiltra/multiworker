declare var self: Worker;

self.addEventListener("message", (event) => {
  console.log('worker.ts: "message"', event.data);
});

postMessage("worker.ts: 1");
