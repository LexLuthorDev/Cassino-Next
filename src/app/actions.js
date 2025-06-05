'use server';

import webpush from 'web-push';
import {
  saveSubscription,
  deleteSubscription,
  getAllSubscriptions,
} from '../utils/db'; // ajuste o caminho conforme necessário

webpush.setVapidDetails(
  'mailto:lexluthordevfull@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function subscribeUser(sub) {
  await saveSubscription(sub);
  return { success: true };
}

export async function unsubscribeUser() {
  // Neste caso, não temos o endpoint na chamada, então não fazemos nada
  await deleteSubscription();
  return { success: true };
}

export async function sendNotification(message) {
  const subs = await getAllSubscriptions();

  const results = [];

  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        sub,
        JSON.stringify({
          title: 'Test Notification',
          body: message,
          icon: '/icon1.png',
          badge: '/icon1.png',
        })
      );
      results.push({ endpoint: sub.endpoint, status: 'ok' });
    } catch (error) {
      results.push({ endpoint: sub.endpoint, status: 'fail' });
    }
  }

  return { success: true, results };
}
