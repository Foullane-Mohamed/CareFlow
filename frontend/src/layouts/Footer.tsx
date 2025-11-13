export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Copyright */}
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} <span className="font-semibold text-blue-600">CareFlow</span>. All rights reserved.
          </div>

          {/* Center: Links */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-blue-600 transition"
            >
              About
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-blue-600 transition"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-blue-600 transition"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-blue-600 transition"
            >
              Contact
            </a>
          </div>

          {/* Right: Version */}
          <div className="text-sm text-gray-500">
            Version 1.0.0
          </div>
        </div>
      </div>
    </footer>
  );
}

