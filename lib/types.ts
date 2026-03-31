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

export type ScanEventType = "SCAN" | "SCAN_OPENED" | "LOCATION_SHARED" | "LOCATION_DENIED";

export type ScanEvent = {
  publicUrl: string;
  eventType: ScanEventType;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  scanTime: string;
};

export type ScanEventRequest = {
  eventType: ScanEventType;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
};
