import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, Info } from "lucide-react";

interface ToastItem {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

let toastListeners: Array<(toasts: ToastItem[]) => void> = [];
let toasts: ToastItem[] = [];

export function showToast(type: ToastItem["type"], message: string) {
  const id = Date.now().toString();
  toasts = [...toasts, { id, type, message }];
  toastListeners.forEach(l => l(toasts));
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id);
    toastListeners.forEach(l => l(toasts));
  }, 2500);
}

export default function Toast() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    toastListeners.push(setItems);
    return () => {
      toastListeners = toastListeners.filter(l => l !== setItems);
    };
  }, []);

  const iconMap = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    error: <XCircle className="w-4 h-4 text-rose-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />,
  };

  const bgMap = {
    success: "bg-emerald-50 border-emerald-200",
    error: "bg-rose-50 border-rose-200",
    info: "bg-blue-50 border-blue-200",
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 z-[60] flex flex-col items-center pointer-events-none">
      <AnimatePresence>
        {items.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto mb-2 px-4 py-2.5 rounded-xl border shadow-lg flex items-center gap-2 ${bgMap[item.type]}`}
          >
            {iconMap[item.type]}
            <span className="text-xs font-bold text-zinc-700">{item.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
