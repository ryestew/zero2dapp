import { ThemeToggle } from "./ThemeToggle";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer footer-center p-6 bg-base-100 border-t border-base-300 fixed bottom-0 left-0 right-0 z-40 shadow-lg">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded w-7 shadow">
                <span className="text-xs font-bold">Z</span>
              </div>
            </div>
            <span className="text-sm font-medium">
              ZeroToDapp &copy; {currentYear}
            </span>
          </div>

          {/* Links & Theme Toggle */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <a
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-hover text-sm font-medium"
              >
                Next.js
              </a>
              <a
                href="https://thegraph.com/docs/"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-hover text-sm font-medium"
              >
                The Graph
              </a>
              <a
                href="https://wagmi.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-hover text-sm font-medium"
              >
                Wagmi
              </a>
              <a
                href="https://www.rainbowkit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-hover text-sm font-medium"
              >
                RainbowKit
              </a>
            </div>

            <div className="divider divider-horizontal"></div>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
