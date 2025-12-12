import React from "react";

export default function ConfirmModal({ open, title = "Are you sure?", onConfirm, onCancel, description }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-5">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="btn-ghost">Cancel</button>
          <button onClick={onConfirm} className="btn bg-red-600 hover:bg-red-700">Confirm</button>
        </div>
      </div>
    </div>
  );
}

