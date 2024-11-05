import Head from 'next/head';
import monthlyStyle from '../../monthly.module.css';
import utilsStyle from '../../../styles/utils.module.css';
import {
  addDays,
  addMonths,
  getDate,
  getDaysInMonth,
  getMonth,
  getYear,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import CalenderModal from '@/components/CalenderModal';
import { PlanContext } from '@/components/context/PlanContext';

export async function getServerSideProps({ query }) {
  const year = parseInt(query.year, 10);
  const month = parseInt(query.month, 10);

  const initDate = new Date();
  const currentYear = getYear(initDate);
  // 月は0が1月を表すため+1する
  const currentMonth = getMonth(initDate) + 1;
  const currentDay = getDate(initDate);

  return {
    props: {
      year,
      month,
      currentYear,
      currentMonth,
      currentDay,
    },
  };
}

export default function MonthlyCalender({
  year,
  month,
  currentYear,
  currentMonth,
  currentDay,
}) {
  const { plan } = useContext(PlanContext);
  // Dateオブジェクトの月は0が1月を表すため-1する
  const [targetDate, setTargetDate] = useState(new Date(year, month - 1));

  const targetYear = getYear(targetDate);
  const targetMonth = getMonth(targetDate) + 1;

  const currentDaysInMonth = getDaysInMonth(targetDate);

  const start = startOfWeek(targetDate);
  const weekDays = [...Array(7)].map((_, i) => getDate(addDays(start, i)));

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

  const moveMonth = (newDate) => {
    setTargetDate(newDate);
    const newYear = getYear(newDate);
    const newMonth = getMonth(newDate) + 1;
    router.push(`/monthly/${newYear}/${newMonth}`);
  };

  const onChangeCalender = (e) => {
    const value = e.target.value;
    router.push(`/${value}/${targetYear}/${targetMonth}/${weekDays[0]}`);
  };

  const onClickModal = (targetYear, targetMonth, targetDay, filteredPlan) => {
    setModalIsOpen(true);
    setModalTargetDay(`${targetYear}-${targetMonth}-${targetDay}`);
    // 予定があれば予定を初期値に設定する
    if (filteredPlan.length > 0) {
      setModalTitle(filteredPlan[0].title);
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
        <div>{`${targetYear}年${targetMonth}月`}</div>
        <select
          className={utilsStyle.headDropDown}
          value="monthly"
          onChange={onChangeCalender}
        >
          <option value="monthly">月</option>
          <option value="weekly">週</option>
        </select>
      </div>
      <ul className={monthlyStyle.calender}>
        {[...Array(currentDaysInMonth)].map((_, i) => {
          // 日を1から始める
          const targetDay = i + 1;
          const filteredPlan = plan.filter(
            (item) => item.date === `${targetYear}-${targetMonth}-${targetDay}`
          );

          return targetDay === currentDay &&
            targetMonth === currentMonth &&
            targetYear === currentYear ? (
            <li
              key={i}
              className={monthlyStyle.calenderItem}
              onClick={() =>
                onClickModal(targetYear, targetMonth, targetDay, filteredPlan)
              }
            >
              {/* 今日の日付にマークを付ける */}
              <span className={monthlyStyle.calenderItemNow}>{targetDay}</span>
              {/* フィルタリングされた最初のプランを表示(日付の重複は想定されないためこれでOK) */}
              {filteredPlan.length > 0 && <p>{filteredPlan[0].title}</p>}
            </li>
          ) : (
            <li
              key={i}
              className={monthlyStyle.calenderItem}
              onClick={() =>
                onClickModal(targetYear, targetMonth, targetDay, filteredPlan)
              }
            >
              <span>{targetDay}</span>
              {filteredPlan.length > 0 && <p>{filteredPlan[0].title}</p>}
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
