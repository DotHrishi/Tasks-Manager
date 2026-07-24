import { useEffect, useState, useContext } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import TaskCard from "../components/TaskCard";
import { AuthContext } from "../context/AuthContext";
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const { token } = useContext(AuthContext);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (priority) params.append("priority", priority);
      if (search) params.append("search", search);
      if (sort) params.append("sort", sort);
      params.append("page", page);
      params.append("limit", 6);

      const res = await api.get(`/tasks?${params.toString()}`);
      if (res.status === 200) {
        setTasks(res.data.tasks);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      toast.error("Failed to fetch tasks!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token, status, priority, search, sort, page]);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-4 mt-6">
        <div className="bg-[#111] p-4 rounded-xl border border-gray-600 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 bg-black border border-gray-600 rounded text-sm text-white focus:outline-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <select
              className="p-2 bg-black border border-gray-600 rounded text-sm text-white focus:outline-none"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              className="p-2 bg-black border border-gray-600 rounded text-sm text-white focus:outline-none"
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <select
              className="p-2 bg-black border border-gray-600 rounded text-sm text-white focus:outline-none"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Sort: Newest</option>
              <option value="dueDate">Sort: Due Date</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-white">
            Loading...
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-black border border-gray-700 rounded">
            <p className="text-gray-400 mb-4">No tasks found.</p>
            <button
              onClick={() => navigate("/create")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create One
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  setTasks={setTasks}
                  refreshTasks={fetchTasks}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 bg-gray-800 rounded text-white disabled:opacity-50 hover:bg-gray-700"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <span className="text-sm text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 bg-gray-800 rounded text-white disabled:opacity-50 hover:bg-gray-700"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
