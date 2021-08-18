import { atom } from "jotai";

import { ClerkObject, CartObject } from "@/lib/types";

export const clerkAtom = atom<ClerkObject | null>({ id: null });
export const cartAtom = atom<CartObject | null>(null);
export const pageAtom = atom<string>("sell");
export const menuDisplayAtom = atom<boolean>(false);
export const showCartAtom = atom<boolean>(false);

// modals
export const sellModalAtom = atom({});
export const sellSearchBarAtom = atom<string>("");