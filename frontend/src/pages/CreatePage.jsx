import toast from "react-hot-toast";
import api from "../lib/axios";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required!");
      return;
    }

    setLoading(true);
    try {
      await api.post("/tasks", {
        title,
        description,
        status,
        priority,
        due_date: dueDate || null,
      });
      toast.success("Task created successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start mt-10 w-full">
      <div className="bg-black p-6 rounded-lg w-[95%] max-w-4xl border-2 border-gray-600">
        <h2 className="text-xl font-bold mb-4 text-white">Create New Task</h2>

        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  className="w-full p-2 bg-black border border-gray-500 rounded text-white"
                  placeholder="e.g., Complete the React project"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col h-full">
                <label className="block text-sm text-gray-300 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  className="w-full p-2 bg-black border border-gray-500 rounded text-white flex-1 min-h-[100px]"
                  placeholder="Add more details about this task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full p-2 bg-black border border-gray-500 rounded text-white"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    className="w-full p-2 bg-black border border-gray-500 rounded text-white"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Due Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-2 bg-black border border-gray-500 rounded text-white [color-scheme:dark]"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
