import * as taskService from "../services/taskService.js";

export async function addTasks(req, res) {
  try {
    const result = await taskService.createTask(req.user.id, req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getTasks(req, res) {
  try {
    const result = await taskService.getTasks(req.user.id, req.query);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getTaskById(req, res) {
  try {
    const result = await taskService.getTaskById(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (e) {
    if (e.message === "Task not found") {
      return res.status(404).json({ error: e.message });
    }
    res.status(500).json({ error: e.message });
  }
}

export async function updateTask(req, res) {
  try {
    const result = await taskService.updateTask(
      req.params.id,
      req.user.id,
      req.body,
    );
    res.status(200).json(result);
  } catch (e) {
    if (e.message === "Task not found or not authorized") {
      return res.status(404).json({ error: e.message });
    }
    res.status(500).json({ error: e.message });
  }
}

export const deleteTask = async (req, res) => {
  try {
    const result = await taskService.deleteTask(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (e) {
    if (e.message === "Task not found or not authorized") {
      return res.status(404).json({ error: e.message });
    }
    res.status(500).json({ error: e.message });
  }
};
