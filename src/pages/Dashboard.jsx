import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import StatusAlert, { StatusAlertService } from "react-status-alert";
import "react-status-alert/dist/status-alert.css";
import ItemForm from "../components/ItemForm";
import ItemTable from "../components/ItemTable";
import Pagination from "../components/Pagination";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [editItem, setEditItem] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const columns = [
    { label: "Name", key: "name" },
    { label: "Image", key: "image" },
    { label: "Phone", key: "phone" },
    { label: "Position", key: "position" },
    { label: "Name Division", key: "division.name" },
  ];

  const actions = [
    {
      label: "Edit",
      className: "bg-blue-500 text-white mr-2",
      onClick: (item) => {
        handelEditItem(item);
      },
    },
    {
      label: "Delete",
      className: "bg-red-500 text-white",
      onClick: (item) => {
        confirmAlert({
          title: "Confirm to submit",
          message: "Are you sure to do this.",
          buttons: [
            {
              label: "Yes",
              onClick: () => {
                handleDeleteItem(item.id);
              },
            },
            {
              label: "No",
            },
          ],
        });
      },
    },
  ];

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
      setItems(response.data.data.employees);
      const { total, per_page } = response.data.pagination;

      setTotalItems(total);
      setItemsPerPage(per_page);
    } catch (error) {
      StatusAlertService.showError("Failed to load items. Please try again.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, currentPage, itemsPerPage]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || 1;
    const searchQuery = params.get("search") || "";

    setCurrentPage(page);
    setSearch(searchQuery);
  }, [location.search]);

  const handelEditItem = (item) => {
    setEditItem(item);
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/employees/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      StatusAlertService.showSuccess("Item deleted!");
      fetchItems();
    } catch (error) {
      StatusAlertService.showError("Failed to delete item.");
    }
  };

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
    setCurrentPage(1);
    navigate({
      search: `?page=1&search=${query}`,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <StatusAlert />
      <h1 className="text-2xl font-semibold mb-6 text-center text-blue-600 dark:text-blue-300">
        Data Employee
      </h1>

      <ItemForm
        handleAddItem={fetchItems}
        editItem={editItem}
        setEditItem={setEditItem}
        handleCancel={() => setEditItem(null)}
      />

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
            placeholder="Search Name..."
          />
        </div>
      </div>

      <ItemTable
        currentItems={items}
        columns={columns}
        handleDeleteItem={handleDeleteItem}
        actions={actions}
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
