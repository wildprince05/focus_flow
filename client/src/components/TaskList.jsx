import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { taskAPI } from '../services/api';

const PRIORITY_STYLES = {
  high: 'bg-red-500/10 text-red-600 dark:text-red-400',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  low: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
};

const SortableTask = ({ task, onToggle, onDelete, isActive, onSelect }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass-light group flex items-center gap-3 rounded-xl p-3 transition-all ${
        isActive ? 'ring-2 ring-indigo-500/50' : ''
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-zinc-400 hover:text-zinc-600 active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        ⋮⋮
      </button>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
      />
      <button
        onClick={() => onSelect(task._id)}
        className={`flex-1 text-left text-sm ${task.completed ? 'line-through text-zinc-400' : ''}`}
      >
        {task.title}
      </button>
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}>
        {task.priority}
      </span>
      {task.pomodorosCompleted > 0 && (
        <span className="text-xs text-zinc-400">🍅 {task.pomodorosCompleted}</span>
      )}
      <button
        onClick={() => onDelete(task._id)}
        className="opacity-0 text-zinc-400 transition-opacity group-hover:opacity-100 hover:text-red-500"
      >
        ×
      </button>
    </div>
  );
};

const TaskList = ({ tasks, setTasks, activeTaskId, onSelectTask }) => {
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setLoading(true);
    try {
      const { data } = await taskAPI.create({ title: newTitle.trim(), priority });
      setTasks((prev) => [...prev, data.task]);
      setNewTitle('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (task) => {
    try {
      const { data } = await taskAPI.update(task._id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? data.task : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await taskAPI.delete(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      if (activeTaskId === id) onSelectTask(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t._id === active.id);
    const newIndex = tasks.findIndex((t) => t._id === over.id);
    const reordered = arrayMove(tasks, oldIndex, newIndex);
    setTasks(reordered);

    try {
      await taskAPI.reorder(
        reordered.map((t, i) => ({ id: t._id, order: i }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a task..."
          className="input-field flex-1"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="input-field w-28"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button type="submit" disabled={loading} className="btn-primary shrink-0">
          Add
        </button>
      </form>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {tasks.map((task) => (
              <SortableTask
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
                isActive={activeTaskId === task._id}
                onSelect={onSelectTask}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {tasks.length === 0 && (
        <p className="py-8 text-center text-sm text-zinc-400">No tasks yet. Add one above.</p>
      )}
    </div>
  );
};

export default TaskList;
