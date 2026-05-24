// Custom service worker code — merged into sw.js by next-pwa at build time

// Show notification when push arrives
self.addEventListener('push', (event) => {
  if (!event.data) return

  let payload
  try {
    payload = event.data.json()
  } catch {
    payload = { title: 'MeowMind 🐱', body: event.data.text() }
  }

  const { title = 'MeowMind 🐱', body = '', url = '/', icon, badge } = payload

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: icon ?? '/icons/icon-192x192.png',
      badge: badge ?? '/icons/icon-96x96.png',
      data: { url },
      vibrate: [100, 50, 100],
    })
  )
})

// Open or focus the app when notification is tapped
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = event.notification.data?.url ?? '/'

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes(self.registration.scope) && 'focus' in client) {
            client.navigate(targetUrl)
            return client.focus()
          }
        }
        if (clients.openWindow) return clients.openWindow(targetUrl)
      })
  )
})
