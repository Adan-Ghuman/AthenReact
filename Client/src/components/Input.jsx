
const Input = ({icon:Icon,...props}) => {
  return (
    <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className="size-5 text-green-500"/>
        </div>
        <input
        {...props}
        className="w-full pl-10 pr-4 py-2 border-2 border-gray-800 bg-opacity-50 rounded-lg text-white
                 focus:border-green-500 focus:ring-2 bg-gray-800 placeholder-gray-400 focus:ring-green-500 
                 transition duration-200"/>
    </div>
  )
}

export default Input