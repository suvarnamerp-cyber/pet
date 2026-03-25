import type { PetInfo } from "./types";

export function buildPetQrUrl(origin: string, pet: PetInfo) {
  const petPublicUrl = pet.publicUrl || pet.petName;
  return new URL(`/pet/${encodeURIComponent(petPublicUrl)}`, origin).toString();
}
