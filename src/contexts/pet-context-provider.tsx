"use client";

import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet?: Pet;
  numberOfPets: number;
  handleChangeSelectedPetId: (id: string) => void;
};

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
  children,
  data,
}: PetContextProviderProps) {
  // state
  const [pets] = useState<Pet[]>(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  //derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  // event handlers / actions
  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        selectedPet,
        numberOfPets,
        handleChangeSelectedPetId,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
