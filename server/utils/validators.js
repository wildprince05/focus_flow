const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const sessionSchema = Joi.object({
  type: Joi.string().valid('focus', 'shortBreak', 'longBreak').default('focus'),
  duration: Joi.number().integer().min(1).max(120).required(),
  taskId: Joi.string().hex().length(24).allow(null, ''),
  notes: Joi.string().max(500).allow(''),
});

const taskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  priority: Joi.string().valid('high', 'medium', 'low').default('medium'),
  dueDate: Joi.date().allow(null),
});

const taskUpdateSchema = Joi.object({
  title: Joi.string().min(1).max(200),
  completed: Joi.boolean(),
  priority: Joi.string().valid('high', 'medium', 'low'),
  order: Joi.number().integer().min(0),
  dueDate: Joi.date().allow(null),
});

const reorderSchema = Joi.object({
  tasks: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().hex().length(24).required(),
        order: Joi.number().integer().min(0).required(),
      })
    )
    .required(),
});

const settingsSchema = Joi.object({
  focusDuration: Joi.number().integer().min(1).max(90),
  shortBreakDuration: Joi.number().integer().min(1).max(30),
  longBreakDuration: Joi.number().integer().min(1).max(60),
  sessionsBeforeLongBreak: Joi.number().integer().min(2).max(10),
  soundEnabled: Joi.boolean(),
  notificationsEnabled: Joi.boolean(),
  theme: Joi.string().valid('light', 'dark', 'system'),
  ambientSound: Joi.string().valid('none', 'rain', 'cafe', 'white-noise'),
});

const journalSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
  mood: Joi.string().valid('great', 'good', 'okay', 'tired', 'stressed').default('good'),
  sessionId: Joi.string().hex().length(24).allow(null, ''),
});

const reflectionSchema = Joi.object({
  reflection: Joi.string().max(1000).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  sessionSchema,
  taskSchema,
  taskUpdateSchema,
  reorderSchema,
  settingsSchema,
  journalSchema,
  reflectionSchema,
};
