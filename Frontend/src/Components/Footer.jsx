import { Link } from "react-router-dom";
import { Zap, Share2, Globe } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#F4F2FE] w-full py-12">
      <div className="max-w-6xl mx-auto px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 ">
          <div className="md:col-span-5 flex flex-col items-start">
            <div className="flex flex-row items-center gap-2 mb-4">
              <Zap size={24} className="text-[#1D4ED8]" />
              <h1 className="text-xl font-bold text-[#1D4ED8]">
                QuickLog
              </h1>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed text-sm">
              The modern standard for<br />
              performance-based fitness<br />
              and nutrition tracking.
            </p>
          </div>
          
          <div className="md:col-span-7 grid grid-cols-3 gap-8">
            <div className="flex flex-col gap-6">
              <h2 className="text-[#1F2937] font-medium">Product</h2>
              <ul className="flex flex-col gap-4 text-gray-500 text-sm">
                <li><Link to="#" className="hover:text-gray-900">Features</Link></li>
                <li><Link to="#" className="hover:text-gray-900">Workout Builder</Link></li>
                <li><Link to="#" className="hover:text-gray-900">Integrations</Link></li>
                <li><Link to="#" className="hover:text-gray-900">Pricing</Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <h2 className="text-[#1F2937] font-medium">Company</h2>
              <ul className="flex flex-col gap-4 text-gray-500 text-sm">
                <li><Link to="#" className="hover:text-gray-900">About Us</Link></li>
                <li><Link to="#" className="hover:text-gray-900">Careers</Link></li>
                <li><Link to="#" className="hover:text-gray-900">Blog</Link></li>
                <li><Link to="#" className="hover:text-gray-900">Contact</Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <h2 className="text-[#1F2937] font-medium">Legal</h2>
              <ul className="flex flex-col gap-4 text-gray-500 text-sm">
                <li><Link to="#" className="hover:text-gray-900">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-gray-900">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-gray-900">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-600 font-medium text-sm">
          <p>© 2024 QuickLog Performance. All rights reserved.</p>
          <div className="flex items-center gap-5 text-gray-500">
            <button className="hover:text-gray-900 transition-colors"><Share2 size={20} /></button>
            <button className="hover:text-gray-900 transition-colors"><Globe size={20} /></button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
