import { Request, Response } from "express";
import { CallbackError } from "mongoose";
import Todo, { TodoDoc } from "../models/todo.model";

type ExpressFn = (req: Request, res: Response) => void;

const getAllTodos = <ExpressFn>function (_req, res) {
  Todo.find((err, todos) => {
    if (err) {
      console.log(err);
    } else {
      // send (all) Todos as JSON.
      res.json(todos);
    }
  });
};

const getTodoById = <ExpressFn>function (req, res) {
  const id = req.params.id;
  Todo.findById(id, (err: CallbackError, todo: TodoDoc) => {
    if (err) {
      console.log(err);
    } else {
      // send the Todo as JSON.
      res.json(todo);
    }
  });
};

const updateTodoById = <ExpressFn>function (req, res) {
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
          res.json("Todo updated!");
        })
        .catch((_err) => {
          res.status(400).send("Update not possible");
        });
    }
  });
};

const addTodo = <ExpressFn>function (req, res) {
  const todo = new Todo(req.body);
  todo
    .save()
    .then((_todo) => {
      res.status(200).json({ todo: "Todo added successfully" });
    })
    .catch((_err) => {
      res.status(400).send("could not add new Todo");
    });
};

const deleteTodoById = <ExpressFn>function (req, res) {
  const todoId = req.params.id;
  Todo.findByIdAndDelete(todoId, null, (err, _doc) => {
    if (err) {
      console.log(err);
    } else {
      // send the Todo as JSON.
      res.json(`Todo with ID ${todoId} successfully deleted.`);
    };
  })
}

export { getAllTodos, getTodoById, updateTodoById, addTodo, deleteTodoById };
