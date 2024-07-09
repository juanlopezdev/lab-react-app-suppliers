import Swal from "sweetalert2";

const fireErrorAlert = (message) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
    confirmButtonColor: "#3085d6",
    confirmButtonText: "Ok",
  });
};

const fireSuccessAlert = (message) => {
  Swal.fire({
    icon: "success",
    title: "Éxito!",
    text: message,
    confirmButtonColor: "#3085d6",
    confirmButtonText: "Ok",
  });
};

const confirmDeleteAlert = async (callback) => {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar!",
  });

  if (result.isConfirmed) callback();
};

export { fireErrorAlert, fireSuccessAlert, confirmDeleteAlert };
