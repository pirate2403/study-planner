export const findAllTasksQuery = `
  SELECT
    t.id,
    t.title,
    t.description,
    to_char(t.due_date, 'YYYY-MM-DD') AS "dueDate",
    t.subject_id AS "subjectId",
    s.name AS "subjectName",
    t.created_at AS "createdAt"
  FROM tasks AS t
  JOIN subjects AS s ON s.id = t.subject_id
  WHERE
    ($1::text IS NULL OR strpos(lower(t.title), lower($1::text)) > 0)
    AND ($2::integer IS NULL OR t.subject_id = $2::integer)
  ORDER BY t.id
  LIMIT $3 OFFSET $4
`;

export const findTaskByIdQuery = `
  SELECT
    t.id,
    t.title,
    t.description,
    to_char(t.due_date, 'YYYY-MM-DD') AS "dueDate",
    t.subject_id AS "subjectId",
    s.name AS "subjectName",
    t.created_at AS "createdAt"
  FROM tasks AS t
  JOIN subjects AS s ON s.id = t.subject_id
  WHERE t.id = $1
`;

export const createTaskQuery = `
  INSERT INTO tasks (title, description, due_date, subject_id)
  SELECT $1, $2, $3::date, s.id
  FROM subjects AS s
  WHERE s.id = $4
  RETURNING id
`;

export const deleteTaskQuery = `
  DELETE FROM tasks
  WHERE id = $1
  RETURNING id
`;

export const findSubjectByIdQuery = `
  SELECT id
  FROM subjects
  WHERE id = $1
`;

export const updateTaskQuery = `
  UPDATE tasks
  SET
    title = COALESCE($2::varchar, title),
    description = COALESCE($3::text, description),
    due_date = COALESCE($4::date, due_date),
    subject_id = COALESCE($5::integer, subject_id)
  WHERE id = $1
  RETURNING id
`;

export const countTasksQuery = `
  SELECT COUNT(*)::integer AS total
  FROM tasks AS t
  WHERE
    ($1::text IS NULL OR strpos(lower(t.title), lower($1::text)) > 0)
    AND ($2::integer IS NULL OR t.subject_id = $2::integer)
`;
