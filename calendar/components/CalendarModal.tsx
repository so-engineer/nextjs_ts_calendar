import { useContext } from 'react';
import Modal from 'react-modal';
import { Styles } from 'react-modal';
import calendarModalStyle from './CalendarModal.module.css';
import { PlanContext } from './context/PlanContext';

const modalStyle: Styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  content: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: '50%',
    height: '50%',
    backgroundColor: 'black',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
};

type CalendarModalProps = {
  modalIsOpen: boolean;
  setModalIsOpen: (modalIsOpen: boolean) => void;
  modalTargetDay: string;
  modalTitle: string;
  setModalTitle: (modalTitle: string) => void;
  modalUpdateFlag: boolean;
  setModalUpdateFlag: (modalUpdateFlag: boolean) => void;
};

export default function CalendarModal({
  modalIsOpen,
  setModalIsOpen,
  modalTargetDay,
  modalTitle,
  setModalTitle,
  modalUpdateFlag,
  setModalUpdateFlag,
}: CalendarModalProps) {
  const { plan, setPlan } = useContext(PlanContext);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPlan([...plan, { date: modalTargetDay, title: modalTitle }]);
    setModalTitle('');
    setModalUpdateFlag(false);
    setModalIsOpen(false);
  };

  const handleClose = () => {
    setModalTitle('');
    setModalUpdateFlag(false);
    setModalIsOpen(false);
  };

  const onClickUpdate = () => {
    console.log('onClickUpdate');
    const newPlan = plan.map((item) =>
      item.date === modalTargetDay
        ? { date: modalTargetDay, title: modalTitle }
        : item
    );
    setPlan(newPlan);
    setModalTitle('');
    setModalUpdateFlag(false);
    setModalIsOpen(false);
  };

  const onClickDelete = () => {
    console.log('onClickDelete');
    const newPlan = plan.map((item) =>
      item.date === modalTargetDay ? { date: '', title: '' } : item
    );
    setPlan(newPlan);
    setModalTitle('');
    setModalUpdateFlag(false);
    setModalIsOpen(false);
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleClose}
        style={modalStyle}
      >
        <h1>{modalTargetDay} / 予定の作成</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">タイトル:</label>
          </div>
          <div>
            <textarea
              id="title"
              name="title"
              value={modalTitle}
              onChange={(e) => setModalTitle(e.target.value)}
              required
              className={calendarModalStyle.textareaContainer}
              rows={10}
            />
          </div>
          <div>
            {modalUpdateFlag === false ? (
              // 予定がなければ保存を表示
              <div className={calendarModalStyle.buttonContainer}>
                <button type="submit">保存</button>
              </div>
            ) : (
              // 予定があれば更新と削除を表示
              <div className={calendarModalStyle.buttonContainer}>
                <button type="button" onClick={onClickUpdate}>
                  更新
                </button>
                <button type="button" onClick={onClickDelete}>
                  削除
                </button>
              </div>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}
