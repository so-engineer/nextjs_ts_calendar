import Head from 'next/head';
import monthlyStyle from '../../monthly.module.css';
import utilsStyle from '../../../styles/utils.module.css';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDate,
  getMonth,
  getYear,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import CalenderModal from '@/components/CalenderModal';
import { PlanContext } from '@/components/context/PlanContext';

type getServerSidePropsType = {
  query: {
    year: string;
    month: string;
  };
};

type MonthlyCalenderProps = {
  year: number;
  month: number;
  today: Date;
};

export async function getServerSideProps({ query }: getServerSidePropsType) {
  const year = parseInt(query.year, 10);
  const month = parseInt(query.month, 10);
  const today = new Date().toString(); // 文字列として返す

  return {
    props: {
      year,
      month,
      today,
    },
  };
}

export default function MonthlyCalender({
  year,
  month,
  today,
}: MonthlyCalenderProps) {
  const { plan } = useContext(PlanContext);
  // Dateオブジェクトの月は0が1月を表すため-1する
  const [targetDate, setTargetDate] = useState(new Date(year, month - 1));

  const startOfMonthDay = startOfMonth(targetDate);
  const startOfMonthWeekDate = startOfWeek(startOfMonthDay, {
    weekStartsOn: 0,
  }); // 日曜始まり
  const endOfMonthDay = endOfMonth(targetDate);
  const endOfMonthWeekDate = endOfWeek(endOfMonthDay, { weekStartsOn: 0 });
  const dateObjPerMonth = eachDayOfInterval({
    start: startOfMonthWeekDate,
    end: endOfMonthWeekDate,
  });

  const router = useRouter();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalTargetDay, setModalTargetDay] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalUpdateFlag, setModalUpdateFlag] = useState(false);

  const onClickPreMonth = () => {
    const newDate = subMonths(targetDate, 1);
    moveMonth(newDate);
  };

  const onClickPostMonth = () => {
    const newDate = addMonths(targetDate, 1);
    moveMonth(newDate);
  };

  const moveMonth = (newDate: Date) => {
    setTargetDate(newDate);
    const newYear = getYear(newDate);
    const newMonth = getMonth(newDate) + 1;
    router.push(`/monthly/${newYear}/${newMonth}`);
  };

  const onChangeCalender = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    router.push(`/${value}/${year}/${month}/${getDate(startOfMonthWeekDate)}`);
  };

  const onClickModal = (
    dateObj: Date,
    filteredPlan: { date: string; title: string } | undefined
  ) => {
    setModalIsOpen(true);
    const formattedDate = format(dateObj, 'yyyy-MM-dd');
    setModalTargetDay(formattedDate);
    // 予定があれば予定を初期値に設定する
    if (filteredPlan) {
      setModalTitle(filteredPlan.title);
      setModalUpdateFlag(true);
    }
  };

  return (
    <>
      <Head>
        <title>月次カレンダー</title>
      </Head>
      <div className={utilsStyle.head}>
        <button onClick={onClickPreMonth} className={utilsStyle.icon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button onClick={onClickPostMonth} className={utilsStyle.icon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
        <div>{`${year}年${month}月`}</div>
        <select
          className={utilsStyle.headDropDown}
          value="monthly"
          onChange={onChangeCalender}
        >
          <option value="monthly">月</option>
          <option value="weekly">週</option>
        </select>
      </div>
      <ul className={monthlyStyle.calenderDayOfWeek}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
          <li key={i} className={monthlyStyle.calenderItemDayOfWeek}>
            {d}
          </li>
        ))}
      </ul>
      <ul className={monthlyStyle.calender}>
        {dateObjPerMonth.map((dateObj) => {
          const formattedDate = format(dateObj, 'yyyy-MM-dd');
          const targetDay = getDate(dateObj);
          const filteredPlan = plan.find((item) => item.date === formattedDate);
          return (
            <li
              key={formattedDate}
              className={monthlyStyle.calenderItem}
              onClick={() => onClickModal(dateObj, filteredPlan)}
            >
              <span
                className={
                  isSameDay(dateObj, today) ? monthlyStyle.calenderItemNow : ''
                }
              >
                {targetDay}
              </span>
              {filteredPlan && <p>{filteredPlan.title}</p>}
            </li>
          );
        })}
      </ul>
      <CalenderModal
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        modalTargetDay={modalTargetDay}
        modalTitle={modalTitle}
        setModalTitle={setModalTitle}
        modalUpdateFlag={modalUpdateFlag}
        setModalUpdateFlag={setModalUpdateFlag}
      />
    </>
  );
}
