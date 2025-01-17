import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import StatusAlert, { StatusAlertService } from "react-status-alert";
import "react-status-alert/dist/status-alert.css";
import ItemTable from "../components/ItemTable";
import Pagination from "../components/Pagination";

const Devisi = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/divisions?name=${search}&page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            search,
            page: currentPage,
            limit: itemsPerPage,
          },
        }
      );

      const { divisions } = response.data.data;
      const { total, per_page } = response.data.pagination;

      setItems(divisions);
      setTotalItems(total);
      setItemsPerPage(per_page);
    } catch (error) {
      console.error("Error fetching data:", error);
      StatusAlertService.showError("Failed to load items. Please try again.");
    }
  };

  const updateQueryParams = () => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || 1;
    const searchQuery = params.get("search") || "";

    setCurrentPage(page);
    setSearch(searchQuery);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    setCurrentPage(1);
    navigate({ search: `?page=1&search=${query}` });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate({ search: `?page=${pageNumber}&search=${search}` });
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const columns = [
    { key: "id", label: "Id" },
    { key: "name", label: "Name" },
  ];

  useEffect(() => {
    fetchData();
  }, [search, currentPage]);

  useEffect(() => {
    updateQueryParams();
  }, [location.search]);

  return (
    <div className="container mx-auto p-4">
      <StatusAlert />
      <h1 className="text-2xl font-semibold mb-6 text-center text-blue-600 dark:text-blue-300">
        CRUD Data
      </h1>

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
      <ItemTable currentItems={items} columns={columns} />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Devisi;
