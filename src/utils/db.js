import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), 'push_subscriptions.json');

export async function loadSubscriptions() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return []; // se não existir ainda
  }
}

export async function saveSubscription(newSub) {
  const subs = await loadSubscriptions();

  const exists = subs.some((s) => s.endpoint === newSub.endpoint);
  if (!exists) {
    subs.push(newSub);
    await fs.writeFile(DB_PATH, JSON.stringify(subs, null, 2), 'utf-8');
  }

  return true;
}

export async function deleteSubscription(endpoint) {
  const subs = await loadSubscriptions();
  const filtered = subs.filter((s) => s.endpoint !== endpoint);
  await fs.writeFile(DB_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}

export async function getAllSubscriptions() {
  return await loadSubscriptions();
}
