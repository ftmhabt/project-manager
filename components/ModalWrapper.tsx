"use client";
import { ReactNode, useState } from "react";
import Modal from "react-modal";
import Button from "./Button";

Modal.setAppElement("#modal");

const ModalWrapper = ({
  buttonLabel,
  buttonClassName,
  buttonIntent,
  children,
}: {
  buttonLabel: string;
  buttonClassName?: string;
  buttonIntent?: "primary" | "secondary";
  children: ReactNode | ((closeModal: () => void) => ReactNode);
}) => {
  const [isModalOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  return (
    <>
      <Button
        className={buttonClassName}
        intent={buttonIntent}
        onClick={() => openModal()}
      >
        {buttonLabel}
      </Button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => closeModal()}
        overlayClassName="bg-[rgba(0,0,0,0.4)] flex justify-center items-center absolute top-0 left-0 h-screen w-screen"
        className="w-72 bg-white rounded-xl p-6 sm:p-8"
      >
        {typeof children === "function" ? children(closeModal) : children}
      </Modal>
    </>
  );
};

export default ModalWrapper;
