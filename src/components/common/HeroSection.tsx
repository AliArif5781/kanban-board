import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import ContainerSection from "./ContainerSection";
import ContainerBox from "./ContainerBox";
import { useEffect } from "react";
import { loadContainer } from "../../features/ValueSlice";
import ItemBox from "./ItemBox";

const HeroSection = () => {
  const dispatch = useDispatch();

  const container = useSelector(
    (state: RootState) => state.dialog.dialogContainer
  );

  const containerValue = useSelector(
    (statw: RootState) => statw.value.containerInputValue
  );

  const value = useSelector((state: RootState) => state.dialog.addItemValue);

  useEffect(() => {
    dispatch(loadContainer());
  }, [dispatch]);

  return (
    <div>
      {container && <ContainerSection />}
      {containerValue && <ContainerBox />}
      {value && <ItemBox />}
    </div>
  );
};

export default HeroSection;
