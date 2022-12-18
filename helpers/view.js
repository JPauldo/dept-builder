/**
 * 
 * @param {Array} results A list of data to be filtered
 * @param {Array} filter A list of parameters to filter against
 * @returns {Array} The filtered dataset
 */
function filterResults(results, filter) {
  const name = Object.keys(filter[0])[0];
  const id = Object.values(filter[0])[0];
  let filtered;

  switch (name) {
    case 'Manager':
      filtered = results.filter((row) => row.manager_id === id);
      break;
    case 'Department':
      filtered = results.filter((row) => row.department_id === id);
      break;
    case 'Role':
      filtered = results.filter((row) => row.role_id === id);
      break;
    case 'Employee':
      filtered = results.filter((row) => row.employee_id === id);
      break;
  }
  filter.shift();
  
  if (filter.length > 0) {
    filtered = filterResults(filtered, filter);
  }
  
  return filtered;
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
 * @param {Array} filterBy A list of parameters to filter against (Optional)
 * @returns {Array} A list of all roles
 */
async function viewAllRoles(db, filterBy=[]) {
  const sql = `SELECT R.id AS role_id,
                      D.id AS department_id,
                      title,
                      name AS department_name,
                      CONCAT('$', FORMAT(salary, 2)) AS salary
                 FROM role R
                 JOIN department D
                   ON R.department_id = D.id
                ORDER BY D.id, salary DESC`;
  
  try {
    let [rows, fields] = await db.execute(sql);

    if (filterBy.length > 0) {
      rows = filterResults(rows, filterBy);
    }

    rows.forEach(row => {
      delete row.department_id;
    });
    
    return rows;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Retrieves the data for all employees.
 * @param {PromiseConnection} db An instance of the database
 * @param {Array} filterBy A list of parameters to filter against (Optional)
 * @returns {Array} A list of all employees
 */
async function viewAllEmployees(db, filterBy=[]) {
  const sql = `SELECT E.id AS employee_id,
                      R.id AS role_id,
                      D.id AS department_id,
                      M.id AS manager_id,
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
    let [rows, fields] = await db.execute(sql);

    if (filterBy.length > 0) {
      rows = filterResults(rows, filterBy);
    }

    rows.forEach(row => {
      delete row.role_id;
      delete row.department_id;
      delete row.manager_id;
    });
    
    return rows;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Displays the view results based on the routing data provided.
 * @param {PromiseConnection} db An instance of the database
 * @param {String} route The route of the query
 * @param {Array} filter A list of ids to filter against (Optional)
 * @returns {Object} A list of results
 */
async function getViewResults(db, route, filter=[]) {
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
    case 'EmployeeById':
      results = await viewAllEmployees(db, filter);
      break;
    case 'ManagersByDept':
      filter.unshift({ Manager: null });
      results = await viewAllEmployees(db, filter);
      break;
    case 'RolesByDept':
      results = await viewAllRoles(db, filter);
      break;
  }

  return results;
}

module.exports = getViewResults;
