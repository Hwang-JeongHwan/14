#!/usr/bin/env node
const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

const htmlTemplate = `
<!DOCTYPE html>
  <html>
  <head>
    <meta chart="utf-8" />
    <title>Template</title>
  </head>
  <body>
    <h1>Hello</h1>
    <p>CLI</p>
  </body>
</html>
`;

const routerTemplate = `
const express = require('express');
const router = express.Router();
 
router.get('/', (req, res, next) => {
   try {
     res.send('ok');
   } catch (error) {
     console.error(error);
     next(error);
   }
});
 
module.exports = router;
`;

const exist = (dir) => {
  try {
    fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch (e) {
    return false;
  }
};

const mkdirp = (dir) => {
  const dirname = path
    .relative('.', path.normalize(dir))
    .split(path.sep)
    .filter(p => !!p);
  dirname.forEach((d, idx) => {
    const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
    if (!exist(pathBuilder)) {
      fs.mkdirSync(pathBuilder);
    }
  });
};

const makeTemplate = (type, name, directory) => {
  mkdirp(directory);
  if (type === 'html') {
    const pathToFile = path.join(directory, `${name}.html`);
    if (exist(pathToFile)) {
      console.error(chalk.bold.red('이미 해당 파일이 존재합니다'));
    } else {
      fs.writeFileSync(pathToFile, htmlTemplate);
      console.log(chalk.green(pathToFile, '생성 완료'));
    }
  } else if (type === 'express-router') {
    const pathToFile = path.join(directory, `${name}.js`);
    if (exist(pathToFile)) {
      console.error(chalk.bold.red('이미 해당 파일이 존재합니다'));
    } else {
      fs.writeFileSync(pathToFile, routerTemplate);
      console.log(chalk.green(pathToFile, '생성 완료'));
    }
  } else {
    console.error(chalk.bold.red('html 또는 express-router 둘 중 하나를 입력하세요.'));
  }
};

program //program 객체에는 다양한 메서드가 존재함
  .version('0.0.1', '-v, --version') //version 프로그램의 버전을 설정할수있음 첫번째 인수로 버전을 넣어주고 두번째 인수로 버전을 보여줄 옵션을 넣음
  //여래개인 경우 쉽표로 구분하면됨 현재 --version으로 지정되어있고 -v 는 축약 옵션임 node -v npm -v 처럼 cli -v 로 프로그램의 버전을 확인할수있음
  .name('cli');//명령어의 이름을 넣음 cli 를 적으면 됨

program
  .command('template <type>') //명령어를 설정하는 메서드임 현재 template <type> 과 *라는 두개의 명령어를 설정함 따라서cli template html 과 같이
  //명령할수있게됨 <>는 필수라는 의미이므로 type 을 넣지않으면 에러가 발생 *는 와일드카드 명령어로 나머지 모든 명령어를 의미함 template을 제외한 다른 명령어를 입력했을때 실행
  .usage('<type> --filename [filename] --path [path]') //이 메서드를 사용하면 명령어의 사용법을 설정할수있음 사용법은 명령어에 도움 옵션(-h or --help)
  //을 붙였을때 나타나는 설명서에 표시됨 설명서는 commander가 자동으로 생성함 [options]라고 되어있는데 []는 필수가 아닌 선택이라는 뜻임
  //즉 옵션을 넣어도 되고 안 넣어도됨 
  .description('템플릿을 생성합니다.') //명령어에 대한 설명을 설정하는 메서드임 역시 명령어 설명서에 표시됨
  .alias('tmpl') //명령어의 별칭을 설정할수있음 template 명령어의 별칭이 tmpl로 설정되어있으르모
  //cli teplate html 대신 cli tmpl html로 명령어를 실행할수있음
  .option('-f, --filename [filename]', '파일명을 입력하세요.', 'index') //명령어에 대한 부가적인 옵션을 설정할수있음 template 명령어 같은 경우에는
  //파일명(--filename)과 생성경로 (--directory)를 옵션으로 가짐 이메서드의 첫번째 인수가 옵션 명령이고 두번째 인수가 옵션에대한 설명임
  //마지막 인수는 옵션 기본값임 옵션을 입력하지 않았을 경우 자동으로 기본값이 적용됨 옵션이름으로 name은 위의 name메서드와 충돌할 위험이 있으니 사용하지 
  //않는것이 좋음
  .option('-d, --directory [path]', '생성 경로를 입력하세요', '.')
  .action((type, options) => { //명령어에 대한 실제 동작을 정의하는 메서드임 <type>같은 필수요소나 오볏ㄴ들을 매개변수로 가져올수있음
    makeTemplate(type, options.filename, options.directory);
  });

program
  .action((cmd, args) => {
    if (args) {
      console.log(chalk.bold.red('해당 명령어를 찾을 수 없습니다.'));
      program.help();//설명서를 보여주는 옵션임 -h나 --help옵션으로 설명서를 볼수도있지만 이 메서드를 사용해 프로그래밍적으로 표시할수도있음 
    } else {
      inquirer.prompt([{
        type: 'list',
        name: 'type',
        message: '템플릿 종류를 선택하세요.',
        choices: ['html', 'express-router'],
      }, {
        type: 'input',
        name: 'name',
        message: '파일의 이름을 입력하세요.',
        default: 'index',
      }, {
        type: 'input',
        name: 'directory',
        message: '파일이 위치할 폴더의 경로를 입력하세요.',
        default: '.',
      }, {
        type: 'confirm',
        name: 'confirm',
        message: '생성하시겠습니까?',
      }])
        .then((answers) => {
          if (answers.confirm) {
            makeTemplate(answers.type, answers.name, answers.directory);
            console.log(chalk.rgb(128, 128, 128)('터미널을 종료합니다.'));
          }
        });
    }
  })
  .parse(process.argv); //program객체의 마지막에 붙이는 메서드임 procss.argv를 인수로 받아서 명령어와 옵션을 파싱함 