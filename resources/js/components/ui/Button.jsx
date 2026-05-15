import clsx from 'clsx';

export function Button({ children, className, variant = 'primary', ...props }) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400',
        variant === 'secondary' &&
          'border border-slate-300/70 bg-white/70 text-slate-900 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15',
        variant === 'ghost' && 'text-slate-700 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
