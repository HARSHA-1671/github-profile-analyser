const cache = new Map();
const TTL = 24 * 60 * 60 * 1000; // 24 hours

function get(key) {
  const item = cache.get(key);
  if (!item) return null;

  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }

  return item.data;
}

function set(key, data) {
  const expiresAt = Date.now() + TTL;
  cache.set(key, { data, expiresAt });
}

function clear() {
  cache.clear();
}

module.exports = {
  get,
  set,
  clear
};
