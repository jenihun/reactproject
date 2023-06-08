import {React, useEffect, useState} from "react"; //React를 임포트한다. React컴포넌트를 정의하기 위해 필요한 도구
import {createNode, printAllNodes, clearAllNodes, deleteNode, printAllNodesConsole} from "./dataFunctions";  //노드 관리에 관련된 함수
import {login} from "./Authentication";

/*
return 문 안에는 단일 요소만 반환해야한다. 부모 요소에 포함된 여러 개의 자식 요소들로 구성
단일 요소로 감싸는 것은 반드시 <div> 태그를 사용해야 한다는 것은 아님 <>, <React.Fragment>를
사용할 수 있다.
*/

const FPS = () => {


  //nodes는 렌더링 될 변수, setNodes는 nodes를 handling할 함수
  const [nodes, setNodes] = useState([]);

  //렌더링시 우선적으로 작동
  useEffect(() => {
    printAllNodes(nodes);
  }, [])

  //모든 노드 삭제(front에서만)
  const clearAllNodes = () => {
  setNodes([]);
  };

  return (
    <div>
      
      <div>
        <h1>노드 생성</h1>
        <div className="create-node-form">
        <input type="text" name="title" placeholder="제목"/>
        <textarea name="content" placeholder="내용"></textarea>
        <button onClick={ () => {createNode(); printAllNodes(setNodes);}}>노드 생성</button>
        </div>

        <div>
        <h1>노드 삭제</h1>
        <input type="text" name="title" placeholder="노드ID"/>
        <button onClick={() => {deleteNode(); printAllNodes(); }}>노드 삭제</button>
        </div>
        <div>
          <h1>노드 수정</h1>
          <input type="text" name="title" placeholder="노드ID"/>
          <button>노드 수정</button>
        </div>
        </div>

        <div>
        <h1>정보 출력</h1>
        <button onClick={printAllNodesConsole}>노드 내용 콘솔 창 출력</button>
        </div>

        <div>
        <h1>로그인 기능</h1>
        <button onClick={login}>로그인</button>
        </div>

        <div>
        <h1>노드 정보</h1>
        <button onClick={() => {printAllNodes(setNodes)}}>노드 내용 출력</button>
        <button onClick={clearAllNodes}>노드 내용 clear</button>
        
        <hr/>

        <div style={{'height':'500px', 'backgroundColor':'cyan'}}>
          <div style={{'border':'3px solid black', 'display':'flex', 'gap':'30px'}}>

            <div style={{"display":'flex', 'flexDirection':'row', 'justifyContent':'center', 'gap':'10px'}}>
            {nodes.map((node, index) => (
              <div key={index} style={{'padding':'10px', 'height':"100px", 'width':'100px', 'backgroundColor':'white', 'border':'1px solid black'}}> 
                <div  id={node.id}  style={{'border': '1px black solid'}}>
                  <h2 onClick={(e) => {deleteNode(e.target.parentElement.id); printAllNodes(setNodes);}} style={{"backgroundColor":"red"}} >{node.title}</h2>
                  <p>{node.content}</p>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
    </div>
);
};

export default FPS;