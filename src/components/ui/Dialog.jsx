export const Dialog = ({ open, onClose, title, children, dark }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className={`absolute inset-0 ${dark ? 'bg-surface-950/60' : 'bg-surface-900/40'}`} onClick={onClose} />
      <div className={`relative z-10 w-full max-w-lg rounded-2xl p-6 shadow-xl ${dark ? 'bg-surface-900 border border-surface-800 text-surface-100' : 'bg-white text-surface-900'}`}>
        {title && <h2 className={`mb-4 text-lg font-semibold ${dark ? 'text-white' : 'text-surface-900'}`}>{title}</h2>}
        <div className={`text-sm ${dark ? 'text-surface-300' : 'text-surface-600'}`}>{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
