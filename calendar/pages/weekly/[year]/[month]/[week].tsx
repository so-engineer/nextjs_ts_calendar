import Head from 'next/head';
import weeklyStyle from '../../../weekly.module.css';
import utilsStyle from '../../../../styles/utils.module.css';
import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  getDate,
  getMonth,
  getYear,
  isSameDay,
  startOfWeek,
  subWeeks,
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

type WeeklyCalenderProps = {
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

export default function WeeklyCalender({
  year,
  month,
  today,
}: WeeklyCalenderProps) {
  const { plan } = useContext(PlanContext);

  const [targetDate, setTargetDate] = useState(new Date(year, month - 1));

  const startOfMonthWeekDate = startOfWeek(targetDate, {
    weekStartsOn: 0,
  }); // 日曜始まり
  const endOfMonthWeekDate = endOfWeek(targetDate, { weekStartsOn: 0 });
  const dateObjPerMonth = eachDayOfInterval({
    start: startOfMonthWeekDate,
    end: endOfMonthWeekDate,
  });

  const router = useRouter();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalTargetDay, setModalTargetDay] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalUpdateFlag, setModalUpdateFlag] = useState(false);

  const onClickPreWeek = () => {
    const newDate = subWeeks(targetDate, 1);
    moveWeek(newDate);
  };

  const onClickPostWeek = () => {
    const newDate = addWeeks(targetDate, 1);
    moveWeek(newDate);
  };

  const moveWeek = (newDate: Date) => {
    setTargetDate(newDate);
    const newYear = getYear(newDate);
    const newMonth = getMonth(newDate) + 1;
    const startOfMonthWeekDate = startOfWeek(newDate, {
      weekStartsOn: 0,
    }); // 日曜始まり
    router.push(
      `/weekly/${newYear}/${newMonth}/${getDate(startOfMonthWeekDate)}`
    );
  };

  const onChangeCalender = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    router.push(`/${value}/${year}/${month}`);
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
        <title>週次カレンダー</title>
      </Head>
      <div className={utilsStyle.head}>
        <button onClick={onClickPreWeek} className={utilsStyle.icon}>
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
        <button onClick={onClickPostWeek} className={utilsStyle.icon}>
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
          value="weekly"
          onChange={onChangeCalender}
        >
          <option value="monthly">月</option>
          <option value="weekly">週</option>
        </select>
      </div>
      <ul className={weeklyStyle.calenderDayOfWeek}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
          <li key={i} className={weeklyStyle.calenderItemDayOfWeek}>
            {d}
          </li>
        ))}
      </ul>
      <ul className={weeklyStyle.calender}>
        {dateObjPerMonth.map((dateObj) => {
          const formattedDate = format(dateObj, 'yyyy-MM-dd');
          const targetDay = getDate(dateObj);
          const filteredPlan = plan.find((item) => item.date === formattedDate);
          return (
            <li
              key={formattedDate}
              className={weeklyStyle.calenderItem}
              onClick={() => onClickModal(dateObj, filteredPlan)}
            >
              <span
                className={
                  isSameDay(dateObj, today) ? weeklyStyle.calenderItemNow : ''
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
