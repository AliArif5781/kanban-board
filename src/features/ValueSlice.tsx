import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface ContainerItem {
  id: string;
  value: string;
  task: Task[];
}
export interface Task {
  id: string; // Unique ID for each item
  value: string; //   Container The title
}

export interface CounterState {
  value: string;
  containerInputValue: ContainerItem[]; //addContainer
  itemValue: string;
}

const initialState: CounterState = {
  value: "",
  containerInputValue: [],
  itemValue: "",
};

export const ValueSlice = createSlice({
  name: "dialogcontainer",
  initialState,
  reducers: {
    DialogValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    addContainer: (state) => {
      if (state.value.trim() !== "") {
        const newItem: ContainerItem = {
          id: uuidv4(),
          value: state.value,
          task: [],
        };
        state.containerInputValue.push(newItem);
        state.value = "";
        localStorage.setItem(
          "addContainer",
          JSON.stringify(state.containerInputValue)
        );
      }
    },
    loadContainer: (state) => {
      const savedContainerValue = localStorage.getItem("addContainer");
      if (savedContainerValue) {
        state.containerInputValue = JSON.parse(savedContainerValue);
      }
    },
    deleteContainer: (state, action) => {
      state.containerInputValue = state.containerInputValue.filter(
        (item) => item.id !== action.payload
      );
      localStorage.setItem(
        "addContainer",
        JSON.stringify(state.containerInputValue)
      );
    },
    itemValueInput: (state, action) => {
      state.itemValue = action.payload;
    },
    addItem: (state, action: PayloadAction<{ containerUniqueId: any }>) => {
      if (state.itemValue.trim() !== "") {
        const container = state.containerInputValue.find(
          (item) => item.id === action.payload.containerUniqueId
        );
        if (container) {
          const newTask: Task = {
            id: uuidv4(),
            value: state.itemValue,
          };
          container.task.push(newTask);
          state.itemValue = "";
          localStorage.setItem(
            "addContainer",
            JSON.stringify(state.containerInputValue)
          );
        }
      }
    },
    moveTask: (state, action) => {
      const { fromContainerId, toContainerId, taskId, newIndex } =
        action.payload;
      const fromContainer = state.containerInputValue.find(
        (container) => container.id === fromContainerId
      );
      const toContainer = state.containerInputValue.find(
        (container) => container.id === toContainerId
      );

      if (fromContainer && toContainer) {
        const taskIndex = fromContainer.task.findIndex(
          (task) => task.id === taskId
        );
        const task = fromContainer.task[taskIndex];

        // Remove task from the source container
        fromContainer.task.splice(taskIndex, 1);

        // Add task to the target container at the new index
        toContainer.task.splice(newIndex, 0, task);

        // Update localStorage with the new state
        localStorage.setItem(
          "addContainer",
          JSON.stringify(state.containerInputValue)
        );
      }
    },
  },
});

export const {
  DialogValue,
  addContainer,
  loadContainer,
  deleteContainer,
  itemValueInput,
  addItem,
  moveTask,
} = ValueSlice.actions;

export default ValueSlice.reducer;
