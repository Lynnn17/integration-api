import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addItem,
  getItems,
  updateItem,
  deleteItem,
} from "../services/dataService";
import ItemForm from "../components/ItemForm";
import ItemTable from "../components/ItemTable";
import Pagination from "../components/Pagination";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", description: "" });
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState(""); // Untuk pencarian
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const [itemsPerPage] = useState(5); // Jumlah item per halaman

  const location = useLocation();
  const navigate = useNavigate();

  // Mengambil data dari IndexedDB saat komponen dimuat
  useEffect(() => {
    const fetchItems = async () => {
      const itemsFromDB = await getItems();
      setItems(itemsFromDB);
    };
    fetchItems();
  }, []);

  // Membaca query string dari URL untuk memulihkan state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || 1;
    const searchQuery = params.get("search") || "";

    setCurrentPage(page);
    setSearch(searchQuery);
  }, [location.search]);

  // Menambahkan item baru
  const handleAddItem = async () => {
    if (!newItem.name || !newItem.description) return;
    await addItem(newItem);
    setNewItem({ name: "", description: "" });
    const itemsFromDB = await getItems();
    setItems(itemsFromDB);
    alert("Item added!");
  };

  // Mengedit data item
  const handleEditItem = async (id) => {
    if (!editItem) return;
    await updateItem(id, {
      name: editItem.name,
      description: editItem.description,
    });
    setEditItem(null);
    const itemsFromDB = await getItems();
    setItems(itemsFromDB);
    alert("Item updated!");
  };

  // Menghapus item
  const handleDeleteItem = async (id) => {
    await deleteItem(id);
    const itemsFromDB = await getItems();
    setItems(itemsFromDB);
    alert("Item deleted!");
  };

  // Filter berdasarkan pencarian
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  // Paginasi: menentukan item yang ditampilkan pada halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Menghitung jumlah halaman
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Fungsi untuk mengganti halaman
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Memperbarui query string di URL
    navigate({
      search: `?page=${pageNumber}&search=${search}`,
    });
  };

  // Fungsi untuk menangani perubahan pencarian
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    setCurrentPage(1); // Reset ke halaman pertama saat pencarian berubah

    // Memperbarui query string di URL
    navigate({
      search: `?page=1&search=${query}`,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6 text-center text-blue-600 dark:text-blue-300">
        CRUD Data
      </h1>

      {/* Form untuk menambah item */}
      <ItemForm
        newItem={newItem}
        setNewItem={setNewItem}
        handleAddItem={handleAddItem}
      />

      {/* Pencarian */}
      <div className="mb-6 flex justify-end ">
        <div className="relative border border-gray-300 rounded-md w-full  md:w-1/4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-1/2 left-2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            className="pl-10 p-2 rounded-md w-full border border-gray-300"
            placeholder="Search items..."
          />
        </div>
      </div>

      {/* Tabel untuk menampilkan daftar item */}
      <ItemTable
        currentItems={currentItems}
        editItem={editItem}
        setEditItem={setEditItem}
        handleEditItem={handleEditItem}
        handleDeleteItem={handleDeleteItem}
      />

      {/* Paginasi */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Dashboard;
