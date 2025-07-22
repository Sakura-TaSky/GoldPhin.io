export const ShortCutKey = ({ keys }) => (
  <span>
    {keys.map((key) => (
      <kbd
        key={key}
        className="px-1.5 py-0.5 text-xs text-zinc-400 dark:text-zinc-600 border rounded mx-0.5"
      >
        {key}
      </kbd>
    ))}
  </span>
);
