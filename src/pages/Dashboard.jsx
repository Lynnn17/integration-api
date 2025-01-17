import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import StatusAlert, { StatusAlertService } from "react-status-alert";
import "react-status-alert/dist/status-alert.css";
import ItemForm from "../components/ItemForm";
import ItemTable from "../components/ItemTable";
import Pagination from "../components/Pagination";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", description: "" });
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust items per page if needed
  const [totalItems, setTotalItems] = useState(0); // To track total number of items

  const location = useLocation();
  const navigate = useNavigate();

  // Define columns for the ItemTable
  const columns = [
    { label: "Name", key: "name" },
    { label: "Image", key: "image" },
    { label: "Name", key: "name" },
    { label: "Phone", key: "phone" },
    { label: "Position", key: "position" },
    { label: "Name Devision", key: "devision.updated_at" },
    { label: "Actions", key: "actions" },
  ];

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/employees?name=${search}&page=${currentPage}&limit=${itemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data);
        setItems(response.data.data.employees);
        setTotalItems(response.data.pagination.total); // Set total items for pagination
      } catch (error) {
        console.error("Error fetching items:", error);
        StatusAlertService.showError("Failed to load items. Please try again.");
      }
    };

    fetchItems();
  }, [search, currentPage, itemsPerPage]);

  // Update search and page from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || 1;
    const searchQuery = params.get("search") || "";

    setCurrentPage(page);
    setSearch(searchQuery);
  }, [location.search]);

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.description) return;

    try {
      await axios.post(
        "https://magang.karyavisual.com/api/employees",
        newItem,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNewItem({ name: "", description: "" });
      StatusAlertService.showSuccess("Item added!");
      fetchItems(); // Refetch items after adding
    } catch (error) {
      StatusAlertService.showError("Failed to add item.");
    }
  };

  const handleEditItem = async (id) => {
    if (!editItem) return;

    try {
      await axios.put(
        `https://magang.karyavisual.com/api/employees/${id}`,
        {
          name: editItem.name,
          description: editItem.description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setEditItem(null);
      StatusAlertService.showSuccess("Item updated!");
      fetchItems(); // Refetch items after update
    } catch (error) {
      StatusAlertService.showError("Failed to update item.");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`https://magang.karyavisual.com/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      StatusAlertService.showSuccess("Item deleted!");
      fetchItems(); // Refetch items after delete
    } catch (error) {
      StatusAlertService.showError("Failed to delete item.");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate({
      search: `?page=${pageNumber}&search=${search}`,
    });
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    setCurrentPage(1); // Reset to page 1 on search change
    navigate({
      search: `?page=1&search=${query}`,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <StatusAlert />
      <h1 className="text-2xl font-semibold mb-6 text-center text-blue-600 dark:text-blue-300">
        CRUD Data
      </h1>

      {/* Item Form */}
      <ItemForm
        newItem={newItem}
        setNewItem={setNewItem}
        handleAddItem={handleAddItem}
      />

      {/* Search Bar */}
      <div className="mb-6 flex justify-end">
        <div className="relative border border-gray-300 rounded-md w-full md:w-1/4">
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

      {/* Item Table */}
      <ItemTable
        currentItems={items}
        columns={columns} // Pass the columns to ItemTable
        handleEditItem={handleEditItem}
        handleDeleteItem={handleDeleteItem}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Dashboard;
