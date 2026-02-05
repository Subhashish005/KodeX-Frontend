import { toast } from "react-toastify";

export const customErrorPopup = (popupMessage, duration) => {
  toast.error(popupMessage, {
    draggable: false,
    closeOnClick: true,
    hideProgressBar: true,
    autoClose: duration,
    theme: "dark",
  });
};

export const customSuccessPopup = (popupMessage, duration) => {
  toast.success(popupMessage, {
    draggable: false,
    closeOnClick: true,
    hideProgressBar: true,
    autoClose: duration,
    theme: "dark",
  });
};