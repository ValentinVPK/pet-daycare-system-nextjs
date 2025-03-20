"use server";

import { prisma } from "@/lib/db";
import { sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { PetEssentials, PetId } from "@/lib/types";

export async function addPet(pet: PetEssentials) {
  await sleep(1000);

  try {
    await prisma.pet.create({
      data: pet,
    });
  } catch (error) {
    console.error(error);
    return { message: "Could not add pet" };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: PetId, newPetData: PetEssentials) {
  await sleep(1000);

  try {
    await prisma.pet.update({
      where: {
        id: petId,
      },
      data: newPetData,
    });
  } catch (error) {
    console.error(error);
    return { message: "Could not edit pet" };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: PetId) {
  await sleep(3000);

  try {
    await prisma.pet.delete({
      where: {
        id: petId,
      },
    });
  } catch (error) {
    console.error(error);
    return { message: "Could not delete pet" };
  }

  revalidatePath("/app", "layout");
}
