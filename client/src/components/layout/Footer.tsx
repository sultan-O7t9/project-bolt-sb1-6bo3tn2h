const Footer = () => {
  return (
    <footer className="bg-white shadow-inner py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">
              &copy; {new Date().getFullYear()} SocialBlog. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
