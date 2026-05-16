const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { taskSchema, taskUpdateSchema, reorderSchema } = require('../utils/validators');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} = require('../controllers/taskController');

router.use(protect);
router.get('/', asyncHandler(getTasks));
router.post('/', validate(taskSchema), asyncHandler(createTask));
router.put('/reorder', validate(reorderSchema), asyncHandler(reorderTasks));
router.put('/:id', validate(taskUpdateSchema), asyncHandler(updateTask));
router.delete('/:id', asyncHandler(deleteTask));

module.exports = router;
