const { Pool } = require('pg');

const pool = new Pool({
  user: 'shafs',
  password: '123',
  host: 'localhost',
  database: 'bootcampx'
});
const cohortName = process.argv[2];
const limit = process.argv[3] || 5;
// Store all potentially malicious values in an array.
const values = [`%${cohortName}%`, limit];
const value1 = [limit];
const queryString1 = `
SELECT id, name, cohort_id
FROM students
LIMIT $1;
`;
pool.query(queryString1, value1)
  .then(res => {
    console.log(res.rows);
  })
  .catch(err => console.error('query error', err.stack));


const queryString2 = `
  SELECT students.id as student_id, students.name as name, cohorts.name as cohort
  FROM students
  JOIN cohorts ON cohorts.id = cohort_id
  LIMIT $1;
  `;
pool.query(queryString2, value1)
  .then(res => {
    res.rows.forEach(user => {
      console.log(`${user.name} has an id of ${user.student_id} and was in the ${user.cohort} cohort`);
    });
  });

const queryString = `
  SELECT students.id as student_id, students.name as name, cohorts.name as cohort
  FROM students
  JOIN cohorts ON cohorts.id = cohort_id
  WHERE cohorts.name LIKE $1
  LIMIT $2;
  `;
pool.query(queryString, values)
  .then(res => {
    res.rows.forEach(user => {
      console.log(`${user.name} has an id of ${user.student_id} and was in the ${user.cohort} cohort`);
    });
  }).catch(err => console.error('query error', err.stack));