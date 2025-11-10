function App() {
  return (
    <>
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <button
          className="
            px-6 py-3 
            bg-blue-600 
            text-white 
            font-semibold 
            rounded-xl 
            shadow-md 
            hover:bg-blue-700 
            hover:shadow-lg 
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-400 
            focus:ring-offset-2 
            active:scale-95 
            transition 
            duration-200
          "
        >
          Click Me
        </button>
      </div>
    </>
  );
}

export default App;
