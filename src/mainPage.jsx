import {React,  useState, useEffect }from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal'
import DirectedGraph from './graphFunction.jsx';

Modal.setAppElement('#root');

function Comp({ data, onClick }) {
  const [clicked, setClicked] = useState(false);
  const id = Object.keys(data);
  const value = data[id];
  const canb = value.prev.length + value.next.length;
  console.log('Comp', id, value, canb);

  const [success, setSuccess] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);

  const handleClick = (event) => {
    const clickedElement = event.target;
    if (!clickedElement.classList.contains('exp')) setClicked(!clicked);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState({
    goal: '',
    achievementRate: 0,
    startDate: '',
    endDate: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [showGoalInfo, setShowGoalInfo] = useState(false); // New state variable

  const openModal = () => {
    setIsOpen(true);
    setCurrentGoal({
      goal: data[Object.keys(data)].goal || '',
      achievementRate: data[Object.keys(data)].achievementRate || 0,
      startDate: '',
      endDate: '',
    });
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const inputGoal = (e) => {
    setCurrentGoal({
      ...currentGoal,
      goal: e.target.value,
    });
    validateForm();
  };

  const inputAchievementRate = (e) => {
    setCurrentGoal({
      ...currentGoal,
      achievementRate: e.target.value,
    });
    validateForm();
  };

  const inputStartDate = (e) => {
    setCurrentGoal({
      ...currentGoal,
      startDate: e.target.value,
    });
    validateForm();
  };

  const inputEndDate = (e) => {
    setCurrentGoal({
      ...currentGoal,
      endDate: e.target.value,
    });
    validateForm();
  };

  const today = new Date().toISOString().split('T')[0];

  const validateForm = () => {
    if (
      currentGoal.goal.trim() !== '' &&
      currentGoal.achievementRate >= 0 &&
      currentGoal.achievementRate <= 100 &&
      currentGoal.startDate !== '' &&
      currentGoal.endDate !== ''
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const handleSubmit = () => {
    closeModal();
    value.data = currentGoal.goal;
    value.achievementRate = currentGoal.achievementRate;
    value.startDate = currentGoal.startDate;
    value.endDate = currentGoal.endDate;

    if (currentGoal.achievementRate >= 70) {
      setSuccess(true);
    } else {
      setSuccess(false);
    }
  };

  useEffect(() => {
    const calculateDaysRemaining = () => {
      const endDate = new Date(currentGoal.endDate);
      const today = new Date();
      const timeDiff = endDate.getTime() - today.getTime();
      const remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysRemaining(remainingDays);
    };

    if (currentGoal.endDate !== '') {
      calculateDaysRemaining();
    }
  }, [currentGoal.endDate]);

  const remainingDaysMessage = daysRemaining === 0 ? '마감일이 오늘입니다!' : `남은 날짜: ${daysRemaining}일`;

  const toggleGoalInfo = () => {
    setShowGoalInfo(!showGoalInfo);
  };

  return (
    <div className='cont1'>
      <div
        className='add'
        style={{
          backgroundColor: clicked ? 'lightgray' : 'whitesmoke',
        }}
        onClick={handleClick}
      >
        {`${id}: ${value.data} (${currentGoal.achievementRate}%)`}
        <button onClick={openModal}>목표 입력</button>
        <button onClick={toggleGoalInfo}>목표 확인</button> {/* Added "Goal Check" button */}
        <Modal isOpen={isOpen} onRequestClose={closeModal} contentLabel='목표 입력'>
          <form>
            <div className="form-group">
              <label htmlFor="goalName">목표명</label>
              <input type="text" id="goalName" value={currentGoal.goal} onChange={inputGoal} placeholder="목표명" />
            </div>
            <div className="form-group">
              <label htmlFor="achievementRate">목표 달성률(%)</label>
              <input
                type="number"
                id="achievementRate"
                value={currentGoal.achievementRate}
                onChange={inputAchievementRate}
                placeholder="목표 달성률(%)"
                min="0"
                max="100"
              />
            </div>
            <div className="form-group">
              <label htmlFor="startDate">시작일</label>
              <input
                type="date"
                id="startDate"
                value={currentGoal.startDate}
                onChange={inputStartDate}
                min={today}
                placeholder="시작일"
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">마감일</label>
              <input
                type="date"
                id="endDate"
                value={currentGoal.endDate}
                onChange={inputEndDate}
                min={currentGoal.startDate || today}
                placeholder="마감일"
              />
            </div>
            <button className="submit-button" disabled={!isFormValid} onClick={handleSubmit}>
              Submit
            </button>
          </form>
        </Modal>
        {showGoalInfo && ( // Display goal information only if the "Goal Check" button is clicked
          <div>
            <p>목표명: {currentGoal.goal}</p>
            <p>목표 달성률(%): {currentGoal.achievementRate}</p>
            <p>시작일: {currentGoal.startDate}</p>
            <p>마감일: {currentGoal.endDate}</p>
          </div>
        )}
        <div className='exp a' onClick={onClick}>
          {id} 추가
        </div>
        <div className={Number(id) ? 'exp r' : 'exp r x'} onClick={onClick}>
          {id} 삭제
        </div>
        <div className={canb >= 2 ? 'exp b' : 'exp b x'} onClick={onClick}>
          {id} 분기
        </div>
        {success && <p>성공</p>}
        {currentGoal.endDate && <p>{remainingDaysMessage}</p>}
      </div>
    </div>
  );
}

function Plan(graph) {
  graph=graph['plan'];
  console.log(graph);
  graph.add_vertex(0, 'first');
  const [components, setComponents] = useState(Object.entries(graph.vertices).map(([key, value]) => ({ [key]: value }))); //그래프 관리 useState, {id:정점 객체}
  if (!graph)
    return <div></div>;
  const newId = Math.max(...Object.keys(graph.vertices))+1; //new id=지금까지 최대 id+1, 고유ID로 변경예정
  const handleClick = (id, index, event) => {
    id=Number(id);
    const clickE = event.target;
    console.log("App", id, components);
    if (clickE.classList.contains('x')){
      //비활성화
    }
    else if (clickE.classList.contains('a')){ //추가
      graph.append_next(id);  //정점 추가
      console.log(graph.vertices)
      const newComponent = {}; //새 컴포넌트 구조
      newComponent[newId]=graph.vertices[newId];
      setComponents(prevComponents => { //useState 갱신
        const newComponents = [...prevComponents];
        newComponents.splice(index + 1, 0, newComponent); //리스트 해당 인덱스에 삽입
        console.log("여기",newId,index,newComponent,newComponents);
        return newComponents; 
      });
    }
    else if (clickE.classList.contains('b')){ //분기
      graph.branch(id);  //정점 삽입
      const newComponent = {}; //새 컴포넌트 구조
      newComponent[newId]=graph.vertices[newId];
      setComponents(prevComponents => { //useState 갱신
        const newComponents = [...prevComponents];
        newComponents.splice(index + 1, 0, newComponent); //리스트 해당 인덱스에 삽입
        console.log("여기",newId,index,newComponent,newComponents);
        return newComponents; 
      });
    }
    else if (clickE.classList.contains('r')){  //삭제
      graph.remove_vertex(id); //정점 삭제
      setComponents(prevComponents => { //useState 갱신
        const newComponents = [...prevComponents];
        newComponents.splice(index, 1);  //해당 인덱스 삭제
        return newComponents;
      });
    }
  };

  return (
    <div className='wrapper'>
      <div className='print' onClick={(e) => graph.print_graph()}>출력</div>
      <p>계획 {graph.id}</p>
      <div className='cont'>
      {components.map((value, index) => (
        <Comp
          key={index} // 고유한 키 값으로 설정
          data={value}
          onClick={(event) => handleClick(Object.keys(value), index, event)}
        />
      ))}
      </div>
    </div>
  );
}

// const graph = new DirectedGraph();

function mainPageRender(){
  const [plans, setPlan] = useState([]); //계획 관리 useState, {id:그래프(계획) 객체}
  return (
    <div>
      <div className='Plan a' onClick={(e) => setPlan([...plans, new DirectedGraph(plans.length+1)])}>추가</div>
      <div className='changethis'>
      {plans.map((plan, index) => (
        <Plan
          key={index} // 고유한 키 값으로 설정
          plan={plan}
        />
      ))}
      </div>
    </div>
  );
}

export default mainPageRender;