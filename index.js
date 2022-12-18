// All required modules
const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { exit } = require('process');

// Helper functions
const getViewResults = require('./helpers/view');
const getAddResults = require('./helpers/insert');
const getUpdateResults = require('./helpers/update');

/**
 * Displays the results from the queries.
 * @param {PromiseConnection} db An instance of the database
 * @param {Object} response The user's response
 * @param {String} route Determines which route to take
 * @returns {String} Sets menu key back to 'main'
 */
async function displayResults(db, response, route) {

  if (route.startsWith('view')) {
    response = route;
    results = await getViewResults(db, response);
  } 
  else if (route.startsWith('add')) {    
    results = await getAddResults(db, response);
  } 
  else if (route.startsWith('upd')) {    
    results = await getUpdateResults(db, response);
  }

  // console.clear();
  console.table(results);

  return 'main';
}

/**
 * Gets the question-based on the key provided.
 * @param {Object} questionObj Comprised of a questions key and a database instance
 * @returns {Array} List of questions
 */
function getQuestions(questionObj) {
  const db = questionObj.db;
  const key = questionObj.key;

  const questions = {
    main: [
      {
        type: 'list',
        name: 'main',
        message: 'What would you like do?',
        choices: [
          { name: 'View All Departments', value: 'viewDept' }, 
          { name: 'View All Roles', value: 'viewRole' }, 
          { name: 'View All Employees', value: 'viewEmp' }, 
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
        name: 'deptName',
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
          const results = await getViewResults(db, 'Departments');

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
        message: 'Please enter their last name.'
      },
      {
        type: 'list',
        name: 'deptId',
        message: 'What region do they work in?',
        choices: async function () {
          const results = await getViewResults(db, 'Departments');

          return results.map((row) => ({ name: row.name, value: row.id }));
        } 
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'What is their trainer class?',
        choices: async function (answers) {
          const results = await getViewResults(db, 'RolesByDept', [{ Department: answers.deptId }]);

          return results.map((row) => ({ name: row.title, value: row.role_id }));
        }
      },
      {
        type: 'list',
        name: 'managerId',
        message: 'Who is their manager?',
        choices: async function (answers) {
          const results = await getViewResults(db, 'ManagersByDept', [{ Department: answers.deptId }]);

          return results.map((row) => ({ name: row.employee_name, value: row.managers_id }))
        },
        when: async function (answers) {
          const results = await getViewResults(db, 'ManagersByDept', [{ Department: answers.deptId }]);

          return results.length > 0 ? true : false;
        }
      }
    ],
    updEmpRole: [
      {
        type: 'list',
        name: 'empId',
        message: 'Whose role would you like to update?',
        choices: async function () {
          const results = await getViewResults(db, 'Employees');

          return results.map((row) => ({ name: row.employee_name, value: row.employee_id }));
        }
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'What role would you like them to have?',
        choices: async function () {
          const results = await getViewResults(db, 'Roles');

          return results.map((row) => ({ name: row.title, value: row.role_id }));
        }
      }
    ]
  }
  
  return questions[key];
}

/**
 * Prompts the questions.
 * @param {Object} questionObj 
 * @returns {Object} The answer/set of answers 
 */
async function promptQuestions(questionObj) {
  const questions = getQuestions(questionObj);

  let answer = await inquirer.prompt(questions);
  
  // Sets the answer to the question key if the main menu
  if(answer.main) {
    questionObj.key = answer.main;
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
    const startingKey = menu.key;
    let response = await promptQuestions(menu);

    if (startingKey === menu.key || menu.key.includes('view')) {
      menu.key = await displayResults(db, response, menu.key);
    }
    else {
      console.clear();
      continue;
    }
  }

  // Exits the application
  console.log('Exiting...');
  exit();
}

init();
