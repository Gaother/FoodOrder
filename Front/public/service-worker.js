console.log('Service worker initializing...');

self.addEventListener('install', function(event) {
    console.log('Service worker installed:', event);
});

self.addEventListener('activate', function(event) {
    console.log('Service worker activated:', event);
});

self.addEventListener('push', function(event) {
    console.log('Push event received:', event);
    const data = event.data.json();
    console.log('Push event data:', data);
    const options = {
        body: data.body,
        icon: '/icon.png',
        badge: '/badge.png',
        data: {
            url: 'google.fr' // Assurez-vous que l'URL est incluse dans les données de la notification
        }
    };
    console.log('Notification options:', options);
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
    console.log('Notification shown with title:', data.title);

    // Envoyer un message aux clients
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'PUSH_NOTIFICATION',
                    data: data
                });
            });
        })
    );
});

self.addEventListener('notificationclick', function(event) {
    console.log('Notification click event received:', event);
    event.notification.close();
    console.log('Notification closed');
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
    console.log('Window opened with URL:', event.notification.data.url);
});

console.log('Service worker initialized.');