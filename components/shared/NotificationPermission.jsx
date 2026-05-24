'use client'

import { useState, useEffect } from 'react'

export default function NotificationPermission() {
  const [status, setStatus] = useState('idle') // idle | requesting | subscribed | denied | unsupported

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setStatus('unsupported')
      return
    }
    if (Notification.permission === 'denied') {
      setStatus('denied')
      return
    }
    // Check if this device is already subscribed
    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription()
      if (!sub) return
      const res = await fetch(`/api/notifications?endpoint=${encodeURIComponent(sub.endpoint)}`)
      const data = await res.json()
      if (data.subscribed) setStatus('subscribed')
    })
  }, [])

  async function subscribe() {
    setStatus('requesting')
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') { setStatus('denied'); return }

      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
      })

      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      })
      setStatus('subscribed')
    } catch (e) {
      console.error('Push subscribe error:', e)
      setStatus('idle')
    }
  }

  async function unsubscribe() {
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch('/api/notifications', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      setStatus('idle')
    } catch (e) {
      console.error('Push unsubscribe error:', e)
    }
  }

  if (status === 'unsupported') return null

  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div>
        <p className="text-sm font-medium text-gray-700">일일 리마인더</p>
        {status === 'denied' && (
          <p className="text-[11px] text-orange-400 mt-0.5">브라우저 설정에서 알림을 허용해주세요</p>
        )}
        {status === 'subscribed' && (
          <p className="text-[11px] text-mint-dark mt-0.5">매일 아침 알림이 켜져 있어요</p>
        )}
      </div>

      {status === 'subscribed' ? (
        <button
          onClick={unsubscribe}
          className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full active:scale-95 transition-transform"
        >
          끄기
        </button>
      ) : status === 'denied' ? (
        <span className="text-xs text-gray-300">차단됨</span>
      ) : (
        <button
          onClick={subscribe}
          disabled={status === 'requesting'}
          className="text-xs font-semibold text-white bg-lavender px-3 py-1.5 rounded-full active:scale-95 transition-all disabled:opacity-60"
        >
          {status === 'requesting' ? '…' : '켜기'}
        </button>
      )}
    </div>
  )
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}
