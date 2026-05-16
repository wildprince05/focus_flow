import { motion } from 'framer-motion';

const QuoteCard = ({ quote }) => {
  if (!quote) return null;
  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      key={quote.text}
      className="glass-light mx-auto max-w-lg rounded-2xl p-6 text-center"
    >
      <p className="text-lg font-medium leading-relaxed text-zinc-700 dark:text-zinc-200">
        &ldquo;{quote.text}&rdquo;
      </p>
      {quote.author && (
        <footer className="mt-3 text-sm text-zinc-500">— {quote.author}</footer>
      )}
    </motion.blockquote>
  );
};

export default QuoteCard;
