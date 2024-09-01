import { ReactNode } from "react";
interface ModalProps {
  children: ReactNode;
}

function Modal({ children }: ModalProps) {
  return (
    <div className="fixed inset-0 flex xl:items-center xl:justify-center md:items-start md:justify-start z-50 text-gray-500">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50"></div>
      {children}
    </div>
  );
}

export default Modal;
