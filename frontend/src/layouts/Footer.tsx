export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} <span className="font-semibold text-blue-600">CareFlow</span>. All rights reserved.
          </div>

    
        </div>
      </div>
    </footer>
  );
}
