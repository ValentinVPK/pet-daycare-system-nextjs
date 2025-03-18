"use client";

import { useState } from "react";
import PetForm from "./pet-form";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type PetButtonProps = {
  actionType: "add" | "edit" | "checkout";
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
};

export default function PetButton({
  actionType,
  children,
  disabled,
  onClick,
}: PetButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (actionType === "checkout") {
    return (
      <Button
        variant="secondary"
        disabled={disabled}
        className="bg-zinc-200 hover:bg-zinc-300"
        onClick={onClick}
      >
        {children}
      </Button>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {actionType === "add" ? (
          <Button size="icon">{children}</Button>
        ) : (
          <Button variant="secondary" className="bg-zinc-200 hover:bg-zinc-300">
            {children}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === "add" ? "Add a new pet" : "Edit pet"}
          </DialogTitle>
        </DialogHeader>
        <PetForm
          actionType={actionType}
          onFormSubmission={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
