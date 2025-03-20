"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { createContext, useState, useOptimistic, startTransition } from "react";
import { toast } from "sonner";
import { Pet } from "@prisma/client";
import { PetEssentials, PetId } from "@/lib/types";

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: PetId | null;
  selectedPet?: Pet;
  numberOfPets: number;
  handleAddPet: (newPet: PetEssentials) => Promise<void>;
  handleChangeSelectedPetId: (petId: PetId) => void;
  handleCheckoutPet: (petId: PetId) => Promise<void>;
  handleEditPet: (petId: PetId, newPetData: PetEssentials) => Promise<void>;
};

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
  children,
  data,
}: PetContextProviderProps) {
  // state
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (prev, { action, payload }) => {
      switch (action) {
        case "add":
          return [...prev, { ...payload, id: Math.random().toString() }];
        case "edit":
          return prev.map((pet) => {
            if (pet.id === payload.petId) {
              return { ...pet, ...payload.newPetData };
            }
            return pet;
          });
        case "delete":
          return prev.filter((pet) => pet.id !== payload);
        default:
          return prev;
      }
    }
  );
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  //derived state
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  // event handlers / actions
  const handleAddPet = async (newPet: PetEssentials) => {
    startTransition(() => {
      setOptimisticPets({ action: "add", payload: newPet });
    });
    const result = await addPet(newPet);
    if (!result.success) {
      toast.warning(result.message);
      return;
    }

    setSelectedPetId(result.pet.id);
  };
  const handleEditPet = async (petId: string, newPetData: PetEssentials) => {
    startTransition(() => {
      setOptimisticPets({ action: "edit", payload: { petId, newPetData } });
    });
    const error = await editPet(petId, newPetData);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleCheckoutPet = async (petId: string) => {
    startTransition(() => {
      setOptimisticPets({ action: "delete", payload: petId });
    });
    const error = await deletePet(petId);
    if (error) {
      toast.warning(error.message);
      return;
    }
    setSelectedPetId(null);
  };

  const handleChangeSelectedPetId = (petId: PetId) => {
    setSelectedPetId(petId);
  };

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
        selectedPetId,
        selectedPet,
        numberOfPets,
        handleChangeSelectedPetId,
        handleCheckoutPet,
        handleEditPet,
        handleAddPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
