import { QdrantClient } from '@qdrant/js-client-rest';
import dotenv from 'dotenv';
dotenv.config({ path: "../.env" });

export function createClient() {
  return new QdrantClient({ url: process.env.QDRANT_URL, apiKey: process.env.QDRANT_API_KEY });
}

export async function deleteCollection(client, collectionName) {
  return client.deleteCollection(collectionName);
}

export async function createCollection(client, collectionName) {
  await client.createCollection(collectionName, { vectors: { size: 1536, distance: 'Cosine', on_disk: false} });
}

export async function isCollectionExists(client, collectionName) {
  const { collections } = await client.getCollections();
  return collections.findIndex(({ name }) => name === collectionName) >= 0;
}

export async function isEmptyCollection(client, collectionName) {
  const { points_count } = await client.getCollection(collectionName);
  return !points_count;
}

export async function upsertItems(client, collectionName, items) {
  await client.upsert(collectionName, {
    wait: true,
    batch: {
      ids: items.map(({ id }) => id),
      vectors: items.map(({ vector }) => vector),
      payloads: items.map(({ payload }) => payload),
    },
  });
}

export async function searchItem(client, collectionName, queryEmbedding) {
  const search = await client.search(collectionName, {
    vector: queryEmbedding,
    limit: 5,
  });
  return search[0];
}
