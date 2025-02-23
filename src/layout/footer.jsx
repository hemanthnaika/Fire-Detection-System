const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-6 mt-8">
        <div className="container mx-auto text-center">
          <p className="text-sm mb-2">
            &copy; {new Date().getFullYear()} Fire Detection System. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mb-4">
            <a href="https://github.com/yourgithubprofile" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/yourlinkedinprofile" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              LinkedIn
            </a>
            <a href="mailto:youremail@example.com" className="text-gray-400 hover:text-white">
              Email
            </a>
          </div>
          <p className="text-xs text-gray-500">
            Designed by <strong>Your Name</strong> | Powered by Firebase & ESP8266
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  