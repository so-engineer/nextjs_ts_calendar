import Head from "next/head"
import weeklyCalenderStyle from './weeklyCalender.module.css'
import utilsStyle from '../styles/utils.module.css'
import { addDays, addWeeks, getDate, getMonth, getYear, startOfWeek, subWeeks } from "date-fns";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import CalenderModal from "@/components/CalenderModal";
import { getStaticProps } from "@/components/getStaticProps";
import { PlanContext } from "@/components/providers/PlanProvider";

export {getStaticProps};

export default function WeeklyCalender({initDate}) {
  const {plan, setPlan} = useContext(PlanContext)

  const [targetDate, setTargetDate] = useState(new Date(initDate))

  const targetYear = getYear(targetDate)
  const targetMonth = getMonth(targetDate) + 1
  const targetDay = getDate(targetDate)

  const currentYear = getYear(new Date(initDate))
  const currentMonth = getMonth(new Date(initDate)) + 1
  const currentDay = getDate(new Date(initDate))

  const start = startOfWeek(targetDate)
  const weekDays = [...Array(7)].map((_, i) => getDate(addDays(start, i)))

  const router = useRouter()
  
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalTargetDay, setModalTargetDay] = useState('')
  const [modalTitle, setModalTitle] = useState('');
  const [modalUpdateFlag, setModalUpdateFlag] = useState(false);

  const onClickPreWeek = () => {
    setTargetDate(subWeeks(targetDate, 1))
  }

  const onClickPostWeek = () => {
    setTargetDate(addWeeks(targetDate, 1))
  }

  const onChangeCalender = (e) => {
    const value = e.target.value
    if (value) {
      router.push(value)
    }
  }

  const onClickModal = (year, month, day, filteredPlan) => {
    setModalIsOpen(true);
    setModalTargetDay(`${year}-${month}-${day}`);
    // 予定があれば予定を初期値に設定する
    if (filteredPlan.length > 0) {
      setModalTitle(filteredPlan[0].title)
      setModalUpdateFlag(true)
    }
  }

  return (
    <Layout>
      <Head>
        <title>週次カレンダー</title>
      </Head>
      <div className={utilsStyle.head}>
        <div onClick={onClickPreWeek}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={utilsStyle.icon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </div>
        <div onClick={onClickPostWeek}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={utilsStyle.icon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </div>
        <div>{`${targetYear}年${targetMonth}月`}</div>
        <select className={utilsStyle.headDropDown} value='WeeklyCalender' onChange={onChangeCalender}>
          <option value='MonthlyCalender'>月</option>
          <option value='WeeklyCalender'>週</option>
        </select>
      </div>
      <ul className={weeklyCalenderStyle.calender}>
        {weekDays.map((i) => {
          const day = i;
          const filteredPlan = plan.filter(item => item.date === `${targetYear}-${targetMonth}-${day}`)
        
          return (day === currentDay) && (targetMonth === currentMonth) ?
          <li 
            key={day} 
            className={weeklyCalenderStyle.calenderItem} 
            onClick={() => onClickModal(targetYear, targetMonth, day, filteredPlan)}
          >
            <span className={weeklyCalenderStyle.calenderItemNow}>{day}</span>
            {/* フィルタリングされた最初のプランを表示(日付の重複は想定されないためこれでOK) */}
            {filteredPlan.length > 0 && <p>{filteredPlan[0].title}</p>}
          </li>
          :
          <li 
            key={day} 
            className={weeklyCalenderStyle.calenderItem} 
            onClick={() => onClickModal(targetYear, targetMonth, day, filteredPlan)}
          >
            <span>{day}</span>
            {filteredPlan.length > 0 && <p>{filteredPlan[0].title}</p>}
          </li>
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
    </Layout>
  );
}