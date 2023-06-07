
import {React, useEffect, useState} from "react"; //React를 임포트한다. React컴포넌트를 정의하기 위해 필요한 도구


const TEST = () => {
    // let number = 0;

    let [number, setNumber] = useState(0);

    function countUp (oldValue) {
        console.log('old value', oldValue)
        return oldValue + 10
    }

    useEffect(() => {
        console.log('number 값 바뀜!!')
    }, [number])

    return (
        <div>
            <button onClick={() => { setNumber(countUp); console.log(number) }}>1 증가</button>
            {/* <button onClick={() => { number=3; console.log(number) }}>1 증가</button> */}
            <span>{number}</span>
        </div>
    )
}

export default TEST

