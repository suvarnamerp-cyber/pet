export type AuthSession = {
  userName: string;
  token: string;
};

export type AuthFormState = {
  userName: string;
  password: string;
};

export type PetInfo = {
  petName: string;
  ownerName: string;
  phone: string;
  imagePath: string;
  publicUrl?: string;
};

export type PetFormPayload = {
  petName: string;
  ownerName: string;
  phone: string;
  photo?: File | null;
};
