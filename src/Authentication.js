import {GoogleAuthProvider, auth, firebaseConfig,signInWithPopup, initializeApp, onAuthStateChanged,signOut} from './firebase';

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
        console.log('tocken :', result.credential.accessToken)


        console.log("구글 로그인 성공");
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