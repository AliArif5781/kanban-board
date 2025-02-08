const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white">
      {/* Error Code */}
      <h1 className="text-9xl font-bold mb-4 animate-bounce">404</h1>

      {/* Error Message */}
      <h2 className="text-4xl font-semibold mb-6">Oops! Page Not Found</h2>

      {/* Description */}
      <p className="text-lg text-center mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved. Please
        check the URL or go back to the homepage.
      </p>

      {/* Back to Home Button */}
      <a
        href="/"
        className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-50 transition duration-300"
      >
        Go Back Home
      </a>

      {/* Optional: Add an illustration or icon */}
      <div className="mt-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
  );
};

export default ErrorPage;
