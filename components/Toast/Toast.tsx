"use client";
import React, { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export type ToastType = "success" | "error";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastProps) {
  const [progress, setProgress] = useState(100);
  const duration = 3000; // 3 seconds

  // Handle progress update
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration / 50);
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Handle removal when progress reaches 0
  useEffect(() => {
    if (progress <= 0) {
      // Use setTimeout to defer the state update to the next tick
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [progress, toast.id, onRemove]);

  const borderColor =
    toast.type === "success" ? "border-l-green-500" : "border-l-red-500";
  const iconColor =
    toast.type === "success" ? "text-green-500" : "text-red-500";
  const progressColor =
    toast.type === "success" ? "bg-green-500" : "bg-red-500";
  const Icon = toast.type === "success" ? CheckCircleIcon : XCircleIcon;

  return (
    <div
      className={`bg-white rounded-lg shadow-2xl border-l-4 ${borderColor} min-w-[320px] max-w-md animate-slide-in overflow-hidden`}
    >
      <div className="flex items-start p-4">
        <div className={`${iconColor} shrink-0 mt-0.5`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-semibold text-gray-900">{toast.message}</p>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="ml-4 shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="h-1 bg-gray-200">
        <div
          className={`h-full ${progressColor} transition-all duration-50 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default ToastItem;
