import { createContext, Dispatch, SetStateAction, useState } from 'react';

type Plan = {
  date: string;
  title: string;
}[];

type PlanContextType = {
  plan: Plan;
  setPlan: Dispatch<SetStateAction<Plan>>;
};

type PlanProviderProps = {
  children: React.ReactNode;
};

export const PlanContext = createContext<PlanContextType>({
  plan: [],
  setPlan: () => {},
});

export const PlanProvider = ({ children }: PlanProviderProps) => {
  const [plan, setPlan] = useState<Plan>([]);

  return (
    <PlanContext.Provider value={{ plan, setPlan }}>
      {children}
    </PlanContext.Provider>
  );
};
