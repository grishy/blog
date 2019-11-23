---
title: "Простой самодельный обфускатор JavaScript "
date: "2019-09-25"
cover: ./maze.jpg
thumbnail: ./maze.jpg
draft: false
---

В этой статье я покажу как можно создать свой простой JavaScript обфускатор. Чтобы проиллюстрировать его работу, мы применим его к простому [fingerprinting скрипту](https://habr.com/ru/company/oleg-bunin/blog/321294/). В оставшейся части это поста, мы будем предполагать, что работаем в директории со следующей структурой:

```js
myObfuscator/
    dist/
    src/
    test/
```

Директория **src/** будет содержать исходный JavaScript код, в то время как **dist/** директория будет содержать транспилируемые или обфусцированные версии этих файлов. Наконец, в директории **test/** будет лежать файлы, проверяющий что код работает после обфусцирования.

В этом посте я попытаюсь привести полный рабочий пример. Тем не менее, если вы просто заинтересованы только реализацией обфускатора, можете пропустить следующий раздел.

## Fingerprinting script

Для лучшего понимая применения обфускации, используем маленький скрипт для идентификации, как пример для данной статьи. Никаких знаний об этой технологии не требуется, чтобы понять оставшуюся часть поста. Тем не менее, я коротко опишу, что это за технология.
Browser fingerprinting это техника, которая собирает набор атрибутов, относящихся к пользовательскому устройству и браузеру. Чтобы собрать эти атрибуты, мы можем использовать HTTP заголовки, отправляемые браузером и так же JavaScript APIs. В этом посте, мы будем использовать только JavaScript API. Полученный отпечаток можно использовать как для отслеживания пользователя, там и для защиты от ботов и сканеров (crawlers). В контексте безопасности fingerprinting'a компании часто хотя обфусцировать скрипт сбора информации, чтобы атакующим было сложнее узнать собранные атрибуты. Действительно, поскольку JavaScript выполняется в браузере, его необходимо отправить на компьютер пользователя. Таким образом, злоумышленники могут посмотреть на содержание скрипта, отсюда и необходимость обфускации. Тем не менее, следует соблюдать осторожность, поскольку оно не идеально. При необходимом времени и усилия, злоумышленники могут разобрать скрипт.

Мы используем простой скрипт с несколькими атрибутами, чтобы его было легче понять. В каталоге **src/** мы создаем файл с именем **SimpleFingerprintCollector.js**.

```javascript
class SimpleFingerprintCollector {
    constructor() {
        this.tests = [];
        this.fingerprint = {}
    }

    registerTest(name, test) {
        this.tests.push({
            name: name,
            fn: test
        });
    }

    async collect() {
        const testsPromises = [];

        for (let test of this.tests) {
            if (test.fn.constructor.name === 'AsyncFunction') {
                testsPromises.push(new Promise(async(resolve) => {
                    testsPromises.push(test.fn().then((resTest) => {
                        this.fingerprint[test.name] = resTest;
                    }, (err) => {
                        this.fingerprint[test.name] = err;
                    }))
                }));
            } else {
                try {
                    this.fingerprint[test.name] = test.fn();
                } catch (err) {
                    this.fingerprint[test.name] = err;
                }
            }
        }

        await Promise.all(testsPromises);
        return this.fingerprint;
    }
}

const fingerprintCollector = new SimpleFingerprintCollector();
```

Он содержит класс с тремя методами. Можно добавить отпечаток используя метод **fingerprintCollector.registerTest** и собрать их с помощью **fingerprintCollector.collect**.  

Затем в каталоге **src/** мы создаем подкаталог с именем **fingerprint/**. В **src/fingerprint/** мы разместим все наши тесты. Хотя нет необходимости отделять тесты от класса **SimpleFingerprintCollector**, я сделаю это в качестве примера, чтобы показать, как использовать Gulp для объединения файлов.

В **src/fingerprint/** мы добавили canvas fingerprinting:
```javascript
// src/fingerprint/canvas.js
fingerprintCollector.registerTest('canvas', () => {
    let res = {};
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    canvas.style.display = "inline";
    const context = canvas.getContext("2d");

    try {
        context.rect(0, 0, 10, 10);
        context.rect(2, 2, 6, 6);
        res.canvasWinding = context.isPointInPath(5, 5, "evenodd");
    } catch (e) {
        res.canvasWinding = 'unknown';
    }

    try {
        context.textBaseline = "alphabetic";
        context.fillStyle = "#f60";
        context.fillRect(125, 1, 62, 20);
        context.fillStyle = "#069";
        context.font = "11pt no-real-font-123";
        context.fillText("Cwm fjordbank glyphs vext quiz, 😃", 2, 15);
        context.fillStyle = "rgba(102, 204, 0, 0.2)";
        context.font = "18pt Arial";
        context.fillText("Cwm fjordbank glyphs vext quiz, 😃", 4, 45);

        context.globalCompositeOperation = "multiply";
        context.fillStyle = "rgb(255,0,255)";
        context.beginPath();
        context.arc(50, 50, 50, 0, 2 * Math.PI, !0);
        context.closePath();
        context.fill();
        context.fillStyle = "rgb(0,255,255)";
        context.beginPath();
        context.arc(100, 50, 50, 0, 2 * Math.PI, !0);
        context.closePath();
        context.fill();
        context.fillStyle = "rgb(255,255,0)";
        context.beginPath();
        context.arc(75, 100, 50, 0, 2 * Math.PI, !0);
        context.closePath();
        context.fill();
        context.fillStyle = "rgb(255,0,255)";
        context.arc(75, 75, 75, 0, 2 * Math.PI, !0);
        context.arc(75, 75, 25, 0, 2 * Math.PI, !0);
        context.fill("evenodd");
        res.image = canvas.toDataURL();

    } catch (e) {
        res.image = 'unknown';
    }

    return res;
});
```

Соберём информацию так же и о платформе:
```javascript
// src/fingerprint/platform.js
fingerprintCollector.registerTest('platform', () => {
    if (navigator.platform) {
        return navigator.platform
    }

    return 'unknown';
});
```
Добавим ещё несколько метрик... полный [код можно найти на GitHub](https://github.com/antoinevastel/simpleJSObfuscator).


## Сборка не обфусцированного скрипта.
После этого используем Gulp, для сборки не обфусцированной версии скрипта. Для этого создадим файл **gulpfile.js** в корне проекта. На данный момент мы объявим одну задачу в gulp файле. К концу поста мы добавим ещё несколько, для вызова обфускации и минификации.

```javascript
// gulpfile.js
const {series, src, dest } = require('gulp');
const concat = require('gulp-concat');

function concatScripts() {
    return src(['src/simpleFingerprintCollector.js', 'src/fingerprint/*.js'])
        .pipe(concat('simpleFingerprintCollector.js'))
        .pipe(dest('./dist/'));
}

exports.concat = concatScripts;
```

Из корня проекта вы можете собрать не обфусцированную версию скрипта выполнив `gulp concat` в терминале. Это сгенерирует **simpleFingerprintCollector.js** в папке **dist/**. В файле будут находится наш класс и несколько вариантов взятия атрибутов (canvas, платформа).
```javascript
// dist/simpleFingerprintCollector.js

class SimpleFingerprintCollector {
    ...
}

const fingerprintCollector = new SimpleFingerprintCollector();

fingerprintCollector.registerTest('adblock', () => {
    ...
    return result;
});

fingerprintCollector.registerTest('canvas', () => {
    ...
    return result;
});

// Другие тесты ...

fingerprintCollector.registerTest('screenResolution', () => {
    ...
    return result;
});
```

## Обфускация скрипта
Сейчас, когда у нас есть fingerprinting скрипт, мы можем обфусцировать его. Существует несколько различных подходов, простые или более сложные и эффективные и не очень. Вы можете почитать об этом более подробно в [другой статье](https://antoinevastel.com/obfuscation/2017/12/06/presentation-obfuscation.html)(англ.), где я описал базовые техники обфускации. В данном посте, мы будем использовать простую технику обфускации, которая <abbr title="consists">заключается</abbr> в замене статических строк и чисел, <abbr title="as well as">а так же</abbr> к свойствам и методам объекта с помощью вызова функции, чтобы сделать его менее читаемым. Если вы хотите нечто похожее, но production-ready решение, вы можете использовать [obfuscator.io](https://obfuscator.io/) или связанный с ним npm пакет. Техника, представленная в этом после довольно похожа на **String Array** опцию в их обфускаторе.

<abbr title="The way">То</abbr>, как я реализую обфускато, явно не оптимально. Более того, я <abbr title="not consistent">не использую один стиль</abbr> по всему коду. Идея состоит в том, чтобы показать различные пути манипулирования кодом и [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree). Я использую библиотеку [shift](https://shift-ast.org/), но можно использовать и другие. Например [Esprima](https://esprima.org/).

Мы создадим **src/obfuscator.js** файл, который будет содержать код нашей программы обфускации. В этом файле, мы добавим несколько преобразователей кода, которые сделают его менее читаемым. Например, мы хотим преобразовать присваивания свойств объекта, чтобы сделать их менее читаемыми. Мы так же можем заменить статические строки и чиста вызовами функций.
```js
context.textBaseline = "alphabetic";
// станет
context[f(index, arr)] = f(indexOther, arr);
```

Мы так же хотим изменить статический доступ к полям объекта (методам и атрибутам), чтобы сделать их динамическими, используя вызовы функций:
```js
errorMessage = e.message;
// станет
errorMessage = e[f(index, arr)];
```

Чтобы сделать это, в начале нужно импортировать библиотеки, которые мы будем использовать.
```js
const { RefactorSession } = require('shift-refactor');
const { parseScript } = require('shift-parser');
const Shift = require('shift-ast');
const fs = require('fs');
```

Для обфускации скрипта будем манипулировать с его AST (Абстрактное Синтаксическое Дерево), древовидным представлением кода. Если вы хотите посмотреть как оно выглядит в UI, можно использовать [AST Explorer](https://astexplorer.net/).

Затем мы создаем функцию `obfuscateFPScript`, которая принимает в качестве входных аргументов путь к файлу для обфускации и путь для сохранения результата преобразования. В этой функции мы начинаем собирать различные строки, числа и свойства объекта для обфускации.
```js
function obfuscateFPScript(src, dest) {
    // Читаем содержимое переданного файла (не обфусцированное)
    const fileContents = fs.readFileSync(src, 'utf8');

    // Используя shift-ast библиотеку парсим скрипт и строим ast
    const tree = parseScript(fileContents);

    // Инициализируем сессию рефакторинга, используемая, например, для запроса узлов дерева 
    const refactor = new RefactorSession(tree);

    // Приведённые ниже 5 операторов извлекают различные строки, числа и свойства объектов
    // которые мы хотим обфусцировать
    // refactor.query позволяет запрашивать определённые узлы AST используя синтаксис, похожий на CSS
    // Таким образом, например refactor.query('LiteralStringExpression') вернёт все LiteralStringExpression
    // в программе.
    const stringsProgram = Array.from(new Set(refactor.query('LiteralStringExpression').map(v => v.value)));
    const numbersProgram = Array.from(new Set(refactor.query('LiteralNumericExpression').map(v => v.value)));
    const bindingProperties = Array.from(new Set(refactor.query('AssignmentExpression[binding.type="StaticMemberAssignmentTarget"]').map(v => v.binding.property)));
    const expStatementStr = Array.from(new Set(refactor.query('ExpressionStatement[expression.expression.type="StaticMemberExpression"]').map(exp => exp.expression.expression.property)));
    const staticMemberStr = Array.from(new Set(refactor.query('StaticMemberExpression').map(v => v.property)));

    const staticLiterals = stringsProgram.concat(numbersProgram, bindingProperties, expStatementStr, staticMemberStr);
    // staticLiterals - содержит атрибуты, которые мы хотим обфусцировать
    [ 'AsyncFunction',
      'adblock',
      'div',
      '&nbsp;',
      'adsbox',
      'canvas',
      'rgb(255,255,0)',
      'timezone',
      0,
      400,
      200,
      10,
      ...
      'screenX',
      'pageXOffset',
      'pageYOffset',
      'clientWidth']

    const staticLiteralToIndex = new Map(staticLiterals.map((lit, idx) => [lit, idx]));
}
```

После, мы изменяем AST первоначальной программы, записывая **staticLiterals** массив в её начало. Вместо того, чтобы хранить сырые значения элементов масиива, мы закодируем их с помощью base64.
```js
refactor.query('Script')[0].statements.unshift(new Shift.VariableDeclarationStatement({
    declaration: new Shift.VariableDeclaration({
        kind: 'const',
        declarators: [new Shift.VariableDeclarator({
            binding: new Shift.BindingIdentifier({
                name: 'members'
            }),
            init: new Shift.ArrayExpression({
                elements: staticLiterals.map((lit) => {
                    if (typeof lit === 'string') {
                        return new Shift.LiteralStringExpression({
                            value: new Buffer.from(lit).toString('base64')
                        })
                    } else if (typeof lit === 'number') {
                        return new Shift.LiteralNumericExpression({
                            value: lit
                        })
                    }

                })
            })
        })]
    })
}));
```

Мы так же вставим функции вызывающие **indexToLiteral** в AST нашего скрипта. Её задача, используя индекс в массиве и массив, вернуть элемент по данному индексу. <abbr title="Since">Поскольку</abbr> мы закодировали строки в нашем массиве используя base64, нужно преобразовать их обратно используя функцию **atob**. Хотя это <abbr title="not really improve the resilience ">не очень сложная обфускация</abbr>, я просто показал это как пример и теперь вы можете реализовать более сложные преобразования <abbr title="on your own">самостоятельно</abbr>. 

```js
const indexToStr = `
    function indexToLiteral(index, arr) {
        if (typeof arr[index] ==='string') return atob(arr[index]);
            return arr[index];
    }`;

// Вместо создания функции с использованием класса Shift, как мы
// сделали для предыдущего фрагмента кода, здесь мы определяем функцию как строку
// и после преобразует так же в AST и встраивает в AST, которое мы преобразуем
const indexToStrAst = parseScript(indexToStr).statements[0];
refactor.query('Script')[0].statements.unshift(indexToStrAst);
```

Наконец, мы применяем различные преобразования кода:

```js
// Короткая функция, помогающая нам легче создавать выражения вызовов
function buildIndexToLitCallExpression(index) {
        return new Shift.CallExpression({
            callee: new Shift.IdentifierExpression({
                name: 'indexToLiteral'
            }),
            arguments: [
                new Shift.LiteralNumericExpression({
                    value: index
                }),
                new Shift.IdentifierExpression({
                    name: 'members'
                })

            ]
        })
    }

// Преобразование строк и чисел, используемых в аргументах функций
refactor.query('CallExpression')
        .forEach(callExpression => {
            callExpression.arguments.forEach((argument, idx) => {
                if (argument.type === 'LiteralStringExpression' || argument.type === 'LiteralNumericExpression') {
                    callExpression.arguments[idx] = buildIndexToLitCallExpression(staticLiteralToIndex.get(argument.value))
                }
            });
        });

// Присвоения вида myobj.prop = val; => myobj[func(idx, arr)] = val;
refactor.query('AssignmentExpression[binding.type="StaticMemberAssignmentTarget"]')
    .forEach(assignmentExpression => {
        assignmentExpression.binding = new Shift.ComputedMemberAssignmentTarget({
            object:  assignmentExpression.binding.object,
            expression: buildIndexToLitCallExpression(staticLiteralToIndex.get(assignmentExpression.binding.property))
        });
    });

// Строки и числа в оператораях-выражениях
refactor.query(':matches(ExpressionStatement[expression.expression.type="LiteralStringExpression"], ' +
    'ExpressionStatement[expression.expression.type="LiteralNumericExpression"])')
    .forEach((exp) => {
        exp.expression.expression = buildIndexToLitCallExpression(staticLiteralToIndex.get(exp.expression.expression.value))
    });

// Строки и числа в объявлении переменных
refactor.query('VariableDeclarationStatement')
    .forEach((exp) => {
        exp.declaration.declarators.forEach((declarator) => {
            if (declarator.init.type === 'LiteralNumericExpression' || declarator.init.type === 'LiteralStringExpression') {
                declarator.init = buildIndexToLitCallExpression(staticLiteralToIndex.get(declarator.init.value))
            }
        })
    });

// Сделать доступ к полям и методам объекта динамическим
refactor.query('StaticMemberExpression')
    .forEach((exp) => {
        exp.type = 'ComputedMemberExpression';
        exp.expression = buildIndexToLitCallExpression(staticLiteralToIndex.get(exp.property));
        delete exp.property;
    });

// Генерируем код на из получившегося AST дерева и сохраняем его в файл
fs.writeFileSync(dest, refactor.print(), 'utf8');
```

## Добавлене нашего обфускатора в Gulp
Для полной автоматизации обфускаии, создадим новую задачу в **gulpfile.js**.

```js
// gulpfile.js
const obfuscator = require('./src/obfuscator.js');

function obfuscateFPScript(done) {
    obfuscator.obfuscate('./dist/simpleFingerprintCollector.js', './dist/obfuscated.js');
    done();
}

exports.obfuscate = obfuscateFPScript;
```

Таким образом, для запуска обфускации мы можем выполнить команду `gulp obfuscate`, которая создаст файл с именем **obfuscated.js** в директории **dist/**.

## Изменение имени переменных

На это этапе наш обфускатор все ещё содержит некоторые переменные с  <abbr title="meaningful">осмысленными</abbr> именами. 
Вместо переименования переменных самостоятельно, я покажу как мы можем использовать **gulp-terser** для переименования переменных и таким образом уменьшить кол-во информации, доступное для злоумышленника. 

```js
const terser = require('gulp-terser');
const rename = require('gulp-rename');

// Создадим новую задачу
function compress () {
    // Как входные параметры, передадим обфусцируемый скрипт
    return src('dist/obfuscated.js')
        .pipe(terser({
            compress: {
                booleans: false,
                drop_console: true,
                evaluate: false,
                keep_classnames: false
            },
            mangle: {
                toplevel: true,
                reserved: ['fingerprintCollector', 'collect'] // мы не должны переименовывать переменные fingerprintCollector, collect
                // так как это нужно для получения доступа из других скриптов, которым нужно знать их имя
            },
            keep_fnames: false,
            output: {
                beautify: false,
                preamble: '/* You superb copyright here */' // Вы так же можете добавить сообщение или копирайты в заголовок
                // вашего скрипта
            }
        }))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(dest('dist/')) // это создаст новый файл **dist/obfuscated.min.js**
}

