import React from "react";
import { Link } from "react-router-dom";
import { PenSquareIcon, Trash2Icon } from "lucide-react";
import api from "../lib/axios";
import toast from "react-hot-toast";

const formatDate = (dateString) => {
  if (!dateString) return "No due date";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const TaskCard = ({ task, refreshTasks }) => {
  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted successfully!");
      if (refreshTasks) refreshTasks();
    } catch (error) {
      toast.error("Try again later!");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-400";
      case "In Progress":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-400";
      case "Medium":
        return "text-blue-400";
      case "Low":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="flex flex-col justify-between h-full w-full bg-black p-5 rounded border border-gray-600">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white line-clamp-2 break-words">
            {task.title}
          </h3>

          <div className="flex gap-2 ml-4">
            <Link
              to={`/edit/${task.id}`}
              className="p-2 bg-gray-800 text-gray-300 rounded hover:bg-blue-600 hover:text-white transition-colors"
            >
              <PenSquareIcon className="w-4 h-4" />
            </Link>
            <button
              onClick={(e) => handleDelete(e, task.id)}
              className="p-2 bg-gray-800 text-gray-300 rounded hover:bg-red-600 hover:text-white transition-colors"
            >
              <Trash2Icon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {task.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">
            Priority:{" "}
            <strong className={getPriorityColor(task.priority)}>
              {task.priority}
            </strong>
          </span>
          <span className="text-xs text-gray-500">
            Due:{" "}
            <strong className="text-gray-300">
              {formatDate(task.due_date)}
            </strong>
          </span>

          <span className="text-xs text-gray-500">
            Status:{" "}
            <strong className={getStatusColor(task.status)}>
              {task.status}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
