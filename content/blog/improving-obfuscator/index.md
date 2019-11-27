---
title: "Улучшение самодельного JavaScript обфускатора"
date: "2019-11-23"
cover: ./maze.jpg
thumbnail: ./maze.jpg
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
    return [lit, subLit]; // we don't split numbers for the moment
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




Оригинал: [Improving our homemade JavaScript obfuscator](https://antoinevastel.com/javascript/2019/09/09/improving-obfuscator.html) 

---

enhance - увеличение  
serves - удовлетворять, подходить  
briefly - кратко  
would become - станет  
reminded - напомнил  

