import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import StatusAlert, { StatusAlertService } from "react-status-alert";
import "react-status-alert/dist/status-alert.css";

const ItemForm = ({ handleAddItem }) => {
  const [divisions, setDivisions] = useState([]);

  // Fetch divisions
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/divisions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setDivisions(response.data.data.divisions);
      } catch (error) {
        StatusAlertService.showError(
          "Failed to load divisions. Please try again."
        );
      }
    };

    fetchDivisions();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      division: "",
      position: "",
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      phone: Yup.string().required("Phone is required"),
      division: Yup.string().required("Division is required"),
      position: Yup.string().required("Position is required"),
      image: Yup.mixed()
        .required("Image is required")
        .test("max-size", "Image size is too large", (value) => {
          if (value) {
            return value.size <= 1024 * 1024 * 5; // 5MB
          }
          return true;
        })
        .test("type", "Only images are allowed", (value) => {
          if (value) {
            return (
              value.type === "image/jpeg" ||
              value.type === "image/jpg" ||
              value.type === "image/png" ||
              value.type === "image/webp"
            );
          }
          return true;
        }),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("phone", values.phone);
      formData.append("division", values.division);
      formData.append("position", values.position);
      formData.append("image", values.image);

      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/employees`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        handleAddItem();
        StatusAlertService.showSuccess("Employee added successfully!");
        formik.resetForm();
      } catch (error) {
        console.error("Error adding item:", error);
        StatusAlertService.showError(
          "Failed to add employee. Please try again."
        );
      }
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6 text-blue-600">
        Add New Employee
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter employee's name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm">{formik.errors.name}</div>
            )}
          </div>

          {/* Phone Input */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="text-red-500 text-sm">{formik.errors.phone}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Division Select */}
          <div>
            <label
              htmlFor="division"
              className="block text-sm font-medium text-gray-700"
            >
              Division
            </label>
            <select
              id="division"
              name="division"
              value={formik.values.division}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Division</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.name}
                </option>
              ))}
            </select>
            {formik.touched.division && formik.errors.division && (
              <div className="text-red-500 text-sm">
                {formik.errors.division}
              </div>
            )}
          </div>

          {/* Position Input */}
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700"
            >
              Position
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formik.values.position}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter position"
            />
            {formik.touched.position && formik.errors.position && (
              <div className="text-red-500 text-sm">
                {formik.errors.position}
              </div>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={(event) =>
              formik.setFieldValue("image", event.currentTarget.files[0])
            }
            onBlur={formik.handleBlur}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.image && formik.errors.image && (
            <div className="text-red-500 text-sm">{formik.errors.image}</div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;
