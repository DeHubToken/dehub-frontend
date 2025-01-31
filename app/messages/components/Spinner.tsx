const Spinner=()=>{
    return<div className="flex items-center justify-center space-x-2">
    <div className="w-5 h-5 border-4 border-t-4 border-gray-400 border-solid rounded-full animate-spin"></div>
    <div className="text-sm text-gray-500">Uploading...</div>
  </div>
  }
  export default Spinner