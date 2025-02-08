import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useState } from "react";
import { toogleDialogContainer } from "../../features/DialogSlice";
import { addContainer, DialogValue } from "../../features/ValueSlice";

const ContainerSection = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const value = useSelector((state: RootState) => state.value.value);
  console.log(value);

  const closeDialog = () => {
    dispatch(toogleDialogContainer(false));
  };

  const handleAddContainer = () => {
    if (value.trim() === "") {
      setError("Title cannot be empty");
    } else {
      setError("");
      dispatch(addContainer());
      closeDialog();
    }
  };

  return (
    <>
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
        <div className="bg-white p-5 rounded-md w-[370px]">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold mb-4">Add Container</h2>
            <div onClick={closeDialog} className="cursor-pointer">
              ✖
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              id="title"
              className=" rounded-md p-2 w-full shadow-xl"
              placeholder="Container title"
              value={value}
              onChange={(e) => dispatch(DialogValue(e.target.value))}
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>

          <div className="flex">
            <button
              className="bg-black-300 text-white px-4 py-2 rounded-md"
              onClick={handleAddContainer}
            >
              Add Container
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContainerSection;
