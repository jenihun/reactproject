import {useState} from 'react'


const Print = ()=> {

    const [num, setNum] = useState(1);

    const printnum = (num) => {
        console.log(num)
    };

    const printrealnum = (setNum) => {
        plusnum(num)
        console.log(num)
    };

    const plusnum = (num) => {
       num = num + 1
    }

    return(
    <div>
        <button onClick={() => {printnum(setNum);printrealnum(setNum);}}>수 증가</button>
    </div>
    );
}

export default Print;