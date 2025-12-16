export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold mb-2">Digital Life Lessons</h3>
          <p className="text-sm text-slate-400">
            A place to store your wisdom, reflect on growth, and learn from
            others.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Contact</h4>
          <p className="text-sm text-slate-400">
            support@digitallifelessons.com
          </p>
          <p className="text-sm text-slate-400">Dhaka, Bangladesh</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Legal & Social</h4>
          <ul className="space-y-1 text-sm text-slate-400">
            <li>Terms &amp; Conditions</li>
            <li>Privacy Policy</li>
          </ul>
          <div className="flex items-center gap-3 mt-3">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700"
            >
              <span className="font-semibold text-base">X</span>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700"
            >
              f
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700"
            >
              in
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 text-center py-3 text-xs text-slate-500">
        © {new Date().getFullYear()} Digital Life Lessons. All rights reserved.
      </div>
    </footer>
  );
}