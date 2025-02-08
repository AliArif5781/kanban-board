import React, { useState } from "react";
import { RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { EllipsisVertical } from "lucide-react";
import { deleteContainer, moveTask } from "../../features/ValueSlice";
import {
  itemValueDialogs,
  setCurrentContainerId,
} from "../../features/DialogSlice";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  useDroppable,
  TouchSensor,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem"; // Create this component (see below)

const ContainerBox = () => {
  const dispatch = useDispatch();
  const containerValue = useSelector(
    (state: RootState) => state.value.containerInputValue
  );

  // State to manage which container's menu is open
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<{
    id: string;
    value: string;
  } | null>(null);

  // Sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = containerValue
      .flatMap((container) => container.task)
      .find((task) => task.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = containerValue.find((container) =>
      container.task.some((task) => task.id === active.id)
    );
    const overContainer = containerValue.find(
      (container) => container.id === over.id
    );

    if (activeContainer && overContainer) {
      dispatch(
        moveTask({
          fromContainerId: activeContainer.id,
          toContainerId: overContainer.id,
          taskId: active.id as string,
          newIndex: 0, // Add to the beginning of the empty container
        })
      );
    }
    setActiveTask(null);
  };

  // Handle click on the Plus icon
  const handlePlusClick = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id); // Toggle menu
  };

  // Handle menu option clicks
  const handleMenuOptionClick = (id: string) => {
    dispatch(deleteContainer(id));
  };

  const addItemToggle = (id: string) => {
    dispatch(itemValueDialogs(true));
    dispatch(setCurrentContainerId(id));
    setOpenMenuId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex justify-center p-4">
        <div className="w-full mx-auto max-w-[1200px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {containerValue.map((each) => (
              <DroppableContainer key={each.id} id={each.id}>
                <div className="flex flex-col min-h-[150px] sm:min-h-[280px] bg-slate-200 p-4 rounded-md relative">
                  {/* Title and Menu Button */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-base sm:text-lg lg:text-xl font-semibold truncate capitalize">
                      {each.value}
                    </div>
                    <button
                      onClick={() => handlePlusClick(each.id)}
                      className="p-1 rounded-full hover:bg-slate-300 z-20"
                    >
                      <EllipsisVertical className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 space-y-4 py-2">
                    <SortableContext
                      items={each.task.map((task) => task.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {each.task.map((task) => (
                        <SortableItem key={task.id} id={task.id}>
                          <div className="bg-gray-300 font-medium capitalize rounded-md p-2 hover:shadow-md transition-all ease-in-out duration-300 cursor-grab touch-none">
                            {task.value}
                          </div>
                        </SortableItem>
                      ))}
                    </SortableContext>
                  </div>

                  {/* Menu Dropdown */}
                  {openMenuId === each.id && (
                    <div className="absolute right-2 top-10 bg-white border border-slate-200 rounded-md shadow-lg z-30">
                      <div
                        onClick={() => addItemToggle(each.id)}
                        className="px-4 py-2 hover:bg-slate-100 cursor-pointer"
                      >
                        Add Items
                      </div>
                      <div
                        onClick={() => handleMenuOptionClick(each.id)}
                        className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-red-600"
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              </DroppableContainer>
            ))}
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div className="bg-gray-300 font-medium capitalize rounded-md p-2 hover:shadow-md transition-all ease-in-out duration-300">
            {activeTask.value}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

// DroppableContainer Component
const DroppableContainer = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="w-full">
      {children}
    </div>
  );
};

export default ContainerBox;
