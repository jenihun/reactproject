import {GoogleAuthProvider, auth, firebaseConfig,signInWithPopup, initializeApp, onAuthStateChanged,signOut} from './firebase';
import { google } from "googleapis";


const googleClientId = "121079642070-ba0osda37t6s7op574peuvqrdjpogu99.apps.googleusercontent.com";
const client = new google.auth.OAuth2(googleClientId);


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

        const googleAccessToken = result.credential.accessToken;
        client.setCredentials({ access_token: googleAccessToken });

        google.people({ version: "v1", auth: client }).people.get({
          resourceName: "people/me",
          personFields: "names,genders",
        }, (data) => {
            // 사용자의 나이와 성별 추출
            const age = data.names[0].metadata.source.age;
            const gender = data.genders[0].value;
            
            console.log("나이:", age);
            console.log("성별:", gender);
        });
    
        

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