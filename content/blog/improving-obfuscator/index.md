---
title: "Улучшение самодельного JavaScript обфускатора"
date: "2019-11-23"
cover: ./code.jpg
thumbnail: ./code.jpg
draft: true
---

В [прошлом посте](/home-made-obfuscator/) мы создали простой JavaScript обфускатор и применили его к fingerprinting скрипту, который может использоваться для обнаружения ботов или <abbr title="enhance">улучшения</abbr> аутентификации. В этом посте мы расширим его, добавив новые трансформации, которые нацелены на уменьшение читаемости кода.  

Ещё раз, данный обфускатор не годится для использования в продакшене и подходит только для образовательных целей. Если вы ищите хороший обфускатор, взгляните на [obfuscator.io (open source)](https://obfuscator.io/) или [JSCrambler](https://jscrambler.com/).  
Перед тем, как я представлю код, <abbr title="briefly">кратко</abbr> рассмотрим код из прошлого поста.

## Текущие преобразования кода
Наш обфускатор заменяет статический доступ к полям объекта (методы и атрибуты) на динамические вызовы функций.
```js
errorMessage = e.message;
// станет
errorMessage = e[f(index, arr)];
```

Так же он заменит статические строки и числа на вызовы функций.
```js
context.textBaseline = "alphabetic";
// станет
context[f(index, arr)] = f(indexOther, arr);
```

Для этого, мы храним все статические строки, числа и статические члены объекта, к которым осуществляется доступ в коде, в один массив.
```js
// staticLiterals хранит различные атрибуты, которые мы хотим обфусцировать
[ 'AsyncFunction',
    'adblock',
    200,
    10,
    ...
    'pageYOffset',
    'clientWidth']
```

Чтобы сделать его менее читаемым, мы закодируем строки в этом массиве используя base64. Затем, когда мы хотим получить доступ к элементу массива в нашем коде, мы используем функцию **f** из прошлого примера, которая сопоставляет индекс и нужный элемент массива. 

## Новые преобразования 
Сейчас, когда мы вспомнили старые преобразования из первой части нашего обфускатора, посмотрим на новые. Будем надеяться, что они сделают обфусцированный код более сложным для понимания.

### Разделение строковых литералов и статических выражений членов
В первой версии обфускатора, строковые литералы и статические члены выражений хранились в массиве, закодированные base64. Таким образом, **toDataURL** хранился как **dG9EYXRhVVJM** (`atob('dG9EYXRhVVJM') = 'toDataURL'`). В новой версии, вместо сохранения base64 закодированного **toDataURL**, мы разделим строки на несколько частей. Так, в зависимости на сколько частей мы разобьем, можно хранить такие подстроки `t`, `dat`, `aU` and `RL` и после этого уже сохраним каждую из этих подстрок, используя base64.

Используем следующий код для получения всех литералов для обфускайии и разбиения их на подстроки.
```js
const staticLiterals = stringsProgram.concat(numbersProgram, bindingProperties, expStatementStr, staticMemberStr);
// Код довольно похож на старый
// staticLiteral содержит все строки/числа, который мы хотим обфусцировать


// Учитывая строку для разделения и максимальное количество разделений,
// возвращает массив подстрок, случайно разделённых
// splitStringLiteral("1234567890", 5);
// ["1", "23", "456", "7890"]
function splitStringLiteral(lit, maxNumSplits) {
    maxNumSplits = Math.min(maxNumSplits, lit.length);
    const numSplits = Math.max(1, Math.floor(maxNumSplits*Math.random()));
    const splits = new Set();
    while (splits.size < numSplits) {
        splits.add(Math.max(1, Math.floor(lit.length * Math.random())));
    }

    const orderedSplits = Array.from(splits);
    orderedSplits.sort((a, b) => a-b);
    const literalChunks = orderedSplits.map((v, idx) => {
        if(idx === 0) {
            return lit.substring(0, v);
        } else if (idx < orderedSplits.length -1 ) {
            return lit.substring(orderedSplits[idx-1], v);
        } else {
            return lit.substring(orderedSplits[idx-1]);
        }
    });

    if (numSplits === 1) {
        literalChunks.push(lit.substring(orderedSplits[0]))
    }
    return literalChunks;
}

const subLiterals = new Set(); // Для экономии места мы сохраняем каждую подстроку только один раз
// Мы строим отображение литералов, например 'toDataURL'
// на все её подстроки, ['t', 'oDataU', 'RL']
const staticLiteralToChunks = new Map(staticLiterals.map(lit => {
    let subLit;
    if (typeof lit === 'string') {
        subLit = splitStringLiteral(lit, transformationsConfig.maxSplits);
    } else {
        subLit = [lit]
    }

    subLit.forEach(v => subLiterals.add(v));
    return [lit, subLit]; // мы не разбиваем числа, пока...
}));

// Создаем массив, содержащий все подстроки
const subLitArr = Array.from(subLiterals);
const subLiteralToIndex = new Map(subLitArr.map((v, idx) => [v, idx]));
const staticLiteralToIndexChunks = new Map();
// Мы создаем map, которая связывает литерал с индексами всех
// его подстроки в массиве subLitArr
staticLiteralToChunks.forEach((v, k) => {
    const indexChunks = v.map(subLit => subLiteralToIndex.get(subLit));
    staticLiteralToIndexChunks.set(k, indexChunks);
});
```
Таким образом, доступ к свойству, например `myobj.property = 'myval'` будет иметь следующую форму в зависимости от количества разбиений: `myobj[f(index1, arr) + ... + f(indexN, arr)] = f(indexX, arr) + ... + f(indexZ, arr);`

### Меняем алфавит в base64
Наш второй преобразователь нацелен на изменение алфавита, используемого в кодировании литерал (чисел и строк). В прошлой версии, мы использовали base64 со стандартным алфавитом.
```js 
// Код из первой версии закодирует 'lit' в base64
new Buffer.from(lit).toString('base64')

// Стандартно используется следующий алфавит
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
```

Вместо использования стандартного алфавита, мы используем его переменную версию. Таким образом, вместо использования `new Buffer.from(lit).toString('base64')` для закодирования литерала, мы будем использовать следующую base64 функцию, которая будет так же принимать и алфавит, как параметр **keyStr**.
```js
function encode64(input, keyStr) {
    if (!String(input).length) return false;
    var output = "";
    ...
    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        ...
        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
            keyStr.charAt(enc3) + keyStr.charAt(enc4);
    } while (i < input.length);

    return output;
}
```

Затем, мы закодируем массив подстрок, который сделали на прошлом шаге и добавим результат в AST скрипта. 
```js
refactor.query('Script')[0].statements.unshift(new Shift.VariableDeclarationStatement({
    declaration: new Shift.VariableDeclaration({
        kind: 'const',
        declarators: [new Shift.VariableDeclarator({
            binding: new Shift.BindingIdentifier({
                name: 'members'
            }),
            init: new Shift.ArrayExpression({
                elements: subLitArr.map((lit) => {
                    if (typeof lit === 'string') {
                        return new Shift.LiteralStringExpression({
                            value: encode64(lit, alphabet)
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

Так как мы используем не стандартный алфавит для кодирования литерал, нужно где то его хранить.  
Мы создаем переменную со случайным именем, которая будет содержать алфавит, используемый для декодирования, и добавляем их в скрипт.
```js
// Мы генерируем случайное имя переменной
const alphabetPropertyName = generateRandomString(6);

// Генерируем случайный алфавит
const alphabet = shuffle("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    .split(''))
    .join('');

// Добавляем переменные в скрипт
const alphabetElement = parseScript(`window['${alphabetPropertyName}'] = '${alphabet}'`).statements[0];
refactor.query('Script')[0].statements.unshift(alphabetElement);
```

Поскольку мы не хотим, чтобы это переменная была обфусцированна, выполним этот код после обфускации.

В прошлой версии мы использовали встроенную функцию **atob** для декодирования строк, которые были обфусцированы base64. <abbr title="Nevertheless">Тем не менее</abbr>, **atob** не может использовать другие алфавиты. Поэтому мы добавили нашу собственную функцию декодирования, с использованием нашего алфавита.
```js
const decodeBody = `function decode64(input, keyStr) {
    ...
    // Удалить все символы, которые не A-Z, a-z, 0-9, +, /, or =
    input = input.replace(/[^A-Za-z0-9\\+\\/\\=]/g, "");
    do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));
        ...
    } while (i < input.length);
    return output;
}`;

// Добавляем в наш скрипт
const decodeBodyAst = parseScript(decodeBody).statements[0];
refactor.query('Script')[0].statements.unshift(decodeBodyAst);
```

Переключение с base64 со стандартным алфавитом, на base64 со случайным алфавитом не слишком сильно улучшает безопасность. Тем не менее, это может помочь против неопытных пользователей. Если попытаться раскодировать литералы с помощью **atob**, без использования алфавита, то это не будет работать.

### Добавление тернарных операций
Третьим и последним преобразованием мы добавим тернарные операции, сделав код менее читаемым. В прошлой версии, мы заменяли все литералы и статические поля следующий образом. 
```js
myobj.property = 'myval'
// станет
myobj[f(index, arr)] = f(otherIndex, arr);
```

После применения первого преобразования их этой статьи, вывод станет более сложным: 
```js
myobj.property = 'myval'
// станет
myobj[f(index1, arr) + f(index2, arr) + ... + f(indexN, arr)] = f(indexX, arr) + ... + f(indexZ, arr);
```

Тем не менее, всякий раз мы преобразуем одним и тем же методом. Чтобы сделать обратное преобразование более сложным, будем использовать несколько подходов для преобразования. В новой версии я предлагаю использовать тернарный оператор, т.е. оператор, которые имеет следующую структуру.
```js
mycondition ? expressionWhenTrue : expressionWhenFalse
```
В новой версии `myobj.property = 'myval'` будет переведено в это:
```js
myobj[f(index1, arr) + (alwaysTrue() ? f(index2, arr) : 'randomValue' )+ ... + f(indexN, arr)] = (alwaysFalse ? f(randomIndex, arr) : f(indexX, arr)) + ... + f(indexZ, arr);
```
Оригинал: [Improving our homemade JavaScript obfuscator](https://antoinevastel.com/javascript/2019/09/09/improving-obfuscator.html) 

---

enhance - увеличение  
serves - удовлетворять, подходить  
briefly - кратко  
would become - станет  
reminded - напомнил  
permutation - перестановка  
contrary - вопреки, против  
guarantees - гарантии  
