// All required modules
const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { exit } = require('process');
const displayViewResults = require('./helpers/view');

/**
 * Gets the question-based on the key provided.
 * @param {Object} questionObj Comprised of a questions key and a database instance
 * @returns {Array} List of questions
 */
function getQuestions(questionObj) {
  const db = questionObj.db;
  const key = questionObj.key

  const questions = {
    main: [
      {
        type: 'list',
        name: 'main',
        message: 'What would you like do?',
        choices: [
          'View All Departments', 
          'View All Roles', 
          'View All Employees', 
          { name: 'Add a Department', value: 'addDept' }, 
          { name: 'Add a Role', value: 'addRole' }, 
          { name: 'Add an Employee', value: 'addEmp' }, 
          { name: 'Update an Employee Role', value: 'updEmpRole' }, 
          'Exit'
        ]
      }
    ],
    addDept: [
      {
        type: 'input',
        name: 'dept',
        message: 'Please enter the name.'
      }
    ],
    addRole: [
      {
        type: 'input',
        name: 'title',
        message: 'Please enter a title.'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Please enter the role\'s salary.'
      },
      {
        type: 'list',
        name: 'dept',
        message: 'Which department is it under?',
        choices: async function () {
          const results = await displayViewResults(db, 'Department');

          return results.map((row) => ({ name: row.name, value: row.id }));
        }
      }
    ],
    addEmp: [
      {
        type: 'input',
        name: 'firstName',
        message: 'Please enter their first name.'
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Please enter their first name.'
      },
      {
        type: 'list',
        name: 'deptId',
        message: 'In which department?',
        choices: async function () {
          const results = await displayViewResults(db, 'Department');

          return results.map((row) => ({ name: row.name, value: row.id }));
        } 
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'What is their role?',
        choices: async function (answers) {
          const results = await displayViewResults(db, 'RoleByDept', answers.deptId);

          return results.map((row) => ({ name: row.role_name, value: row.role_id }));
        }
      },
      {
        type: 'list',
        name: 'managerId',
        message: 'Who is their manager?',
        choices: async function (answers) {
          const results = await displayViewResults(db, 'ManagersByDept', answers.deptId);

          return results.map((row) => ({ name: row.manager_name, value: row.managers_id }))
        },
        when: async function (answers) {
          const results = await displayViewResults(db, 'ManagersByDept', answers.deptId);

          return results.length > 0 ? true : false;
        }
      }
    ],
    updEmpRole: [
      {
        type: 'list',
        name: 'nameId',
        message: 'Whose role would you like to update?',
        choices: async function () {
          const results = await displayViewResults(db, 'Employee');

          return results.map((row) => ({ name: row.employee_name, value: row.id }));
        }
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'What role would you like them to have?',
        choices: async function () {
          const results = await displayViewResults(db, 'Role');

          return results.map((row) => ({ name: row.title, value: row.id }));
        }
      }
    ]
  }
  
  return questions[key];
}

/**
 * Displays the insert results based on the routing data provided.
 * @param {PromiseConnection} db An instance of the database
 * @param {String} route The route of the query
 * @param {Object} addData The data for the INSERT
 */
async function displayAddResults(db, route, addData) {
  let results;

  if (route.endsWith('Dept')) {
    await addDepartment(db, addData);
    results = await viewAllDepartments(db);
  } 
  else if (route.endsWith('Role')) {
    await addRole(db, addData);
    results = await viewAllRoles(db);
  } 
  else {
    await addEmployee(db, addData);
    results = await viewAllEmployees(db);
  }
  
  console.clear();
  console.table(results);
}

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
 * Displays the update results based on the routing data provided.
 * @param {PromiseConnection} db An instance of the database
 * @param {String} route The route of the query
 * @param {Object} updData The data for the UPDATE
 */
async function displayUpdateResults(db, route, updData) {
  let results;
  let updatedRow;

  if (route.endsWith('EmpRole')) {
    await updateEmployeeRole(db, updData);
    results = await viewAllEmployees(db);
    updatedRow = results.filter((row) => row.id === updData.nameId);
  } else {
    results = []
    updatedRow = results;
  }

  console.clear();
  console.table(updatedRow);
}

/**
 * 
 * @param {PromiseConnection} db An instance of the database
 * @param {Object} empRoleData The data for employee role
 */
async function updateEmployeeRole(db, empRoleData) {
  const sql = `UPDATE employee
                  SET role_id = ?
                WHERE id = ?`;
  const { roleId, nameId } = empRoleData;
  const empRoleInfo = [roleId, nameId]

  try {
    await db.execute(sql, empRoleInfo);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Prompts the questions.
 * @param {Object} questionObj 
 * @returns {String/Object} The answer/set of answers 
 */
async function promptQuestions(questionObj) {
  const questions = getQuestions(questionObj);

  let answer = await inquirer.prompt(questions);
  
  // Sets the answer to the question key if the main menu
  if(answer.main) {
    const { main } = answer;
    answer = main;
  }

  return answer;
}

/**
 * Creates an object that will be used to get the questions for the prompt.
 * @param {PromiseConnection} db An instance of the database
 * @returns {Object} A question object containing a key and a database instance 
 */
function createQuestionObject(db) {
  const questionObj = {};
  
  questionObj.key = 'main';
  questionObj.db = db;

  return questionObj;
}

/**
 * The main function for the application.
 */
async function init() {
  // Establishes the connection to the database
  const db = await mysql.createConnection({host:'localhost',
                                           user: 'root',
                                           password: 'MySeekerQwil904',
                                           database: 'pokemon_league'});
  
  let menu = createQuestionObject(db);

  while(menu.key !== 'Exit') {
    let response = await promptQuestions(menu);

    if (response.startsWith('View')) {      
      await displayViewResults(db, response);
    } 
    else if (response.startsWith('add')) {
      menu.key = response;
      response = await promptQuestions(menu);
      
      await displayAddResults(db, menu.key, response);

      menu.key = 'main';
    } 
    else if (response.startsWith('upd')) {
      menu.key = response;
      response = await promptQuestions(menu);
      
      await displayUpdateResults(db, menu.key, response);

      menu.key = 'main';
    } 
    else {
      console.log('Exiting...');
      menu.key = response;
    }

  }

  // Exits the application
  exit();
}

init();
