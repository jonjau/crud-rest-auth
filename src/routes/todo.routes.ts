import express from "express";
import {
  addTodo,
  deleteTodoById,
  getAllTodos,
  getTodoById,
  updateTodoById,
} from "../controllers/todo.controller";
import {
  authJwt, authorize
} from "../middleware/authorize";
import Role from "../models/role";

const router = express.Router();

router.get("/", authJwt, authorize(), getAllTodos);
router.get("/:id", authJwt, authorize(), getTodoById);
router.post("/update/:id", authJwt, authorize([Role.Admin]), updateTodoById);
router.post("/add", authJwt, authorize([Role.Admin]), addTodo);
router.delete("/delete/:id", authJwt, authorize([Role.Admin]), deleteTodoById);

export default router;
