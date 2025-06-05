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
  try {
    console.log("Recebido em subscribeUser:", sub);

    if (!sub || !sub.endpoint) throw new Error("Inscrição inválida");

    await saveSubscription(sub);
    return { success: true };
  } catch (err) {
    console.error("Erro em subscribeUser:", err);
    throw err;
  }
}

export async function unsubscribeUser(endpoint) {
  try {
    console.log("Recebido em unsubscribeUser:", endpoint);

    if (!endpoint || typeof endpoint !== 'string') {
      throw new Error("Endpoint inválido");
    }

    await deleteSubscription(endpoint);
    return { success: true };
  } catch (err) {
    console.error("Erro em unsubscribeUser:", err);
    throw err;
  }
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
