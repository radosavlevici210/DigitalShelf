
import toast, { Toaster } from 'react-hot-toast'

const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
  dismiss: (toastId?: string) => toast.dismiss(toastId)
}

export { showToast, Toaster }
