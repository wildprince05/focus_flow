const quotes = [
  { text: 'Focus is the art of knowing what to ignore.', author: 'Unknown' },
  { text: 'Small daily improvements lead to stunning results.', author: 'Robin Sharma' },
  { text: 'Discipline is choosing between what you want now and what you want most.', author: 'Abraham Lincoln' },
  { text: 'Code is read more than it is written. Focus deeply when you write.', author: 'FocusFlow' },
  { text: 'Consistency beats intensity every single time.', author: 'Unknown' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Deep work is the superpower of the 21st century.', author: 'Cal Newport' },
  { text: 'One Pomodoro at a time builds empires.', author: 'FocusFlow' },
  { text: 'Your future self will thank you for this session.', author: 'FocusFlow' },
  { text: 'Clarity comes from action, not thought.', author: 'Unknown' },
  { text: 'Ship one focused block today. Momentum follows.', author: 'FocusFlow' },
  { text: 'Distraction is the enemy of craftsmanship.', author: 'Unknown' },
];

const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

module.exports = { quotes, getRandomQuote };
