const ItemTable = ({
  currentItems,
  editItem,
  setEditItem,
  handleEditItem,
  handleDeleteItem,
}) => {
  const confirmDelete = (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (isConfirmed) {
      handleDeleteItem(id); // Proceed to delete if user confirms
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
              Name
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
              Description
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-3 px-4 text-sm text-gray-800">
                {editItem?.id === item.id ? (
                  <input
                    type="text"
                    value={editItem.name}
                    onChange={(e) =>
                      setEditItem({ ...editItem, name: e.target.value })
                    }
                    className="border p-2 rounded-md"
                  />
                ) : (
                  item.name
                )}
              </td>
              <td className="py-3 px-4 text-sm text-gray-800">
                {editItem?.id === item.id ? (
                  <input
                    type="text"
                    value={editItem.description}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        description: e.target.value,
                      })
                    }
                    className="border p-2 rounded-md"
                  />
                ) : (
                  item.description
                )}
              </td>
              <td className="py-3 px-4 text-sm">
                {editItem?.id === item.id ? (
                  <button
                    onClick={() => handleEditItem(item.id)}
                    className="bg-green-500 text-white p-2 rounded-md"
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setEditItem(item)}
                      className="bg-yellow-500 text-white p-2 rounded-md mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(item.id)} // Trigger confirmDelete function
                      className="bg-red-500 text-white p-2 rounded-md"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
