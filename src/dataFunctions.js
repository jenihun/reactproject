import { db } from './firebase';
import {collection, addDoc, getDoc, doc, getDocs, deleteDoc} from './firebase';

export const nodesCollection = collection(db, '노드');

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
    const title = document.querySelector('input[name="title"]').value;
    const content = document.querySelector('textarea[name="content"]').value;

    const nodeData = {
      title: title,
      content: content,
    };

    const docRef = await addDoc(nodesCollection, nodeData);
    const nodeId = docRef.id;
    console.log('노드가 생성되었습니다.', nodeId);
  } catch (error) {
    console.error('노드 생성에 실패하였습니다.', error);
  }
};

//노드 삭제 함수
export const deleteNode = async (nodeId) => {
    try {
      // Firestore 컬렉션에서 노드 삭제
      await deleteDoc(doc(nodesCollection, nodeId));
      console.log('노드가 삭제되었습니다.', nodeId);
    } catch (error) {
      console.error('노드 삭제에 실패하였습니다.', error);
    }
  };


//모든 노드 정보 출력(콘솔)
export const printAllNodes = async () => {
  try {
    const querySnapshot = await getDocs(nodesCollection);
    const sortedNodes = querySnapshot.docs
      .map((doc) => doc.data())
      .sort((a, b) => a.title.localeCompare(b.title));

    sortedNodes.forEach((nodeData) => {
      console.log('노드 정보:', nodeData);
    });
  } catch (error) {
    console.error('노드 정보 가져오기에 실패하였습니다.', error);
  }
};
