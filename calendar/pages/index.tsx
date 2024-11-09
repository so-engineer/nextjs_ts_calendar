import { getMonth, getYear } from 'date-fns';

export async function getServerSideProps() {
  const initDate = new Date();
  const currentYear = getYear(initDate);
  const currentMonth = getMonth(initDate) + 1;

  return {
    redirect: {
      destination: `/monthly/${currentYear}/${currentMonth}`,
      permanent: true,
    },
  };
}

export default function Home() {
  return null;
}
