import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { itemValueDialogs } from "../../features/DialogSlice";
import { RootState } from "../../app/store";
import { addItem, itemValueInput } from "../../features/ValueSlice";

const ItemBox = () => {
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();

  const closeDialog = () => {
    dispatch(itemValueDialogs(false));
  };

  const itemValue = useSelector((state: RootState) => state.value.itemValue);
  const currentContainerId = useSelector(
    (state: RootState) => state.dialog.currentContainerId
  );
  console.log(itemValue, "iiv");

  const handleAddItem = () => {
    if (itemValue.trim() === "") {
      setError("Item must be needed");
    } else {
      setError("");
      dispatch(addItem({ containerUniqueId: currentContainerId }));
      closeDialog();
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
        <div className="bg-white p-5 rounded-md w-[370px]">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold mb-4">Add Item</h2>
            <div onClick={closeDialog} className="cursor-pointer">
              ✖
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              id="title"
              className=" rounded-md p-2 w-full shadow-xl"
              placeholder="Item value"
              value={itemValue}
              onChange={(e) => dispatch(itemValueInput(e.target.value))}
            />
            {error && <p className="text-red-500 font-medium">{error}</p>}
          </div>

          <div className="flex">
            <button
              className="bg-black-300 text-white px-4 py-2 rounded-md"
              onClick={handleAddItem}
            >
              Add Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemBox;
