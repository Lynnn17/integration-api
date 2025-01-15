const dbName = "dataDB";
const storeName = "items";

// Membuka IndexedDB
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
};

// Menambahkan data ke IndexedDB
const addItem = async (item) => {
  const db = await openDB();
  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);
  store.add(item);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(item);
    transaction.onerror = (e) => reject(e.target.error);
  });
};

// Membaca semua data dari IndexedDB
const getItems = async () => {
  const db = await openDB();
  const transaction = db.transaction(storeName, "readonly");
  const store = transaction.objectStore(storeName);
  const items = store.getAll();

  return new Promise((resolve, reject) => {
    items.onsuccess = () => resolve(items.result);
    items.onerror = (e) => reject(e.target.error);
  });
};

// Mengupdate data di IndexedDB
const updateItem = async (id, updatedItem) => {
  const db = await openDB();
  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);
  const item = { ...updatedItem, id };

  store.put(item);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(item);
    transaction.onerror = (e) => reject(e.target.error);
  });
};

// Menghapus data dari IndexedDB
const deleteItem = async (id) => {
  const db = await openDB();
  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);
  store.delete(id);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(id);
    transaction.onerror = (e) => reject(e.target.error);
  });
};

export { addItem, getItems, updateItem, deleteItem };
