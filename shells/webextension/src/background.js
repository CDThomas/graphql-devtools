// Note have to use persistent=true in manigest to use webRequest API

function logURL(requestDetails) {
  console.log("Loading: " + requestDetails.url);
}

function logAll(label) {
  return function(...args) {
    console.log(label);
    console.log(args);
  };
}

// Can naively collect these into something that looks like
// reqs = {
//   "227976": [reqHeaders, reqBody, respHeaders],
//   "228542": [reqHeaders, reqBody, respBodyHeaders],
//   [reqId]: [reqHeaders, reqBody, respBodyHeaders]
// }

// And then send to Electron app once respHeaders have been added.

// Or could do the simplest case first and only send reqHeaders to Electron app
// and then build on that.

// After that works, can looks into obersables.
// See:
// - http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-mergeScan
// - https://frontendmasters.com/courses/asynchronous-javascript/
// - https://frontendmasters.com/courses/rethinking-async-js/

// Note: Will need to parse `requestBody.raw`.
//       See:
//       - https://stackoverflow.com/questions/33106709/chrome-webrequest-doesnt-see-post-data-in-requestbody
//       - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest#Additional_objects
chrome.webRequest.onBeforeRequest.addListener(
  logAll("onBeforeRequest"),
  {
    urls: ["*://*/graphql"]
  },
  ["requestBody"]
);

chrome.webRequest.onSendHeaders.addListener(
  logAll("onSendHeaders"),
  {
    urls: ["*://*/graphql"]
  },
  ["requestHeaders"]
);

// Note: In Chrome you can't get the response body, but in FF you can with
//       `browser.webRequest.filterResponseData()`.
//       See:
//       - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/filterResponseData
//       - https://bugs.chromium.org/p/chromium/issues/detail?id=487422
chrome.webRequest.onCompleted.addListener(
  logAll("onCompleted"),
  {
    urls: ["*://*/graphql"]
  },
  ["responseHeaders"]
);
