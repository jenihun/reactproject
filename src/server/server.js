const express = require('express'); //express 모듈을 불러온다. Node.js를 위한 웹 애플리케이션 프레임쿼크
const app = express(); //app변수에 Express 애플리케이션 객체 할당.
const PORT = process.env.PORT || 4000; //환경 변수에서 포트 번호를 가져오며, 환경 변수에 설정된 값이 없을 경우 기본값으로 4000을 사용
const db=require('./config/db.js') //config파일에서 db 모듈을 불러온다.

//get요정을 처리하는 라우트 핸들러 등록 루트(/)경로로 들어오는 GET요청에 대한 처리 정의
//요청 들어오면 root메세지 콘솔에 출력
app.get('/',(req,res)=>{
    console.log('/root')
})
//'/movies'경로로 들어오는 GET요청에 대한 처리를 정의 요청 들어오면 'movies'메세지 콘솔에 출력
app.get('/movies',(req,res)=>{
    console.log('/movies')
    //db객체를 사용하여, movie테이블에서 모든 데이터를 조회하는 select쿼리 실행
    //쿼리 실행 결과를 처리하는 콜백 함수, err매개변수는 오류 정보를 받음, data 매개변수는 쿼리 결과 데이터를 받음
    db.query("select * from movie",(err,data)=>{
        //쿼리 실행 중 오류가 없는 경우 콘솔에 조회된 데이터 출력
        if(!err){
            //요청을 보낸쪽에 쿼리문에 해당하는 데이터를 보냄
            res.send(data)
            //콘솔 창에 해당 쿼리문에 해당하는 데이터 출력
            console.log(data)
        }
        //쿼리 실행 중 오류 발생시, 콘솔에 오류 정보 출력
        else{
            console.log(err)
        }
    })
})

app.get('/movies:name',(req,res)=>{
    console.log('/movies/:name')
    const name=req.params.id
    console.log(name)//3
    db.query("",(err,data)=>{
        if(!err){
            res.send(data)
            console.log(data)
        }
        else{
            console.log(err)
        }
    })
})

//서버를 특정 포트 번호로 시작, 서버를 시작하고, 요청을 수신할 준비를 함
//템플릿 문자열 사용시 `<-이걸로 감싸야 값이 치환 됨.
app.listen(PORT, ()=>{
    console.log(`Server On : http://localhost:${PORT}`)
})

