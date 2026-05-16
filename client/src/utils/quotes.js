export const localQuotes = [
  { text: 'Focus is the art of knowing what to ignore.', author: 'Unknown' },
  { text: 'Small daily improvements lead to stunning results.', author: 'Robin Sharma' },
  { text: 'Discipline is choosing between what you want now and what you want most.', author: 'Abraham Lincoln' },
  { text: 'Deep work is the superpower of the 21st century.', author: 'Cal Newport' },
  { text: 'One Pomodoro at a time builds empires.', author: 'FocusFlow' },
];

export const getLocalQuote = () =>
  localQuotes[Math.floor(Math.random() * localQuotes.length)];
