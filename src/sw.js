import { precacheAndRoute } from 'workbox-precaching'

// This will be injected by vite-plugin-pwa
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body } = event.data.payload;
    self.registration.showNotification(title, {
      body: body,
      icon: '/pwa-192x192.png' // Optional icon
    });
  }
});
