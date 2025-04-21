import "./App.css";
import UpdateNotification from "./components/UpdateNotification";

function App() {
  return (
    <>
      <UpdateNotification />

      <div className="text-sm text-gray-500 text-end px-4 pt-4">v2.0.0</div>

      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
        <div className="max-w-3xl bg-white p-8 rounded-2xl shadow-md space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 leading-tight">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </h1>
          <p className="text-gray-600 text-lg">
            Corrupti magni sunt rerum laboriosam ex consequuntur qui ipsam,
            delectus, consectetur reprehenderit itaque recusandae esse facilis
            fuga nihil. Saepe impedit eveniet placeat ipsam sit quos animi,
            architecto totam voluptatum. Laboriosam, rem quos officia, molestiae
            laborum porro, ducimus voluptatibus corrupti esse eaque blanditiis?
          </p>
        </div>
      </main>
    </>
  );
}

export default App;
