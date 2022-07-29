//Variables required
const express = require("express");
const { render } = require("express/lib/response");
const { projects } = require("./data.json");
const app = express();

//Middleware
app.set("view engine", "pug");
app.use("/static", express.static("public"));

//Port
app.listen(3001, () => {
  console.log("The application is listening on localhost 3001!");
});

//Routes
app.get("/", (req, res, next) => {N
  res.render("index", { projects });
});

app.get("/about", (req, res, next) => {
  res.render("about");
});

app.get("/projects/:id", (req, res, next) => {
  const projectId = req.params.id;
  const project = projects.find(({ id }) => id === +projectId);
  if (project) {
    res.render("project", { project });
  } else {
    const err = new Error('not found');
    err.status = 404;
    err.message = `Looks like the quote you requested doesn't exist`;
    res.render("error", { err });
  }
});

//Erros handlers
//404 Error
app.use((req, res, next) => {
  const err = new Error("not-found");
  err.status = 404;
  err.message = "404 error handler has been called";
  next(err);
});

//Global Error
app.use((err, req, res) => {
  if (err) {
    if (err.status === 404) {
      res.status(404)
      render(err.message, { err });
    } else {
      err.message = "Oops! There seems to be an error with the server";
      res.status(500).render('error', { err });
    }
  }
});