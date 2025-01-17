const ItemTable = ({ currentItems, columns, actions }) => {
  const renderColumn = (item, column) => {
    if (typeof column.render === "function") {
      return column.render(item);
    }

    if (column.key === "image") {
      // Menampilkan gambar
      return (
        <img
          src={`${import.meta.env.VITE_API_URL}/public/storage/${
            item[column.key]
          }`} // Gabungkan URL dasar dengan path gambar
          alt={item.name}
          className="w-16 h-16 object-cover rounded-full" // Styling gambar
        />
      );
    }

    // Menangani kolom lainnya, termasuk yang memiliki properti nested seperti "division.name"
    return column.key.split(".").reduce((acc, part) => acc && acc[part], item);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column) => (
              <th
                key={column.key}
                className="py-3 px-4 text-left text-sm font-medium text-gray-700"
              >
                {column.label}
              </th>
            ))}
            {actions && (
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <tr key={item.id} className="border-b">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="py-3 px-4 text-sm text-gray-800"
                  >
                    {renderColumn(item, column)}
                  </td>
                ))}
                {actions && (
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => action.onClick(item)}
                        className={`p-2 rounded-md ${action.className}`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="py-3 px-4 text-center text-sm text-gray-500"
              >
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
