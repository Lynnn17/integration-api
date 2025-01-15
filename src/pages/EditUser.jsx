import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const EditUser = () => {
  const { user, editName } = useContext(AuthContext);
  const [name, setName] = useState(user?.fullName || "");

  const handleSave = () => {
    editName(name);
    alert("Profile updated!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold dark:text-white text-black">
        Edit Profile
      </h1>
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Save
      </button>
    </div>
  );
};

export default EditUser;
