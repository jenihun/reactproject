import { db } from './firebase';
import {collection, addDoc} from './firebase';

const nodesCollection = collection(db, 'nodes');

/*
return 문 안에는 단일 요소만 반환해야한다. 부모 요소에 포함된 여러 개의 자식 요소들로 구성
단일 요소로 감싸는 것은 반드시 <div> 태그를 사용해야 한다는 것은 아님 <>, <React.Fragment>를
사용할 수 있다.
*/

//노드 저장 함수
export const saveNode = async (collectionName, data) => {
    try{
        await collection(collectionName).add(data);
        console.log('데이터 저장에 성공하였습니다.');
    } catch(error){
        console.error('데이터 저장에 실패하였습니다.',error);
    }
};

//노드 수정 함수
export const updateNode = async (collectionName, documentId, newData) => {
    try{
        await collection(collectionName).doc(documentId).update(newData);
        console.log('데이터 수정에 성공하였습니다.');
    }catch(error){
        console.error('데이터 수정을 실패하였습니다.', error);
    }
};

//노드 생성 함수
export const createNode = async () => {
    try {
      // Firestore 컬렉션에 새로운 노드 추가
      const docRef = await addDoc(nodesCollection, {
        planId: 'sdfsdf', 
        title: '새로운 노드',
        content: 'Lorem ipsum dolor sit amet.',
        UID: 'hwangwon',
      });
      console.log('노드가 생성되었습니다.',docRef.id);
    } catch (error) {
      console.error('노드 생성에 실패하였습니다.', error);
    }
  };

export const deleteNode = async (nodes, documentId) => {
    try {
      await collection(nodes).doc(documentId).delete();
      console.log('노드 삭제에 성공하였습니다.');
    } catch (error) {
      console.error('노드 삭제를 실패하였습니다.', error);
    }
  };
