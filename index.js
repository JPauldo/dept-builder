// All required modules
const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { exit } = require('process');

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
    ]
  }
  
  return questions[key];
}

/**
 * Gets a list of managers by the department ID.
 * @param {PromiseConnection} db An instance of the database
 * @param {Integer} deptId An id of the managers' department
 * @returns {Array} A list of manager
 */
async function getManagersByDept(db, deptId) {
  return;
}

/**
 * Gets a list of roles by the department ID.
 * @param {PromiseConnection} db An instance of the database
 * @param {Integer} deptId An id of the managers' department
 * @returns {Array} A list of roles
 */
async function getRoleByDept(db, deptInfo) {
  return;
}

/**
 * Displays the view results based on the routing data provided.
 * @param {PromiseConnection} db An instance of the database
 * @param {String} routeString The route of the query
 */
async function displayViewResults(db, routeString) {
}

/**
 * Retrieves the data for all department.
 * @param {PromiseConnection} db An instance of the database
 * @returns {Array} A list of all departments
 */
async function viewAllDepartments(db) {
  return;
}

/**
 * Retrieves the data for all roles.
 * @param {PromiseConnection} db An instance of the database
 * @returns {Array} A list of all roles
 */
async function viewAllRoles(db) {
  return;
}

/**
 * Retrieves the data for all employees.
 * @param {PromiseConnection} db An instance of the database
 * @returns {Array} A list of all employees
 */
async function viewAllEmployees(db) {
  return;
}

/**
 * Displays the insert results based on the routing data provided.
 * @param {PromiseConnection} db An instance of the database
 * @param {String} route The route of the query
 * @param {Object} addData The data for the INSERT
 */
async function displayAddResults(db, route, addData) {
}

/**
 * Inserts the department data.
 * @param {PromiseConnection} db An instance of the database
 * @param {Object} departmentData The data of the department
 */
async function addDepartment(db, departmentData) {
}

/**
 * Inserts the role data.
 * @param {PromiseConnection} db An instance of the database
 * @param {Object} roleData The data of the role
 */
async function addRole(db, roleData) {
}

/**
 * Inserts the employee data.
 * @param {PromiseConnection} db An instance of the database
 * @param {Object} employeeData The data for the employee
 */
async function addEmployee(db, employeeData) {
}

/**
 * Displays the update results based on the routing data provided.
 * @param {PromiseConnection} db An instance of the database
 * @param {String} route The route of the query
 * @param {Object} updData The data for the UPDATE
 */
async function displayUpdateResults(db, route, updData) {
}

/**
 * 
 * @param {PromiseConnection} db An instance of the database
 * @param {Object} empRoleData The data for employee role
 */
async function updateEmployeeRole(db, empRoleData) {
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
    } else {
      console.log('Exiting...');
      menu.key = response;
    }

  }

  // Exits the application
  exit();
}

init();
