import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";

export interface BasketItem {
  id: number;
  basketId?: string; // Unique identifier for each basket item instance
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  hasPrime: boolean;
  rating: number;
}

interface BasketState {
  items: BasketItem[];
}

const initialState: BasketState = {
  items: [],
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket: (state, action: PayloadAction<BasketItem>) => {
      const newItem = {
        ...action.payload,
        basketId: `${action.payload.id}-${Date.now()}-${Math.random()}`,
      };
      state.items = [...state.items, newItem];
    },
    removeFromBasket: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.basketId !== action.payload
      );
    },
  },
});

export const { addToBasket, removeFromBasket } = basketSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state: RootState) => state.basket.items;
export default basketSlice.reducer;
