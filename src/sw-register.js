/* eslint-disable */
function isHttps() {
  return window.location.protocol === 'https:';
}

function isLocalhost() {
  return Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );
}

function registerValidSW(swUrl) {
  // https://stackoverflow.com/questions/37691011/update-ui-when-service-worker-installed-successfully?rq=1
  navigator.serviceWorker.register(swUrl).then((reg) => {
    reg.onupdatefound = () => {
      const installingWorker = reg.installing

      installingWorker.onstatechange = function () {
        switch (installingWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              console.log('New or updated content is available.');
              const event = document.createEvent('Event');
              event.initEvent('sw.update', true, true);

              window.dispatchEvent(event);
            } else {
              console.log('Content is now available offline!');
            }
            break;
          case 'redundant':
            console.error('The installing service worker became redundant.');
            break;
        }
      }
    }
  }).catch(error => console.error('Error during service worker registration:', error));
}

function register() {
  window.addEventListener('load', () => {
    if ('serviceWorker' in navigator
      && process.env.NODE_ENV === 'production'
      && (isHttps() || isLocalhost())
    ) {
      const swUrl = '/sw.js';
      registerValidSW(swUrl);
    }
  })
}

register();

// export function unregister() {
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.getRegistrations().then(registrations => {
//       registrations.forEach(instance => instance.unregister())
//     })
//   }
// }
