const workerURL = new URL("worker.ts", import.meta.url).href;
const worker = new Worker(workerURL);

worker.addEventListener("open", () => {
  console.log("worker is ready");
});
worker.addEventListener("close", (event) => {
  console.log("worker is being closed");
});
worker.addEventListener("message", (event) => {
  console.log(event.data);
});

worker.postMessage("Sent from main thread!");
