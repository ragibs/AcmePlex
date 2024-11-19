import { Film } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black py-12 px-4">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Film size={24} className="text-primary-500" />
            <span className="text-xl font-medium">AcmePlex</span>
          </div>
          <p className="text-gray-400 text-sm font-light">
            Experience the magic of cinema in ultimate comfort and style.
          </p>
        </div>
        <div>
          <h3 className="font-medium mb-4 text-sm">Quick Links</h3>
          <div className="space-y-2 text-gray-400 text-sm">
            <a href="#" className="block hover:text-primary-400 transition">
              Movies
            </a>
            <a href="#" className="block hover:text-primary-400 transition">
              Experiences
            </a>
            <a href="#" className="block hover:text-primary-400 transition">
              Food & Drinks
            </a>
            <a href="#" className="block hover:text-primary-400 transition">
              Gift Cards
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-4 text-sm">Contact</h3>
          <div className="space-y-2 text-gray-400 text-sm font-light">
            <p>123 Cinema Street</p>
            <p>Los Angeles, CA 90028</p>
            <p>info@acmeplex.com</p>
            <p>(555) 123-4567</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
