

export const Dialog = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-surface-900/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {title && <h2 className="mb-4 text-lg font-semibold text-surface-900">{title}</h2>}
        <div className="text-sm text-surface-600">{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
