import { useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { StatusAlertService } from "react-status-alert";
import "react-status-alert/dist/status-alert.css";

const ItemForm = ({ handleAddItem, editItem = null, handleCancel }) => {
  const [divisions, setDivisions] = useState([]);
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

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    phone: Yup.number()
      .typeError("Phone must be a number")
      .positive()
      .integer()
      .min(10)
      .required("Phone is required"),

    division: Yup.string().required("Division is required"),
    position: Yup.string().required("Position is required"),
    image:
      editItem === null
        ? Yup.array()
            .min(1, "At least one image is required")
            .of(
              Yup.mixed().test("fileType", "Unsupported file format", (value) =>
                [
                  "image/jpeg",
                  "image/png",
                  "image/gif",
                  "image/webp",
                  "image/jpg",
                ].includes(value?.type)
              )
            )
        : Yup.array().nullable(),
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-10">
      <h2 className="text-2xl font-semibold text-center mb-6 text-blue-600">
        {editItem ? "Edit Employee" : "Add New Employee"}
      </h2>

      <Formik
        enableReinitialize
        initialValues={{
          name: editItem ? editItem.name : "",
          phone: editItem ? editItem.phone : "",
          division: editItem ? editItem.division.id : "",
          position: editItem ? editItem.position : "",
          image: null,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          const formData = new FormData();
          formData.append("name", values.name);
          formData.append("phone", values.phone);
          formData.append("division", values.division);
          formData.append("position", values.position);

          // Only append image if it's not null or undefined
          if (editItem === null) {
            formData.append("image", values.image);
          }

          formData.append("_method", editItem ? "PUT" : "POST");

          try {
            if (editItem) {
              await axios.post(
                `${import.meta.env.VITE_API_URL}/api/employees/${editItem.id}`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              StatusAlertService.showSuccess("Employee updated successfully!");
            } else {
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
              StatusAlertService.showSuccess("Employee added successfully!");
            }

            handleAddItem();
            handleCancel();
          } catch (error) {
            console.error("Error submitting form:", error);
            StatusAlertService.showError(
              "Failed to save employee. Please try again."
            );
          }
        }}
      >
        {({
          setFieldValue,
          values,
          touched,
          errors,
          handleBlur,
          handleChange,
          isSubmitting,
          resetForm,
        }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter employee's name"
                />
                {touched.name && errors.name && (
                  <div className="text-red-500 text-sm">{errors.name}</div>
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
                <Field
                  type="text"
                  id="phone"
                  name="phone"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
                {touched.phone && errors.phone && (
                  <div className="text-red-500 text-sm">{errors.phone}</div>
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
                <Field
                  as="select"
                  id="division"
                  name="division"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Division</option>
                  {divisions.map((division) => (
                    <option key={division.id} value={division.id}>
                      {division.name}
                    </option>
                  ))}
                </Field>
                {touched.division && errors.division && (
                  <div className="text-red-500 text-sm">{errors.division}</div>
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
                <Field
                  type="text"
                  id="position"
                  name="position"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter position"
                />
                {touched.position && errors.position && (
                  <div className="text-red-500 text-sm">{errors.position}</div>
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
                accept="image/*"
                onChange={(event) =>
                  setFieldValue("image", event.currentTarget.files[0])
                }
                onBlur={handleBlur}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {touched.image && errors.image && (
                <div className="text-red-500 text-sm">{errors.image}</div>
              )}

              {values.image && (
                <div className="mt-4">
                  <img
                    src={URL.createObjectURL(values.image)}
                    alt="Image Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Submitting..."
                  : editItem
                  ? "Update Employee"
                  : "Add Employee"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm(); // Reset form to initial state
                  handleCancel(); // Call cancel handler to reset parent state
                }}
                className="mt-4 ml-4 px-6 py-3 bg-gray-600 text-white font-semibold rounded-md shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ItemForm;
