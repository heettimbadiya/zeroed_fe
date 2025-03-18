export const Error = ({ message }) => {
  return (
    <div
      className="px-4 py-1 mb-4 text-xs text-red-800 rounded-lg bg-red-50 dark:text-red-400"
      role="alert"
    >
      {message}
    </div>
  )
}
export const Success = ({ message }) => {
  return (
    <div
      className="px-4 py-2 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:text-green-400"
      role="alert"
    >
      {message}
    </div>
  )
}
