function Header({ user }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900">
      <h1 className="text-2xl font-extrabold text-green-500 tracking-wide">
        NexChat
      </h1>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-300">
          {user?.name || "User"}
        </span>
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold text-slate-950 text-lg shadow-md">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </div>
    </div>
  );
}

export default Header;