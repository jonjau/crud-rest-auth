import express from "express";
import cors from "cors";
import router from "./controllers/user.controller";
import errorHandler from "./middleware/error-handler";
import createTestUser from "./util/create-test-user";

// import Todo, { TodoDoc } from "./models/todo";

const app = express();

createTestUser();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/auth", router);

app.use(errorHandler);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`RUNNING ON PORT: ${PORT}`);
});

// // GET / gets all the Todos
// router.route('/').get((err, res) => {
//   console.log(err);
// });

// GET / gets all the Todos
// router.route('/').get((_err, res) => {
//   Todo.find((err, todos) => {
//     if (err) {
//       console.log(err);
//     } else {
//       // send (all) Todos as JSON.
//       res.json(todos);
//     }
//   });
// });

// // GET /:id gets a particular Todo
// router.route('/:id').get((req, res) => {
//   const id = req.params.id;
//   Todo.findById(id, (err: CallbackError, todo: TodoDoc) => {
//     if (err) {
//       console.log(err);
//     } else {
//       // send the Todo as JSON.
//       res.json(todo);
//     }
//   })
// });

// // POST /update/:id updates a particular Todo
// router.route('/update/:id').post((req, res) => {
//   const id = req.params.id;
//   Todo.findById(id, (_err: CallbackError, todo: TodoDoc) => {
//     if (!todo) {
//       res.status(404).send("Data not found");
//     }
//     else {
//       // update each field
//       todo.description = req.body.description;
//       todo.responsible = req.body.responsible;
//       todo.priority = req.body.priority;
//       todo.completed = req.body.completed;

//       todo.save().then(_todo => {
//         res.json('Todo updated!');
//       }).catch(_err => {
//         res.status(400).send('Update not possible');
//       });
//     }
//   });
// });

// // POST /add adds a new Todo
// router.route('/add').post((req, res) => {
//   const todo = new Todo(req.body);
//   todo.save()
//     .then(_todo => {
//       res.status(200).json({ 'todo': 'Todo added successfully' });
//     })
//     .catch(_err => {
//       res.status(400).send('could not add new Todo');
//     });
// });
