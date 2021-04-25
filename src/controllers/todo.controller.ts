import { Request, Response } from "express";
import { CallbackError } from "mongoose";
import Todo, { TodoDoc } from "../models/todo.model";

/**
 * This function takes a Request and sends back a Response,
 * this is not middleware
 */
type ResponseFn = (req: Request, res: Response) => void;

/**
 * return all the Todos, sending back a 404 if there is an error
 */
const getAllTodos = <ResponseFn>function (_req, res) {
  Todo.find((err, todos) => {
    if (err) {
      res.status(404).send("Data not found");
    } else {
      res.json(todos);
    }
  });
};


/**
 * return the Todo with an ID matching that which is given in the request URL
 * params, if it is not found it sends back a 404
 */
const getTodoById = <ResponseFn>function (req, res) {
  const id = req.params.id;
  Todo.findById(id, (err: CallbackError, todo: TodoDoc) => {
    if (err) {
      res.status(404).send("Data not found");
    } else {
      // send the Todo as JSON.
      res.json(todo);
    }
  });
};


/**
 * Finds the Todo with an ID matching that which is given in the request URL
 * params, if it is not found it sends back a 404. Otherwise, it modifies it
 * based on what was passed in the request body and saves it, sending back a
 * 400 is it fails then.
 */
const updateTodoById = <ResponseFn>function (req, res) {
  const id = req.params.id;
  Todo.findById(id, (_err: CallbackError, todo: TodoDoc) => {
    if (!todo) {
      res.status(404).send("Data not found");
    } else {
      // update each field
      todo.description = req.body.description;
      todo.responsible = req.body.responsible;
      todo.priority = req.body.priority;
      todo.completed = req.body.completed;

      todo
        .save()
        .then((_todo) => {
          res.send("Todo updated!");
        })
        .catch((_err) => {
          res.status(400).send("Update not possible");
        });
    }
  });
};

/**
 * Adds a new Todo, based on the request body, sending back 400 if error
 */
const addTodo = <ResponseFn>function (req, res) {
  const todo = new Todo(req.body);
  todo
    .save()
    .then((_todo) => {
      res.status(200).send("Todo added successfully");
    })
    .catch((_err) => {
      res.status(400).send("could not add new Todo");
    });
};

/**
 * Deletes a Todo with the ID that was given in the request URL params,
 * sending back a message indicating if it was a successful or not.
 */
const deleteTodoById = <ResponseFn>function (req, res) {
  const todoId = req.params.id;
  Todo.findByIdAndDelete(todoId, null, (err, _doc) => {
    if (err) {
      res.send(err);
    } else {
      // send the Todo as JSON.
      res.send(`Todo with ID ${todoId} successfully deleted.`);
    };
  })
}

export { getAllTodos, getTodoById, updateTodoById, addTodo, deleteTodoById };
