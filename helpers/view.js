/**
 * Gets a list of managers by the department ID.
 * @param {PromiseConnection} db An instance of the database
 * @param {Integer} deptId An id of the managers' department
 * @returns {Array} A list of manager
 */
async function getManagersByDept(db, deptId) {
  const sql = `SELECT E.id AS managers_id,
                      CONCAT(E.first_name, " ", E.last_name) AS manager_name
                 FROM employee E
                 JOIN role R
                   ON E.role_id = R.id
                 JOIN department D
                   ON R.department_id = D.id
                WHERE D.id = ?
                  AND E.manager_id IS NULL`;

  try {
    const [rows, fields] = await db.execute(sql, [deptId]);

    return rows;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Gets a list of roles by the department ID.
 * @param {PromiseConnection} db An instance of the database
 * @param {Integer} deptId An id of the managers' department
 * @returns {Array} A list of roles
 */
async function getRolesByDept(db, deptInfo) {
  const sql = `SELECT id AS role_id, 
                      title AS role_name
                 FROM role
                WHERE department_id = ?`

  try {
    const [rows, fields] = await db.execute(sql, [deptInfo]);
    
    return rows;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Retrieves the data for all department.
 * @param {PromiseConnection} db An instance of the database
 * @returns {Array} A list of all departments
 */
async function viewAllDepartments(db) {
  const sql = `SELECT id,
                      name
                 FROM department`;

  try {
    const [rows, fields] = await db.execute(sql);
    
    return rows;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Retrieves the data for all roles.
 * @param {PromiseConnection} db An instance of the database
 * @returns {Array} A list of all roles
 */
async function viewAllRoles(db) {
  const sql = `SELECT R.id,
                      title,
                      name AS department_name,
                      CONCAT('$', FORMAT(salary, 2)) AS salary
                 FROM role R
                 JOIN department D
                   ON R.department_id = D.id
                ORDER BY D.id, salary DESC`;
  
  try {
    const [rows, fields] = await db.execute(sql);
    
    return rows;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Retrieves the data for all employees.
 * @param {PromiseConnection} db An instance of the database
 * @returns {Array} A list of all employees
 */
async function viewAllEmployees(db) {
  const sql = `SELECT E.id AS employee_id,
                      CONCAT(E.first_name, " ", E.last_name) AS employee_name,
                      title AS role,
                      CONCAT('$', FORMAT(salary, 2)) AS income,
                      name AS department,
                      IF(E.manager_id IS NOT NULL, CONCAT(M.first_name, " ", M.last_name), NULL) AS manager_name
                 FROM employee E
                 JOIN role R
                   ON E.role_id = R.id
                 JOIN department D
                   ON R.department_id = D.id
                 LEFT JOIN employee M
                   ON E.manager_id = M.id
                ORDER BY D.id, income DESC, employee_id`;

  try {
    const [rows, fields] = await db.execute(sql);
    
    return rows;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Displays the view results based on the routing data provided.
 * @param {PromiseConnection} db An instance of the database
 * @param {String} route The route of the query
 * @param {Integer} filter A id to filter against
 */
async function getViewResults(db, route, filter=0) {
  let results;

  switch (route) {
    case 'Departments':
    case 'viewDept':
      results = await viewAllDepartments(db);
      break;
    case 'Roles':
    case 'viewRole':
      results = await viewAllRoles(db);
      break;
    case 'Employees':
    case 'viewEmp':
      results = await viewAllEmployees(db);
      break;
    case 'ManagersByDept':
      results = await getManagersByDept(db, filter);
      break;
    case 'RolesByDept':
      results = await getRolesByDept(db, filter);
      break;
  }

  return results;
}

module.exports = getViewResults;
