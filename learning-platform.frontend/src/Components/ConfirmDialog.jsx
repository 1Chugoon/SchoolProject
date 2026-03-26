export default function ConfirmDialog({ open, onConfirm, onCancel, message }) {
  if (!open) return null;

  const isMobile = window.innerWidth <= 480;

  return (
    <div style={overlay}>
      <div style={{ ...modal, ...(isMobile ? modalMobile : {}) }}>
        <p style={text}>{message}</p>

        <div style={{ ...actions, ...(isMobile ? actionsMobile : {}) }}>
          <button style={cancelBtn} onClick={onCancel}>
            Отмена
          </button>
          <button style={confirmBtn} onClick={onConfirm}>
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== Styles ===== */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  backdropFilter: "blur(4px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const modal = {
  background: "linear-gradient(180deg, #ffffff, #f7f7f7)",
  padding: "24px 28px",
  borderRadius: 14,
  minWidth: 340,
  maxWidth: 420,
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  animation: "fadeIn 0.2s ease-out"
};

const modalMobile = {
  width: "90%",
  minWidth: "unset",
  padding: "20px",
  borderRadius: 12
};

const text = {
  margin: "0 0 20px",
  fontSize: 16,
  lineHeight: 1.5,
  color: "#222",
  textAlign: "center"
};

const actions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 12
};

const actionsMobile = {
  flexDirection: "column-reverse",
  gap: 10
};

const baseButton = {
  padding: "10px 16px",
  fontSize: 14,
  borderRadius: 10,
  cursor: "pointer",
  border: "none",
  transition: "transform 0.05s ease, box-shadow 0.15s ease"
};

const cancelBtn = {
  ...baseButton,
  background: "#e5e7eb",
  color: "#111",
  boxShadow: "0 2px 0 #cbd5e1"
};

const confirmBtn = {
  ...baseButton,
  background: "linear-gradient(135deg, #9046e5, #7863f1)",
  color: "#fff",
  boxShadow: "0 4px 0 #6b38ca"
};
