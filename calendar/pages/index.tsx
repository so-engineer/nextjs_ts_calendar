import MonthlyCalender from "./MonthlyCalender";
import { getStaticProps } from "@/components/getStaticProps";

export {getStaticProps};

export default function Home({initDate}) {
  return (
    <MonthlyCalender initDate={initDate} />
  );
}