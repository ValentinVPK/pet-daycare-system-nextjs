"use server";

import { prisma } from "@/lib/db";
import { sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import { Pet } from "@prisma/client";

export async function addPet(pet: unknown) {
  await sleep(1000);

  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: "Invalid pet data.",
      success: false,
    } as const;
  }

  let newPet: Pet;
  try {
    newPet = await prisma.pet.create({
      data: validatedPet.data,
    });
  } catch (error) {
    console.error(error);
    return { message: "Could not add pet", success: false } as const;
  }

  revalidatePath("/app", "layout");

  return {
    success: true,
    pet: newPet,
  } as const;
}

export async function editPet(petId: unknown, newPetData: unknown) {
  await sleep(1000);

  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);
  if (!validatedPetId.success || !validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPet.data,
    });
  } catch (error) {
    console.error(error);
    return { message: "Could not edit pet" };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: unknown) {
  await sleep(1000);

  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch (error) {
    console.error(error);
    return { message: "Could not delete pet" };
  }

  revalidatePath("/app", "layout");
}
