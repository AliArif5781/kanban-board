import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  dialogContainer: boolean;
  itemValue: boolean;
  addItemValue: boolean;
  currentContainerId: string | null;
}

const initialState: CounterState = {
  dialogContainer: false,
  itemValue: false,
  addItemValue: false,
  currentContainerId: null,
};

export const DialogSlice = createSlice({
  name: "dialogcontainer",
  initialState,
  reducers: {
    toogleDialogContainer: (state, action: PayloadAction<boolean>) => {
      state.dialogContainer = action.payload;
    },
    toogleItemDialog: (state, action) => {
      state.itemValue = action.payload;
    },
    itemValueDialogs: (stata, action) => {
      stata.addItemValue = action.payload;
    },
    setCurrentContainerId: (state, action: PayloadAction<string | null>) => {
      state.currentContainerId = action.payload;
    },
  },
});

export const {
  toogleDialogContainer,
  toogleItemDialog,
  itemValueDialogs,
  setCurrentContainerId,
} = DialogSlice.actions;

export default DialogSlice.reducer;
