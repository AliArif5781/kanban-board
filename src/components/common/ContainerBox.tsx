import React, { useState } from "react";
import { RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { EllipsisVertical } from "lucide-react";
import {
  ContainerItem,
  deleteContainer,
  moveTask,
} from "../../features/ValueSlice";
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

  // ContainerBox.tsx
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (active.data.current?.type !== "task") return;

    const sourceContainer = containerValue.find((cont) =>
      cont.task.some((task) => task.id === activeId)
    );
    if (!sourceContainer) return;

    let destinationContainer: ContainerItem | undefined;
    let destinationIndex: number;

    if (over.data.current?.type === "container") {
      destinationContainer = containerValue.find((cont) => cont.id === overId);
      if (!destinationContainer) return;
      destinationIndex = destinationContainer.task.length;
    } else if (over.data.current?.type === "task") {
      destinationContainer = containerValue.find((cont) =>
        cont.task.some((task) => task.id === overId)
      );
      if (!destinationContainer) return;

      const overIndex = over.data.current.sortable.index;
      const isBelow = active.rect.current.translated?.top! > over.rect.top;
      destinationIndex = isBelow ? overIndex + 1 : overIndex;
    } else {
      return;
    }

    dispatch(
      moveTask({
        taskId: activeId,
        sourceContainerId: sourceContainer.id,
        destinationContainerId: destinationContainer.id,
        destinationIndex,
      })
    );
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
                      items={each.task.map((task, index) => task.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {each.task.map((task, index) => (
                        <SortableItem key={task.id} id={task.id} index={index}>
                          <div className="bg-gray-300 font-medium capitalize rounded-md p-2 hover:shadow-md transition-all ease-in-out duration-300">
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

const DroppableContainer = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: "container",
    },
  });

  return <div ref={setNodeRef}>{children}</div>;
};

export default ContainerBox;
