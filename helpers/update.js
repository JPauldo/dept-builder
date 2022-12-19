const getViewResults = require('./view');

/**
 * 
 * @param {PromiseConnection} db An instance of the database
 * @param {Object} empRoleData The data for employee role
 */
async function updateEmployeeRole(db, empRoleData) {
  const sql = `UPDATE employee
                  SET role_id = ?
                WHERE id = ?`;
  const { roleId, empId } = empRoleData;
  const empRoleInfo = [roleId, empId]

  try {
    await db.execute(sql, empRoleInfo);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Displays the update results based on the routing data provided.
 * @param {PromiseConnection} db An instance of the database
 * @param {Object} updData The data for the UPDATE
 */
async function getUpdateResults(db, updData) {
  let results;
  console.log(updData);

  if (Object.hasOwn(updData, 'empId')) {
    await updateEmployeeRole(db, updData);
    
    results = await getViewResults(db, 'EmployeeById', [{ Employee: updData.empId }]);
  } 
  else {
    results = [];
  }

  return results;
}

module.exports = getUpdateResults;
