"use client";
import { editTask } from "@/lib/api";
import { useState } from "react";
import Modal from "react-modal";
import Button from "./Button";
import Input from "./Input";
import ActionButton from "./ActionButton";
import { useRouter } from "next/navigation";

Modal.setAppElement("#modal");

const EditTask = ({
  id,
  projectId,
  name: taskName,
  description: taskDesc,
}: {
  id: string;
  projectId: string;
  name: string;
  description: string;
}) => {
  const [isModalOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(taskName);
  const [description, setDescription] = useState(taskDesc);

  const router = useRouter();
  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editTask({ id, name, description, projectId });
    router.refresh();
    closeModal();
  };

  return (
    <>
      <ActionButton
        id={id}
        label="Edit"
        textColor="text-fuchsia-500"
        loading={false}
        onClick={() => openModal()}
      />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => closeModal()}
        overlayClassName="bg-[rgba(0,0,0,0.4)] flex justify-center items-center absolute top-0 left-0 h-screen w-screen"
        className="w-3/4 bg-white rounded-xl p-8"
      >
        <form className="flex items-center" onSubmit={handleSubmit}>
          <Input
            placeholder="task name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit">Update</Button>
        </form>
      </Modal>
    </>
  );
};

export default EditTask;
