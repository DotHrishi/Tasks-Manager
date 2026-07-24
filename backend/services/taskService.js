import pool from "../config/db.js";

export const createTask = async (userId, taskData) => {
  const { title, description, status, priority, due_date } = taskData;
  const result = await pool.query(
    "INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [userId, title, description, status, priority, due_date],
  );
  return result.rows[0];
};

export const getTasks = async (userId, queryParams) => {
  const { status, priority, search, sort, page = 1, limit = 10 } = queryParams;

  let queryStr = "SELECT * FROM tasks WHERE user_id = $1";
  const params = [userId];
  let paramIndex = 2;

  if (status) {
    queryStr += ` AND status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }

  if (priority) {
    queryStr += ` AND priority = $${paramIndex}`;
    params.push(priority);
    paramIndex++;
  }

  if (search) {
    queryStr += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (sort === "dueDate") {
    queryStr += " ORDER BY due_date ASC NULLS LAST";
  } else {
    queryStr += " ORDER BY id DESC";
  }

  const offset = (page - 1) * limit;
  queryStr += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const result = await pool.query(queryStr, params);

  let countQueryStr = "SELECT COUNT(*) FROM tasks WHERE user_id = $1";
  const countParams = [userId];
  let countParamIndex = 2;

  if (status) {
    countQueryStr += ` AND status = $${countParamIndex}`;
    countParams.push(status);
    countParamIndex++;
  }
  if (priority) {
    countQueryStr += ` AND priority = $${countParamIndex}`;
    countParams.push(priority);
    countParamIndex++;
  }
  if (search) {
    countQueryStr += ` AND (title ILIKE $${countParamIndex} OR description ILIKE $${countParamIndex})`;
    countParams.push(`%${search}%`);
  }

  const countResult = await pool.query(countQueryStr, countParams);
  const total = parseInt(countResult.rows[0].count);

  return {
    tasks: result.rows,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
    totalTasks: total,
  };
};

export const getTaskById = async (taskId, userId) => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
    [taskId, userId],
  );
  if (result.rows.length === 0) {
    throw new Error("Task not found");
  }
  return result.rows[0];
};

export const updateTask = async (taskId, userId, taskData) => {
  const { title, description, status, priority, due_date } = taskData;
  const result = await pool.query(
    "UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, due_date = $5 WHERE id = $6 AND user_id = $7 RETURNING *",
    [title, description, status, priority, due_date, taskId, userId],
  );

  if (result.rows.length === 0) {
    throw new Error("Task not found or not authorized");
  }

  return result.rows[0];
};

export const deleteTask = async (taskId, userId) => {
  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
    [taskId, userId],
  );

  if (result.rows.length === 0) {
    throw new Error("Task not found or not authorized");
  }

  return result.rows[0];
};
