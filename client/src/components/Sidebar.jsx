
import {
  LayoutDashboard,
  UserRound,
  FileText,
  Mic,
  BrainCircuit,
  ChartNoAxesCombined,
  Settings,
  LogOut,
  X
} from "lucide-react";

import "./Sidebar.css";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "My Profile", icon: UserRound, path: "/profile" },
  { name: "Resume Analyzer", icon: FileText, path: "/resume" },
  { name: "Interview Prep", icon: Mic, path: "/interview" },
  { name: "AI Assistant", icon: BrainCircuit, path: "/chat" },
  { name: "My Progress", icon: ChartNoAxesCombined, path: "/progress" }
];

function Sidebar({
  activePath,
  onNavigate,
  onLogout,
  onClose,
  isOpen = false
}) {
  return (
    <aside className={`nixia-sidebar ${isOpen ? "sidebar-open" : ""}`}>

      {/* BRAND */}
      <div className="sidebar-brand">

        <div className="sidebar-logo">
          <BrainCircuit size={25} />
        </div>

        <span>NIXIA</span>

        <button
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>

      </div>

      {/* SECTION */}
      <div className="sidebar-section-label">
        WORKSPACE
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-nav">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <button
              key={item.path}
              className={`sidebar-link ${
                activePath === item.path ? "active" : ""
              }`}
              onClick={() => {
                onNavigate(item.path);
                onClose?.();
              }}
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </button>
          );

        })}

      </nav>

      {/* BOTTOM */}
      <div className="sidebar-bottom">

        <button className="sidebar-link">
          <Settings size={19} />
          <span>Settings</span>
        </button>

        <button
          className="sidebar-link logout-link"
          onClick={onLogout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>

        {/* FOOTER */}
        <div className="sidebar-footer">

          <div className="sidebar-avatar">
            N
          </div>

          <div>
            <strong>NIXIA Student</strong>
            <small>Career Workspace</small>
          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;
