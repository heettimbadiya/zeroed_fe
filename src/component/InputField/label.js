const Label = ({ label, className }) => {
  return (
    <div
      className={`${className} font-semibold text-base text-black capitalize`}
    >
      {label}
    </div>
  )
}

export default Label