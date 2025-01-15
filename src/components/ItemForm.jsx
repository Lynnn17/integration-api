const ItemForm = ({ newItem, setNewItem, handleAddItem }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
        <input
          type="text"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="border p-2 rounded-md w-full sm:w-1/3"
          placeholder="Item Name"
        />
        <input
          type="text"
          value={newItem.description}
          onChange={(e) =>
            setNewItem({ ...newItem, description: e.target.value })
          }
          className="border p-2 rounded-md w-full sm:w-1/3 mt-2 sm:mt-0"
          placeholder="Item Description"
        />
        <button
          onClick={handleAddItem}
          className="bg-blue-500 text-white p-2 rounded-md mt-2 sm:mt-0 sm:w-1/4"
        >
          Add Item
        </button>
      </div>
    </div>
  );
};

export default ItemForm;
