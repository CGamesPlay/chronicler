// @flow
// To handle IPC requests in an orderly fashion, we use a series of promises to
// indicate requests and responses.
//
// 1. Client installs window.ipcClient.advanceQueue function, which will return a
//    promise with the first request.
// 2. dom-ready event fires.
// 3. Server calls window.ipcClient.advanceQueue(null) to start the flow of
//    events.

type Request = {
  data: any,
  resolve: any => void,
  reject: any => void,
};

window.ipcClient = window.ipcClient || {};

const requestQueue: Array<Request> = [];
// Indicate that a new request is available in the queue.
let notifyRequest = window.ipcClient.firstRequest || ((request: any) => {});

// Deliver a response to the oldest request, and return a promise for the next
// request.
window.ipcClient.advanceQueue = (response: any): Promise<any> => {
  // The first "response" is actually just the initial call, so we discard it.
  if (response) {
    const oldRequest = requestQueue.shift();
    if (oldRequest) {
      if (response.error) oldRequest.reject(response.error);
      else oldRequest.resolve(response.data);
    }
  }
  if (requestQueue.length > 0) {
    return Promise.resolve(requestQueue[0].data);
  } else {
    return new Promise(resolve => {
      notifyRequest = resolve;
    });
  }
};

// This is necessary to prevent a memory leak of the server's listener.
window.addEventListener("beforeunload", () => {
  notifyRequest(null);
});

export const sendRequest = (data: any): Promise<any> => {
  if (!data) throw new Error("data cannot be null");
  return new Promise((resolve, reject) => {
    requestQueue.push({ data, resolve, reject });
    notifyRequest(data);
  });
};
