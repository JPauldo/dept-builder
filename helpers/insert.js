const getViewResults = require('./view');

/**
 * Inserts the department data.
 * @param {PromiseConnection} db An instance of the database
 * @param {Object} departmentData The data of the department
 */
async function addDepartment(db, departmentData) {
  const sql = `INSERT INTO department (name)
                    VALUES (?)`;
  const deptInfo = Object.values(departmentData);

  try {
    await db.execute(sql, deptInfo);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Inserts the role data.
 * @param {PromiseConnection} db An instance of the database
 * @param {Object} roleData The data of the role
 */
async function addRole(db, roleData) {
  const sql = `INSERT INTO role (title, salary, department_id)
                    VALUES (?, ?, ?)`;

  const roleInfo = Object.values(roleData);

  try {
    await db.execute(sql, roleInfo);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Inserts the employee data.
 * @param {PromiseConnection} db An instance of the database
 * @param {Object} employeeData The data for the employee
 */
async function addEmployee(db, employeeData) {
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, ?);`;
  let firstName, lastName, roleId, managerId;
  
  if (employeeData.managerId) {
    ({ firstName, lastName, roleId, managerId } = employeeData);
  } else {
    ({ firstName, lastName, roleId } = employeeData);
    managerId = null;
  }
  const employeeInfo = [firstName, lastName, roleId, managerId];

  try {
    await db.execute(sql, employeeInfo);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Displays the insert results based on the routing data provided.
 * @param {PromiseConnection} db An instance of the database
 * @param {Object} addData The data for the INSERT
 */
async function getAddResults(db, addData) {
  let results;

  if (Object.hasOwn(addData, 'deptName')) {
    await addDepartment(db, addData);
    results = await getViewResults(db, 'Departments');
  } 
  else if (Object.hasOwn(addData, 'title')) {
    await addRole(db, addData);
    results = await getViewResults(db, 'Roles');
  } 
  else {
    await addEmployee(db, addData);
    results = await getViewResults(db, 'Employees');
  }

  return results
}

module.exports = getAddResults;
