const Label = ({ label, className }) => {
  return (
    <div
      className={`${className} font-medium text-sm text-black capitalize`}
    >
      {label}
    </div>
  )
}

export default Label