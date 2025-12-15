const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <p className="text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-semibold text-blue-600">Gracia Pharmindo</span>.
        All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