exports.compress = compress;

// Мы определяем новую gulp задачу с именем build
// Эта задача вызывает последовательно 3 другие задачи, определённые выше в посте
exports.build = series(concatScripts, obfuscateFPScript, compress);
```

## Тестирование нашего обфусцированного кода

При создании собственного обфускатора или при применении преобразования к коду можно создать код, который выглядит рабочим, но работает не так как ожидалось. Таким образом важно иметь тесты для автоматической проверки, работает ли преобразованный код как оригинальный. Для тестирования нашего кода мы используем библиотеки *Chai* и *Puppeteer*. Puppeteer позволяет легко автоматизировать проверку работы в браузере. 

В **test/** директории мы создадим простой HTML файл, который включает наш обфусцируемый код.
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<script src='../dist/obfuscated.min.js'></script>
</body>
</html>
```

Затем создаем тестовый файл **test.js**. Он включает различные unit тесты, которые проверяют, работают ли наш код как ожидалось.
В нашем примере я создам только 3 простых теста для демонстрации, как это работает.
```js
const {expect} = require('chai');
const puppeteer = require('puppeteer');
const path = require('path');

describe('Fingerprinting on Chrome Headless', function () {
    let browser, page;
    let fingerprint;

    before(async function () {
        // Код выполняемый до начала работы тестов

        // мы создаем экземпляр puppeteer
        // он позволяет управлять Chrome headless
        browser = await puppeteer.launch();
        page = await browser.newPage();

        // мы загружаем HTML страницу, которая находится в этой же директории
        await page.goto('file://' + path.resolve(__dirname, 'test.html'), {
            waitUntil: 'load'
        });

        // Выполняем код в контексте нашей HTML страницы, чтобы получить результат работы fingerprint скрипта
        fingerprint = await page.evaluate(async () => {
            try {
                const fingerprint = await fingerprintCollector.collect();
                return fingerprint;
            } catch (e) {
                return e.message;
            }
        });
    });

    after(async function () {
        // Когда все тесты выполнены, мы закрываем страницу и браузер
        await page.close();
        await browser.close();
    });

    // Создадим 3 unit теста
    it('resOverflow should be an object', () => {
        expect(typeof fingerprint.resOverflow).to.equal('object');
    });

    it('screen should have 16 properties', () => {
        const isScreenValid = fingerprint.screenResolution !== undefined && Object.keys(fingerprint.screenResolution ).length === 16;
        expect(isScreenValid).to.be.true;
    });

    it('adblock should be false', () => {
        expect(fingerprint.adblock).to.be.false;
    });

});
```

