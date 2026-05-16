const Task = require('../models/Task');

const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, tasks });
};

const createTask = async (req, res) => {
  const count = await Task.countDocuments({ user: req.user._id });
  const task = await Task.create({
    ...req.body,
    user: req.user._id,
    order: count,
  });
  res.status(201).json({ success: true, task });
};

const updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  res.json({ success: true, task });
};

const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  res.json({ success: true, message: 'Task deleted' });
};

const reorderTasks = async (req, res) => {
  const updates = req.body.tasks.map(({ id, order }) =>
    Task.findOneAndUpdate({ _id: id, user: req.user._id }, { order })
  );
  await Promise.all(updates);
  const tasks = await Task.find({ user: req.user._id }).sort({ order: 1 });
  res.json({ success: true, tasks });
};

module.exports = { getTasks, createTask, updateTask, deleteTask, reorderTasks };
