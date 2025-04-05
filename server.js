/*********************************************************************************
*  WEB700 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Beatriz Alves Student ID: 112419247 Date: 25/04/05
*
*  Online (Vercel) Link: ________________________________________________________
*
hiii teacher!! have a good summer breakkkk!

********************************************************************************/ 
const ejs = require("ejs");
const express = require("express");
const path = require("path");
require("pg");
const collegeData = require("./modules/collegeData.js");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.engine("ejs", ejs.__express);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use((req, res, next) => {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    "/" +
    (isNaN(route.split("/")[1])
      ? route.replace(/\/(?!.*)/, "")
      : route.replace(/\/(.*)/, ""));
  next();
});

app.post("/students/add", (req, res) => {
  collegeData.addStudent(req.body)
    .then(() => res.redirect("/students"))
    .catch(err => res.json({ message: err }));
});

// Updated "/students/add" GET route to pass courses data
app.get("/students/add", (req, res) => {
  collegeData.getCourses()
    .then(data => res.render("addStudent", { courses: data }))
    .catch(() => res.render("addStudent", { courses: [] }));
});

app.get("/courses/add", (req, res) => {
  res.render("addCourse");
});

app.post("/courses/add", (req, res) => {
  collegeData.addCourse(req.body)
    .then(() => res.redirect("/courses"))
    .catch(err => res.json({ message: err }));
});

app.post("/course/update", (req, res) => {
  collegeData.updateCourse(req.body)
    .then(() => res.redirect("/courses"))
    .catch(err => res.json({ message: err }));
});

app.get("/students", (req, res) => {
  if (req.query.course) {
    collegeData.getStudentsByCourse(req.query.course)
      .then(data => {
        if (data.length > 0) {
          res.render("students", { students: data });
        } else {
          res.render("students", { message: "no results" });
        }
      })
      .catch(() => {
        res.render("students", { message: "no results" });
      });
  } else {
    collegeData.getAllStudents()
      .then(data => {
        if (data.length > 0) {
          res.render("students", { students: data });
        } else {
          res.render("students", { message: "no results" });
        }
      })
      .catch(() => {
        res.render("students", { message: "no results" });
      });
  }
});

app.get("/courses", (req, res) => {
  collegeData.getCourses()
    .then(data => {
      if (data.length > 0) {
        res.render("courses", { courses: data });
      } else {
        res.render("courses", { message: "no results" });
      }
    })
    .catch(() => {
      res.render("courses", { message: "no results" });
    });
});

app.get("/student/:num", (req, res) => {
  collegeData.getStudentByNum(req.params.num)
    .then(data => res.render("student", { student: data }))
    .catch(() => res.json({ message: "no results" }));
});

// New route to delete a student
app.get("/student/delete/:studentNum", (req, res) => {
  collegeData.deleteStudentByNum(req.params.studentNum)
    .then(() => res.redirect("/students"))
    .catch(() => res.status(500).send("Unable to Remove Student / Student not found"));
});

app.get("/course/:id", (req, res) => {
  collegeData.getCourseById(req.params.id)
    .then(data => {
      if (!data) {
        res.status(404).send("Course Not Found");
      } else {
        res.render("course", { course: data });
      }
    })
    .catch(err => {
      res.json({ message: err });
    });
});

app.get("/course/delete/:id", (req, res) => {
  collegeData.deleteCourseById(req.params.id)
    .then(() => res.redirect("/courses"))
    .catch(() => res.status(500).send("Unable to Remove Course / Course not found"));
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/htmlDemo", (req, res) => {
  res.render("htmlDemo");
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

collegeData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("server listening on port: " + HTTP_PORT);
    });
  })
  .catch(err => {
    console.log("Failed to initialize data: " + err);
  });
