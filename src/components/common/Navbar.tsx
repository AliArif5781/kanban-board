import { useDispatch } from "react-redux";
import { toogleDialogContainer } from "../../features/DialogSlice";

const Navbar = () => {
  const dispatch = useDispatch();

  const AddText = () => {
    dispatch(toogleDialogContainer(true));
  };

  return (
    <div className="flex justify-between px-2 md:px-10 py-5">
      <div className="text-2xl font-bold">Kanban Board</div>
      <button
        onClick={AddText}
        className="bg-black text-white px-2 md:px-5 py-2 rounded-md font-bold"
      >
        Add Container
      </button>
    </div>
  );
};

export default Navbar;
