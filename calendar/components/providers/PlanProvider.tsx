import { createContext, useState } from "react";

export const PlanContext = createContext();

export const PlanProvider = ({children}) => {
  const [plan, setPlan] = useState([]);

  return (
    <PlanContext.Provider value={{plan, setPlan}}>
      {children}
    </PlanContext.Provider>
  )
}