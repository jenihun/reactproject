import {db, GoogleAuthProvider, auth, firebaseConfig,signInWithPopup, 
        setDoc,doc,initializeApp,signOut, collection} from './firebase';
import { useNavigate } from 'react-router-dom';
import { createContext, useContext, useState } from 'react';

//로그인
export const login = async () => {
    //firebase앱 초기화
    const app = initializeApp(firebaseConfig);
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);

        console.log('user :', result.user)
        console.log("구글 로그인 성공");

        // Firestore의 users collection에 문서 생성
        const userRef = doc(db, "users", result.user.uid);
        setDoc(userRef, {
          name: result.user.displayName,
          email: result.user.email,
          phoneNumber : result.user.phoneNumber,
        // 추가적인 필드 정보 저장 가능
      });
        const plansRef = collection(userRef,"plans");
        setDoc(plansRef, {

        });
      })
      .catch((error) => {
        const credential = GoogleAuthProvider.credentialFromError(error);
        // 소셜 로그인 실패 시 실행되는 코드
        console.log(error);
      });
};

//로그아웃
export const logout = async () => {
    await signOut(auth).then((result) => {
        console.log("로그아웃 성공");
    } ) // logout successful
    .catch((error) => {
        console.log(error);
    });
}

//사용자 확인
export const AuthStateChange = () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // 사용자가 인증되었을 때
      const uid = user.uid;
      console.log('사용자의 UID:', uid);
    } else {
      console.log('사용자가 로그아웃했거나 인증되지 않았습니다.');
    }
  });
};


// Firebase에서 가져온 User 객체를 저장하는 Context 생성
export const UserContext = createContext(null);

// UserContext를 사용하여 uid 값을 가져오는 훅 생성
export const useUser = () => {
  const { uid, setUid } = useContext(UserContext);
  return { uid, setUid };
};

export const Profile = async () =>{
  const {uid} = useUser();
  return uid;
}

/*
// UserContext를 사용하여 로그인한 사용자의 uid 값을 전역 상태로 관리하는 컴포넌트 생성
export const UserProvider = ({ children }) => {
  const [uid, setUid] = useState(null);

  return (
    <UserContext.Provider value={{ uid, setUid }}>
      {children}
    </UserContext.Provider>
  );
};
*/
