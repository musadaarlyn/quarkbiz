import { useAlert } from "../../../contexts/AlertContext";
import Modal from "../../ui/Modal";

const intentStyles = {
  error: "bg-red-50 border-red-200 text-red-900",
  warning: "bg-amber-50 border-amber-200 text-amber-900",
  info: "bg-blue-50 border-blue-200 text-blue-900",
};

const AlertModal = () => {
  const { alert, hideAlert } = useAlert();
  if (!alert) return null;

  const { title, message, intent = "error" } = alert;

  return (
    <Modal isOpen title={title} onClose={hideAlert}>
      <div className={`border rounded-lg p-4 ${intentStyles[intent]}`}>
        <p className="text-sm leading-relaxed whitespace-pre-line">{message}</p>

      </div>

      <button
          onClick={hideAlert}
          className="mt-4 w-full bg-slate-900 text-white py-2 rounded-md hover:bg-black transition"
        >
          Got it
      </button>
    </Modal>
  );
};

export default AlertModal;