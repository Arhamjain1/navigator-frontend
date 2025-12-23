const Loading = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <span className="loader"></span>
          <p className="mt-4 text-gray-600 tracking-wide">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <span className="loader"></span>
        <p className="mt-4 text-gray-600 tracking-wide">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
