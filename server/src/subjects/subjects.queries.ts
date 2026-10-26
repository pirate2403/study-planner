export const findAllSubjectsQuery = `
  SELECT id, name FROM subjects ORDER BY name
`;

export const createSubjectQuery = `
  INSERT INTO subjects (name) VALUES ($1) RETURNING id, name
`;

export const updateSubjectQuery = `
  UPDATE subjects SET name = $2 WHERE id = $1 RETURNING id, name
`;

export const deleteSubjectQuery = `
  DELETE FROM subjects WHERE id = $1 RETURNING id
`;
