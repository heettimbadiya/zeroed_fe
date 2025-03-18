import loading from "../../../assets/loading.gif";

export const PageLoading = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <img src={loading} alt="loading..." />
    </div>
  )
}
