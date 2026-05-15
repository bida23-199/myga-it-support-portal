export default function Sidebar() {
  return (
    <div className="w-64 bg-blue-950 text-white min-h-screen p-5">

      <h2 className="text-2xl font-bold mb-8">
        MYGA ICT
      </h2>

      <ul className="space-y-4">

        <li className="hover:bg-blue-800 p-3 rounded-xl cursor-pointer">
          Dashboard
        </li>

        <li className="hover:bg-blue-800 p-3 rounded-xl cursor-pointer">
          Log Ticket
        </li>

        <li className="hover:bg-blue-800 p-3 rounded-xl cursor-pointer">
          Ticket History
        </li>

        <li className="hover:bg-blue-800 p-3 rounded-xl cursor-pointer">
          Knowledge Base
        </li>

      </ul>

    </div>
  );
}