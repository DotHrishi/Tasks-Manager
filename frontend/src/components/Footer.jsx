const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 py-4 mt-auto">
      <div className="mx-auto text-center">
        <p className="text-xs text-white/40 font-medium tracking-wide">
          &copy; {new Date().getFullYear()} Task Manager. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
