import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose, { CallbackError, Query } from 'mongoose';

import Todo, { TodoDoc } from "./models/todo";

const app = express();
const router = express.Router();
const PORT = 4000;

app.use(cors());

// base prefix for Todo API
app.use('/todos', router);

// connect to database
mongoose.connect('mongodb://127.0.0.1:27017/todos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// GET / gets all the Todos
router.route('/').get((_err, res) => {
  Todo.find((err, todos) => {
    if (err) {
      console.log(err);
    } else {
      // send (all) Todos as JSON.
      res.json(todos);
    }
  });
});

// GET /:id gets a particular Todo
router.route('/:id').get((req, res) => {
  const id = req.params.id;
  Todo.findById(id, (err: CallbackError, todo: TodoDoc) => {
    if (err) {
      console.log(err);
    } else {
      // send the Todo as JSON.
      res.json(todo);
    }
  })
});

// POST /update/:id updates a particular Todo
router.route('/update/:id').post((req, res) => {
  const id = req.params.id;
  Todo.findById(id, (_err: CallbackError, todo: TodoDoc) => {
    if (!todo) {
      res.status(404).send("Data not found");
    }
    else {
      // update each field
      todo.description = req.body.description;
      todo.responsible = req.body.responsible;
      todo.priority = req.body.priority;
      todo.completed = req.body.completed;

      todo.save().then(_todo => {
        res.json('Todo updated!');
      }).catch(_err => {
        res.status(400).send('Update not possible');
      });
    }
  });
});

// POST /add adds a new Todo
router.route('/add').post((req, res) => {
  const todo = new Todo(req.body);
  todo.save()
    .then(_todo => {
      res.status(200).json({ 'todo': 'Todo added successfully' });
    })
    .catch(_err => {
      res.status(400).send('could not add new Todo');
    });
});

app.listen(PORT, function () {
  console.log(`RUNNING ON PORT: ${PORT}`);
});