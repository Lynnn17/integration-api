import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import StatusAlert, { StatusAlertService } from "react-status-alert";
import "react-status-alert/dist/status-alert.css";

// Validation schema using Yup
const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required").min(6),
});

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogin = async (values) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/login",
        {
          username: values.username,
          password: values.password,
        }
      );

      if (response.data.status === "success") {
        const { username, name } = response.data.data.user;
        const token = response.data.data.token;
        localStorage.setItem("token", token);
        login(username, name);
        StatusAlertService.showSuccess("Login successful!");
        navigate("/");
      } else {
        StatusAlertService.showError("Invalid username or password");
      }
    } catch (error) {
      console.error(error);
      StatusAlertService.showError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <StatusAlert />
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-white">
          Login
        </h2>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Username
                </label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                disabled={isSubmitting} // Disable the button while submitting
              >
                {isSubmitting ? "Loading..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
