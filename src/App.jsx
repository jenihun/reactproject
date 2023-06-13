import React, { useState, useEffect } from 'react';
import './App.css';
import DirectedGraph from './test.jsx';
import Modal from 'react-modal';
import { login } from './Authentication';
import {createPlan} from './dataFunctions';

Modal.setAppElement('#root');
/* DB 연관 코드
1. 415번 계획 업데이트 및 출력
2. 419번 계획 삭제
3. 466번 줄 계획 추가
DB 직접 상호작용은 안하지만 test.js 사용하는 코드
- 30번 노드 삭제하는 줄
*/
function Comp({graph, data, Update}) {
  document.querySelectorAll('.wrapper').forEach((element) => {  //애니메이션 넣으려고
    if (!element.classList.contains('show')) {
      element.classList.add('show');
    }
  });
  const id=Object.keys(data); //노드 id
  const value=data[id]; //노드 객체
  const canr=(!value.next.length||value.next.length > 1)&&(!value.prev.length||value.prev.length > 1); //삭제 유무
  let canb=(value.prev.length===1&&value.next.length===1);
  if (canb) //분기 유무 확인
    canb=!(graph.vertices[value.prev[0]].next.length===1&&graph.vertices[value.next[0]].prev.length>1); 
  console.log("Comp: ",id,value, canb);

  const handleClick = (graph, id, event) => { //툴바 버튼 누르면 실행될거, 노드 추가, 삭제 이 함수에서 실행
    id = Number(id);
    const clickE = event.target;
    if (clickE.classList.contains('x')) {
    // 비활성화
    } else if (clickE.classList.contains('a')) {  // 추가
      graph.append_next(id);
    } else if (clickE.classList.contains('b')) {  // 분기
      graph.branch(id); // 정점 삽입
    } else if (clickE.classList.contains('r')) {  // 삭제
      graph.remove_vertex(id);
    }
    Update(graph);
  };

  const [success, setSuccess] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState({
    goal: '',
    achievementRate: 0,
    startDate: '',
    endDate: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

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

  const [isOpen1, setIsOpen1] = useState(false);

  const openModal1 = () => {
    setIsOpen1(true);
  };

  const closeModal1 = () => {
    setIsOpen1(false);
  };

  const inputGoal = (e) => {
    value.data.goal=e.target.value;
    setCurrentGoal({
      ...currentGoal,
      goal: e.target.value,
    });
    validateForm();
  };

  const inputAchievementRate = (e) => {
    value.data.prog=e.target.value;
    setCurrentGoal({
      ...currentGoal,
      achievementRate: e.target.value,
    });
    validateForm();
  };

  const inputStartDate = (e) => {
    value.data.start=e.target.value;
    setCurrentGoal({
      ...currentGoal,
      startDate: e.target.value,
    });
    validateForm();
  };

  const inputEndDate = (e) => {
    value.data.end=e.target.value;
    setCurrentGoal({
      ...currentGoal,
      endDate: e.target.value,
    });
    validateForm();
  };

  const today = new Date().toISOString().split('T')[0];

  const validateForm = () => {
    if (
      value.data.goal !== '' &&
      value.data.prog >= 0 && value.data.prog <= 100 &&
      value.data.start !== '' &&
      value.data.end !== ''
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const [isInputCompleted, setIsInputCompleted] = useState(false);

  const handleSubmit = () => {
    closeModal();
    value.data.goal = currentGoal.goal;
    value.data.prog = currentGoal.achievementRate;
    value.data.start = currentGoal.startDate;
    value.data.end = currentGoal.endDate;

    if (currentGoal.achievementRate >= 70) {
      setSuccess(true);
    } else {
      setSuccess(false);
    }
    setIsInputCompleted(true); // 입력 완료 상태를 true로 설정합니다.
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
    if (
      value.data.goal !== '' &&
      value.data.prog >= 0 && value.data.prog <= 100 &&
      value.data.start !== '' &&
      value.data.end !== ''
    ) {
      if (value.data.prog >= 70) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
      setIsInputCompleted(true);
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [currentGoal.endDate, value.data.goal, value.data.prog, value.data.start, value.data.end]);
  // const remainingDaysMessage = daysRemaining === 0 ? '마감일이 오늘입니다!' : `남은 일수 : ${daysRemaining}일`;


  // 두 날짜 사이의 기간을 계산하는 함수를 정의합니다.
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInMilliseconds = end - start;

    // 일 단위로 기간을 계산합니다.
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const durationInDays = Math.floor(durationInMilliseconds / millisecondsPerDay);

    return durationInDays;
  };

  const handleReset = () => {
    setCurrentGoal({
      goal: '',
      achievementRate: 0,
      startDate: '',
      endDate: '',
    });
    setIsInputCompleted(false); // 입력 완료 상태를 false로 설정하여 입력 버튼이 나타날 수 있도록 합니다.
    closeModal1();
  };

  let goalText = value.data;
  if (typeof value.data === 'object') {
    goalText = value.data.goal; // 객체 형태인 경우 'Goal'로 설정
  }

  const Style = { //노드 스타일, 위치 조정해야해서 css로 안감
    position: 'absolute',
    left: `${value.data.x}px`,
    top: `${value.data.y}px`,
    // 추가적인 스타일 속성들...
  };
  const Mstyle={content: {
    width: "220px",
    height: "380px",
    position: "relative",
    top: value.data.y+135,
    left: value.data.x+410,
    zIndex: 3, // 원하는 z-index 값 설정
  }};
  return (
    <div className='cont1' style={Style}>
      <div className='add' onClick={(e) => {
        if (!e.target.classList.contains('toolbar')){
          const clickedElements = document.querySelectorAll('.clicked');
          clickedElements.forEach(element => {
            if (element!==e.target)
              element.classList.remove('clicked');
          });
          e.target.classList.toggle('clicked');
        }}}>
         {`${goalText} (${value.data.prog}%)`}
        <span onClick={openModal1} className="triangle"></span>{/* Added "Goal Check" button */}
        <Modal 
          isOpen={isOpen1}
          onRequestClose={closeModal1}
          style={Mstyle}
        > <div className="goal-container">
        {(
          <div>
            <p>목표명: {value.data.goal}</p>
            <hr />
            <p>달성률(%): {value.data.prog === 0 ? '' : value.data.prog}</p>
            <hr />
            <p>시작일: {value.data.start}</p>
            <hr />
            <p>마감일: {value.data.end}</p>
            <hr />
            {success && <p style={{ color: "green" ,fontSize: "24px" }}>성공<hr></hr></p>}
            
            {currentGoal.endDate && (
              <div>
                <p>{daysRemaining === 0 ? '마감일이 오늘입니다!' : `남은 일수 : ${daysRemaining}일`}</p>
              </div>
            )}
            <hr></hr>
            <p>기간: {calculateDuration(value.data.start, value.data.end) >= 0 ? calculateDuration(value.data.start, value.data.end) : ''}일</p>
            <hr />
            <button onClick={handleReset}>재설정</button>
          </div>
        )}
      </div>
        </Modal>
        <div className="toolbar">
          <div className={canr ? "exp r x":"exp r"} onClick={(event) => handleClick(graph, id, event)}>
              삭제
          </div> <hr className='hr'/>
          <div className={canb ? "exp b" : "exp b x"} onClick={(event) => handleClick(graph, id, event)}>
              분기
          </div> <hr className='hr'/>
          <div className="exp e" onClick={(event) => handleClick(graph, id, event)}>
                {!isInputCompleted && ( // 입력 버튼을 조건부로 렌더링합니다.
                <div className="exp e" onClick={openModal}>수정</div>
              )}
              <Modal
                  isOpen={isOpen}
                  onRequestClose={closeModal}
                  contentLabel="목표 입력"
                  style={Mstyle}
                > 
                <form>
                  <div className="form-group">
                    <label htmlFor="goalName">목표명</label>
                    <input type="text" id="goalName" value={value.data.goal} onChange={inputGoal} placeholder="목표명" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="achievementRate">목표 달성률(%)</label>
                    <input
                      type="number"
                      id="achievementRate"
                      value={value.data.prog}
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
                      value={value.data.start}
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
                      value={value.data.end}
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
          </div> 
          <hr className='hr'/>
          <div className="exp a" onClick={(event) => handleClick(graph, id, event)}>
              추가
          </div>
        </div>
      </div>
    </div>
  );
}

function Plan({graph, delplan}) {
  console.log(graph)
  const [components, setComponents] = useState(Object.entries(graph.vertices).map(([key, value]) => ({ [key]: value }))); //그래프 관리 useState, {id:정점 객체}
  const Update = (graph) => {
    setComponents(Object.entries(graph.vertices).map(([key, value]) => ({ [key]: value })));
  };
  useEffect(() => {
    Update(graph);
  }, [graph]);
  console.log('---------------------------------------\n그래프(Plan): ', graph);
  const Style = {
    height: `${graph.height}px`,
    width: `${graph.width}px`
    // 추가적인 스타일 속성들...
  };
  if (!graph)
    return <div></div>;
  return (
    <div className='wrapper' style={Style}>
      <p className='pn'>계획 {graph.id}</p>
      <div className='planset'>
        <div className='print' onClick={()=>{alert('저장되었습니다!!!');}}>저장</div>
        <div className='print' onClick={() => {delplan(graph)}}>삭제</div>
      </div>
      <div className='cont'>
      {
      components.map((value, index) => { //value 데이터는 {id:Vertex} 형태
        const data=Object.values(value)[0];
        console.log('순회: ',data.prev, data)
        return (
        <div className='node'>
          {
            data.next.map(next => {
              const dataX = data.data.x+110;
              const dataY = data.data.y-10;
              const ldata = graph.vertices[next]
              const ldataX = ldata.data.x+10;
              const ldataY = ldata.data.y-10;
              const perc = data.data.prog===0 ? 0.0001 : data.data.prog/100;
              const totalLength = Math.sqrt(Math.pow(ldataX - dataX, 2) + Math.pow(ldataY - dataY, 2));
              const ratio = totalLength * perc / totalLength;

              const newX = dataX + (ldataX - dataX) * ratio;
              const newY = dataY + (ldataY - dataY) * ratio;
              
              return (
                <svg key={next} width="100%" height="100%" style={{ position: 'absolute' }}>
                  <line x1={dataX} y1={dataY} x2={ldataX} y2={ldataY} stroke="rgba(61, 61, 61, 0.3)" strokeWidth="5" />
                  <line x1={dataX} y1={dataY} x2={newX} y2={newY} stroke="rgba(61, 61, 61, 0.3)" strokeWidth="5" />
                </svg>
              );
            })
          }
          <Comp
            key={value.id} // 고유한 키 값으로 설정
            graph={graph} 
            data={value}
            Update={Update}
          />
        </div>
      )})}
      </div>
    </div>
  );
}

function App(){
  console.log(testData.map(data => {
    console.log(data)
    return new DirectedGraph(data)
  }))
  let maxX=0;
  const saved = testData.map(data => {
    maxX=maxX>data.width ? maxX : data.width;
    return new DirectedGraph(data.id, data.vertices, data.first, data.height, data.width);
  }); //유저가 소유한 모든 그래프 불러오기, 이 코드에서는 더미 데이터 이용함
  const [plans, setPlan] = useState(saved); //계획 관리 useState, {id:그래프(계획) 객체}
  const Delete = (graph) => { //해당 graph 객체 삭제, graph.id가 계획 ID, 이 함수 안에 DB의 계획 객체 제거하는 코드 작성
    setPlan((prevPlans) => {
      const list = [...prevPlans];  //제거 후 useState 업데이트
      return list.filter(item => item !== graph);
    });
  };
  return (
    <div className='body' style={{ minWidth:maxX+200+'px'}}>

      <div className='nav'>
        <p className='tab' onClick={()=>{
          console.log('1111111111111111111')
          const nav=document.querySelector('.nav');
          const canv=document.querySelector('.canv');
          if (nav.style.left!=='-165px'){
            nav.style.left = '-165px';
            canv.style.marginLeft='0px';
          }
          else{
            nav.style.left = '0px';
            canv.style.marginLeft='200px';
          }

        }}>≡</p>
        <div className="banner"> 
        <p className="blue">Flow</p>  
        <p className="blue">Planner</p>
        <p className="blue">Service</p>
        </div>
        <div className='menu'>
          <p className="mainb" onClick={()=>login()}>Login</p>
        </div>
      </div>
      <div className='canv'>
        <div className='maintitle'><p>Plan</p></div>
        <div className='changethis'>
        {plans.map((plan) => (
          <Plan
            key={999+plan.id} // 고유한 키 값으로 설정
            graph={plan}
            delplan={Delete}
          />
        ))}
        </div>
        <div className='Plan a' onClick={(e) => {
          const newId = plans.length ? Math.max(...plans.map(item => item.id))+1 : 0; //새 plan id, 계획 추가 버튼 누르면 계획 ID 생성 후 DB에 계획 추가
          setPlan([...plans, new DirectedGraph(newId)]); //추가된 계획 useState 업데이트
          }}>+
        </div>
      </div>
    </div>
  );
}

export default App;
//더미 데이터
const testData=[];