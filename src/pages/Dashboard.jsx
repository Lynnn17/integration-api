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
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      const itemsFromDB = await getItems();
      setItems(itemsFromDB);
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || 1;
    const searchQuery = params.get("search") || "";

    setCurrentPage(page);
    setSearch(searchQuery);
  }, [location.search]);

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.description) return;
    await addItem(newItem);
    setNewItem({ name: "", description: "" });
    const itemsFromDB = await getItems();
    setItems(itemsFromDB);
    alert("Item added!");
  };

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

  const handleDeleteItem = async (id) => {
    await deleteItem(id);
    const itemsFromDB = await getItems();
    setItems(itemsFromDB);
    alert("Item deleted!");
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate({
      search: `?page=${pageNumber}&search=${search}`,
    });
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    setCurrentPage(1);
    navigate({
      search: `?page=1&search=${query}`,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6 text-center text-blue-600 dark:text-blue-300">
        CRUD Data
      </h1>

      <ItemForm
        newItem={newItem}
        setNewItem={setNewItem}
        handleAddItem={handleAddItem}
      />

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
      <ItemTable
        currentItems={currentItems}
        editItem={editItem}
        setEditItem={setEditItem}
        handleEditItem={handleEditItem}
        handleDeleteItem={handleDeleteItem}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Dashboard;
