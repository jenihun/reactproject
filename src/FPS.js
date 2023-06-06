import {React} from "react"; //React를 임포트한다. React컴포넌트를 정의하기 위해 필요한 도구
import {createNode} from "./dataFunctions";  //노드 관리에 관련된 함수
import { login, logout } from "./Authentication";
import { useNavigate } from 'react-router-dom';

/*
return 문 안에는 단일 요소만 반환해야한다. 부모 요소에 포함된 여러 개의 자식 요소들로 구성
단일 요소로 감싸는 것은 반드시 <div> 태그를 사용해야 한다는 것은 아님 <>, <React.Fragment>를
사용할 수 있다.
*/

const FPS = () => {
  const navigate = useNavigate();

  const handlespace = () => {
    navigate('/main');
  };

  const logoutHandler = () => {
    logout();
    handlespace();
  }
  
  return (
    <div>
      <button onClick={createNode}>노드 생성</button>
      <button onClick={login}>로그인</button>
      <button onClick={logoutHandler}>로그아웃</button>
      <button onClick={handlespace}>main으로 이동</button>
    </div>
);
};

export default FPS; //FPS 컴포넌트를 다른 파일에서 임포트할 수 있도록 내보냅니다.