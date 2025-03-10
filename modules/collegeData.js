const fs = require("fs");

let students = [];
let courses = [];

module.exports.initialize = function() {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/students.json', 'utf8', (err, data) => {
      if (err) {
        reject("Unable to read students.json");
        return;
      }
      students = JSON.parse(data);
      fs.readFile('./data/courses.json', 'utf8', (err, data) => {
        if (err) {
          reject("Unable to read courses.json");
          return;
        }
        courses = JSON.parse(data);
        resolve();
      });
    });
  });
};

module.exports.getAllStudents = () => {
  return new Promise((resolve, reject) => {
    if (students.length === 0) {
      reject("no results returned");
    } else {
      resolve(students);
    }
  });
};

module.exports.getTAs = () => {
  return new Promise((resolve, reject) => {
    const tas = students.filter(student => student.TA === true);
    if (tas.length === 0) {
      reject("no results returned");
    } else {
      resolve(tas);
    }
  });
};

module.exports.getCourses = () => {
  return new Promise((resolve, reject) => {
    if (courses.length === 0) {
      reject("no results returned");
    } else {
      resolve(courses);
    }
  });
};

module.exports.getStudentsByCourse = function(course) {
  return new Promise((resolve, reject) => {
    const filtered = students.filter(s => s.course == course);
    if (filtered.length > 0) {
      resolve(filtered);
    } else {
      reject("no results returned");
    }
  });
};

module.exports.getStudentByNum = function(num) {
  return new Promise((resolve, reject) => {
    const student = students.find(s => s.studentNum == num);
    if(student) {
      resolve(student);
    } else {
      reject("no results returned");
    }
  });
};

module.exports.addStudent = function(studentData) {
  return new Promise((resolve, reject) => {
    studentData.TA = (studentData.TA === undefined) ? false : true;
    studentData.studentNum = students.length + 1;
    students.push(studentData);
    resolve();
  });
};
