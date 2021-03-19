#!/usr/bin/env node
const readline = require('readline');

const rl = readline.createInterface({ //createInterface 메서드로 r1 객체를 설정
    //인수로 설정 객체를 제공 input 속성에는 process.stdin을 output 속성에는 process.stdout 을 넣음
    //process.stdin과 process.stdout은 각각 콘솔 입력과 출력을 담당하는 스트림임 readline 모듈은 이들을 사용해서 입력을 받고 그에 따른 결과를 출력
    
  input: process.stdin,
  output: process.stdout,
});

console.clear();
const answerCallback = (answer) => {
  if (answer === 'y') {
    console.log('감사합니다!');
    rl.close();
  } else if (answer === 'n') {
    console.log('죄송합니다!');
    rl.close();
  } else {
    console.clear();
    console.log('y 또는 n만 입력하세요.');
    rl.question('예제가 재미있습니까? (y/n) ', answerCallback);//r1 객체의 question 메서드의 첫번째 인수가 질문 내용임 두번째로 인수로 받는 콜백 함수는 매개변수로 답변(answer)를 가지고 있음 
  }
};

rl.question('예제가 재미있습니까? (y/n) ', answerCallback);