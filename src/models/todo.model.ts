import mongoose from "mongoose";

export interface TodoDoc extends mongoose.Document {
  description: string,
  responsible: string,
  priority: string,
  completed: boolean
}

const Todo = new mongoose.Schema(
  {
    description: {
      type: String
    },
    responsible: {
      type: String
    },
    priority: {
      type: String
    },
    completed: {
      type: Boolean
    }
  }
);

// define the model
export default mongoose.model<TodoDoc>('Todo', Todo);
