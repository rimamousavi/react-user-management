export default function Loader({ isLoading, title, children }) {
  if (isLoading)
    return (
      <tbody>
        <tr>
          <td colSpan="9" className="h-24 text-center text-gray-500">
            {title || "is Loading ...."}
          </td>
        </tr>
      </tbody>
    );

  return children;
}
