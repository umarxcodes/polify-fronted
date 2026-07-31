import { BarChart3, Bolt, Users } from "lucide-react";
import { Outlet } from "react-router-dom";
import "../styles/auth.css";

function PollifyMark() {
  return (
    <span className="pollify-mark" aria-hidden="true">
      <i /><i /><i />
    </span>
  );
}

export default function AuthLayout({ children }) {
  return (
    <main className="auth-shell">
      <aside className="auth-showcase">
        <div className="auth-brand"><PollifyMark /><span>Pollify</span></div>

        <div className="auth-showcase-copy">
          <span className="community-pill"><span /> Live community</span>
          <h1>Every opinion<br /><em>deserves to</em><br />be counted.</h1>
          <p>Create polls in seconds, collect votes instantly, and discover what your community truly thinks.</p>
          <div className="community-stats">
            <div><Users size={17} /><strong>50K+</strong><small>Community members</small></div>
            <div><BarChart3 size={17} /><strong>1M+</strong><small>Votes cast</small></div>
            <div><Bolt size={17} /><strong>500K+</strong><small>Polls created</small></div>
          </div>
        </div>

        <footer>© {new Date().getFullYear()} Pollify · Made for the community</footer>
      </aside>

      <section className="auth-panel">
        <div className="auth-mobile-brand"><PollifyMark /><span>Pollify</span></div>
        {children || <Outlet />}
      </section>
    </main>
  );
}
