import React, { createContext, useContext } from "react";
export const initialState = {
  isVIUser: false,
  orderDetailsForVI: {},
  orderDetailsForUser: {},
};
//Prepares the data layer
export const StateContext = createContext();

//Wrap app and provide the data layer
export const StateProvider = ({ children }) => {
  const [data, setData] = useState(initialState);
  const dispatchEvents = (action) => {
    switch (action && action.type) {
      case "SET_IS_VI_USER":
        setData({ ...data, isVIUser: action.payload });
        return data;

      case "ADD_ORDER_DETAILS_FOR_VI":
        setData({ ...data, orderDetailsForVI: action.payload });
        return data;

      case "ADD_ORDER_DETAILS_FOR_USER":
        setData({ ...data, orderDetailsForUser: action.payload });
        return data;

      case "GET_STATE":
        return data;

      default:
        return data;
    }
  };
  return (
    <StateContext.Provider value={{ data, dispatchEvents }}>
      {children}
    </StateContext.Provider>
  );
};
const { data, dispatchEvents } = useContext(StateContext);
export const useStateSelector = () => [data, dispatchEvents];
