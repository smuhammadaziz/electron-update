import "./App.css";
import UpdateNotification from "./components/UpdateNotification";

function App() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-10 space-y-6 border border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">Latest</h2>
            <span className="text-sm text-gray-400">v4.0.0</span>
          </div>

          <UpdateNotification />

          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
              Game-changing features just dropped.
            </h1>
            <p className="text-gray-300 text-base md:text-lg">
              We’ve completely reworked the engine, patched all those annoying
              bugs, and made the whole experience smoother than your grandma’s
              mashed potatoes. Get ready for a whole new level of performance
              and stability.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
