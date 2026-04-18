import { Outlet, Link, useLocation } from "react-router";
import { Search, BarChart3, GitCompare, Sparkles, Github } from "lucide-react";

export function Root() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Github },
    { path: "/analyze", label: "Analyze", icon: BarChart3 },
    { path: "/compare", label: "Compare", icon: GitCompare },
    { path: "/insights", label: "Insights", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      {/* Header */}
      <header className="border-b border-[#30363d] bg-[#161b22]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="relative">
                  <Github className="w-8 h-8 text-[#e6edf3]" />
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl group-hover:bg-blue-500/30 transition-all rounded-full" />
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-[#e6edf3] to-[#7d8590] bg-clip-text text-transparent">
                  Profile Analyzer
                </span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                        isActive
                          ? "bg-[#1f6feb]/10 text-[#58a6ff] border border-[#1f6feb]/50"
                          : "text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#30363d]/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7d8590]" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] placeholder-[#7d8590] focus:outline-none focus:border-[#1f6feb] focus:ring-1 focus:ring-[#1f6feb]/50 w-64 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363d] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-[#7d8590]">
            <p>Powered by GitHub API • Built with React & Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
