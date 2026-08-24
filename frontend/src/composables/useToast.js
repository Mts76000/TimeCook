import { reactive, ref } from "vue";

const toasts = reactive([]);

let id = 0;

export function useToast() {
  return {
    toasts,
    add(message, type = "info", duration = 3000) {
      const item = { id: ++id, message, type, duration };
      toasts.push(item);
      setTimeout(() => {
        const idx = toasts.findIndex((t) => t.id === item.id);
        if (idx > -1) toasts.splice(idx, 1);
      }, duration);
    },
    remove(item) {
      const idx = toasts.findIndex((t) => t.id === item.id);
      if (idx > -1) toasts.splice(idx, 1);
    },
  };
}

export function useToasts() {
  return { toasts };
}