Таким образом сейчас у нас есть обфусцированный fingerprinting скрипт, который должен работать <abbr title="properly">правильно</abbr> в браузере. Вы можете найти [полный код на GitHub](https://github.com/antoinevastel/simpleJSObfuscator). <abbr title="snippet">Фрагмент</abbr> внизу показывает пример обфусцированного кода для функции, отвечающий за сбор данных с canvas.
```js
let e = {};
const Z = document[t(69, c)](t(5, c));
Z[t(101, c)] = t(27, c), Z[t(102, c)] = t(28, c), Z[t(75, c)][t(50, c)] = t(6, c);
const n = Z[t(76, c)](t(7, c));
try {
    n[t(77, c)](t(26, c), t(26, c), t(29, c), t(29, c)), n[t(77, c)](t(30, c), t(30, c), t(31, c), t(31, c)), e[t(51, c)] = n[t(78, c)](t(32, c), t(32, c), t(8, c))
} catch (Z) {
    e[t(51, c)] = t(9, c)
}
try {
    n[t(52, c)] = t(10, c), n[t(53, c)] = t(11, c), n[t(79, c)](t(33, c), t(34, c), t(35, c), t(36, c)), n[t(53, c)] = t(12, c), n[t(54, c)] = t(13, c), n[t(80, c)](t(14, c), t(30, c), t(37, c)), n[t(53, c)] = t(15, c), n[t(54, c)] = t(16, c), n[t(80, c)](t(14, c), t(38, c), t(39, c)), n[t(55, c)] = t(17, c), n[t(53, c)] = t(18, c), n[t(81, c)](), n[t(82, c)](t(40, c), t(40, c), t(40, c), t(26, c), 2 * Math[t(83, c)], !0), n[t(84, c)](), n[t(85, c)](), n[t(53, c)] = t(19, c), n[t(81, c)](), n[t(82, c)](t(41, c), t(40, c), t(40, c), t(26, c), 2 * Math[t(83, c)], !0), n[t(84, c)](), n[t(85, c)](), n[t(53, c)] = t(20, c), n[t(81, c)](), n[t(82, c)](t(42, c), t(41, c), t(40, c), t(26, c), 2 * Math[t(83, c)], !0), n[t(84, c)](), n[t(85, c)](), n[t(53, c)] = t(18, c), n[t(82, c)](t(42, c), t(42, c), t(42, c), t(26, c), 2 * Math[t(83, c)], !0), n[t(82, c)](t(42, c), t(42, c), t(43, c), t(26, c), 2 * Math[t(83, c)], !0), n[t(85, c)](t(8, c)), e[t(56, c)] = Z[t(86, c)]()
} catch (Z) {
    e[t(56, c)] = t(9, c)
}
return e
```

Хотя это выглядит полностью не читаемым, этот тип обфускаторов может быть легко reverse engineered. Чтобы узнать больше об этом, можете посмотреть [Jarrod Overson’s Youtube канал](https://www.youtube.com/channel/UCJbZGfomrHtwpdjrARoMVaA/videos).  

В [следующей части](https://antoinevastel.com/javascript/2019/09/09/improving-obfuscator.html), я добавил больше трансформаций в наш обфускатор.

Оригинал: [A simple homemade JavaScript obfuscator](https://antoinevastel.com/javascript/2019/09/04/home-made-obfuscator.html)

---

consists - заключается  
as well as - так же как  
either - тоже, любой  
statements - оператор, заявление  
enables - позволяет  
Thus, ... - таким образом  
given - данный, данность  
resilience - устойчивость, упругость  
on your own - самостоятельно  
Assignments - Присвоения  
meaningful - осмысленно  
sequentially - последовательно  
instance - экземпляр  
obtain - получать, добывать  
Once - однажды, когда
properly - должным образом, правильно