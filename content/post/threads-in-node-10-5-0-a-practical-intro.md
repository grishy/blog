+++
title = "Потоки в Node 10.5.0: практическая часть"
date = 2019-01-01

categories = [ "Node.js" ]

# 1920x800
image = "threads-in-node-10-5-0-a-practical-intro/cover.jpg"
# 740x300
thumbnail = "threads-in-node-10-5-0-a-practical-intro/thumbnail.jpg"


[translate]
    # 40x40
    avatar = "threads-in-node-10-5-0-a-practical-intro/avatar.jpg"
    name = "Fernando Doglio"
    url = "https://medium.com/dailyjs/threads-in-node-10-5-0-a-practical-intro-3b85a0a3c953"

+++

Вместе с релизом версии 10.5.0 Node.js была добавлена поддержка базовых (и экспериментальных) возможностей работы с потоками. 
<!--more-->

И это интересно, особенно в языке, который всегда годится тем, что ему не нужны потоки из-за офигенного асинхронного I/O. Так зачем же потоки понадобились в Node?

Короткий и просто ответ на это: чтобы убрать пробелы в той области, где Node был не так хорош в прошлом - работа с требовательными CPU задачами. Это основная причина того, почему Node.js  не силён в области  ИИ, машинного обучения, Data Science и прочих схожих областях. В настоящее время прилагается много усилий для решения данной проблемы, но мы все ещё не так хороши там, как например в  деплое микросервисов.

Поэтому, я попытаюсь упростить техническую документацию, предоставленную первоначальным [PR](https://github.com/nodejs/node/pull/20876) и [официальной технической документацией](https://nodejs.org/api/worker_threads.html) в что-то боле практическое и простое для создания примеров. Надеюсь, этого будет достаточно, чтобы вы начали.   

## Что нужно, чтобы начать использовать новый модуль для потоков?

Для начала, вам потребуется модуль с именем "worker_threads".

Это будет работать только если вы используете флаг `--experimental-worker`, когда вызываете скрипт. Иначе модуль не будет найден.

Обратите внимание, что флаг ссылается на *workers*, а не *threads*. Таким образом они буду ссылаться на всю документацию: *worker threads* или просто *workers*.


Если в прошлом вы работали с многопроцессорную обработку в прошлом, вы увидите много похожего с этим подходом, но если нет, то не волнуйтесь. Я постараюсь максимально просто это объяснить.

## Что вы можете сделать с помощью потоков?

Рабочие потоки предназначены, как я уже упоминал ранее, для задач, интенсивно использующих процессор, их использование для I/O было бы пустой тратой ресурсов, поскольку, согласно официальной документации внутренний механизм, предоставляемый Node для обработки асинхронного I/O, гораздо более эффективен использования отдельного потока для этого, так что не беспокойтесь.

Давайте начнём с примера, как вы будете создавать woker и использовать его.

### Пример 1:

```js
const { Worker, isMainThread,  workerData } = require('worker_threads');

let currentVal = 0;
let intervals = [100,1000, 500]

function counter(id, i){
	console.log("[", id, "]", i)
	return i;
}

if(isMainThread) {
	console.log("this is the main thread")
	for(let i = 0; i < 2; i++) {
		let w = new Worker(__filename, {workerData: i});
	}

	setInterval((a) => currentVal = counter(a,currentVal + 1), intervals[2], "MainThread");
} else {

	console.log("this isn't")

	setInterval((a) => currentVal = counter(a,currentVal + 1), intervals[workerData], workerData);

}
```

Приведенный выше пример просто выведет набор строк, показывающих увеличивающиеся счетчики, которые будут увеличивать свои значения, на разных скоростях скорости.

![Example 1](/image/threads-in-node-10-5-0-a-practical-intro/expl1.png)

Давайте разберемся с этим:

 1. Код внутри оператора IF создает 2 рабочих потока, код для которых взят из одного и того же файла, с помощью переданного параметра __filename. Workers нужен полный путь к файлам, они не могут обрабатывать относительные пути.
 2. 2 потока отправляют значение в качестве глобального параметра в форме атрибута `workerData`, который вы видите как часть второго аргумента. Затем к этому значению можно получить доступ через константу с тем же именем (посмотрите, как константа создается в первой строке файла и используется позже в последней строке).

Этот пример - одна из самых простых вещей, которые вы можете сделать. Давайте посмотрим на другой пример.

### Пример 2: Делаем хоть что-то

Давайте сейчас попробуем выполнить некоторые "тяжелые" вычисления, одновременно выполняя некоторые асинхронные операции в основном потоке.

```js
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const request = require("request");


if(isMainThread) {
	console.log("This is the main thread")

	let w = new Worker(__filename, {workerData: null});
	w.on('message', (msg) => { //A message from the worker!
		console.log("First value is: ", msg.val);
		console.log("Took: ", (msg.timeDiff / 1000), " seconds");
	})
	w.on('error', console.error);
	w.on('exit', (code) => {
		if(code != 0)
	      	console.error(new Error(`Worker stopped with exit code ${code}`))
   });

	request.get('http://www.google.com', (err, resp) => {
		if(err) {
			return console.error(err);
		}
		console.log("Total bytes received: ", resp.body.length);
	})

} else { //the worker's code

	function random(min, max) {
		return Math.random() * (max - min) + min
	}

	const sorter = require("./test2-worker");

	const start = Date.now()
	let bigList = Array(1000000).fill().map( (_) => random(1,10000))

	sorter.sort(bigList);
	parentPort.postMessage({ val: sorter.firstValue, timeDiff: Date.now() - start});

}
```

На этот раз мы запрашиваем домашнюю страницу для Google.com и одновременно сортируем случайно сгенерированный массив из 1 миллиона номеров. Это займет несколько секунд, поэтому для нас идеально и мы сможет проверить, как работает Node.js с потоками. Мы также собираемся измерить время, необходимое рабочему потоку для выполнения сортировки, и мы собираемся отправить это значение (вместе с первым отсортированным значением) в основной поток, где мы отобразим результаты.

![Example 2](/image/threads-in-node-10-5-0-a-practical-intro/expl2.png)

Основной идеей этого примера является связь между потоками.

Потоки могут получать сообщения в основном потоке с помощью метода `on`. События, которые мы можем слушать, показаны в коде. Событие `message` запускается всякий раз, когда мы отправляем сообщение из другого потока, используя метод `parentPort.postMessage`. Вы также можете отправить сообщение в код потока, используя тот же метод, на своем рабочем экземпляре и перехватить их с помощью `parentPort`.

Если вам интересно, код для вспомогательного модуля, который я использовал, находится [здесь](https://gist.github.com/deleteman/9081c04c62294aed40e9b3abd9e8934d), хотя в этом нет ничего заслуживающего внимания.

Давайте теперь рассмотрим очень похожий пример, но с более чистым кодом, который даст вам окончательное представление о том, как вы могли бы структурировать код вашего проекта.

### Пример 3: Связываем все воедино

В качестве последнего примера я собираюсь придерживаться той же функциональности, но покажу вам, как вы можете немного ее улучшить и получить более поддерживаемую версию.

```js
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const request = require("request");

function startWorker(path, cb) {
	let w = new Worker(path, {workerData: null});
	w.on('message', (msg) => {
		cb(null, msg)
	})
	w.on('error', cb);
	w.on('exit', (code) => {
		if(code != 0)
	      	console.error(new Error(`Worker stopped with exit code ${code}`))
   });
	return w;
}

console.log("this is the main thread")

let myWorker = startWorker(__dirname + '/workerCode.js', (err, result) => {
	if(err) return console.error(err);
	console.log("[[Heavy computation function finished]]")
	console.log("First value is: ", result.val);
	console.log("Took: ", (result.timeDiff / 1000), " seconds");
})

const start = Date.now();
request.get('http://www.google.com', (err, resp) => {
	if(err) {
		return console.error(err);
	}
	console.log("Total bytes received: ", resp.body.length);
	//myWorker.postMessage({finished: true, timeDiff: Date.now() - start}) //you could send messages to your workers like this
}) 
```

И код потока может быть внутри другого файла, например:

```js
const {  parentPort } = require('worker_threads');

function random(min, max) {
	return Math.random() * (max - min) + min
}

const sorter = require("./test2-worker");

const start = Date.now()
let bigList = Array(1000000).fill().map( (_) => random(1,10000))

/**
//you can receive messages from the main thread this way:
parentPort.on('message', (msg) => {
	console.log("Main thread finished on: ", (msg.timeDiff / 1000), " seconds...");
})
*/

sorter.sort(bigList);
parentPort.postMessage({ val: sorter.firstValue, timeDiff: Date.now() - start});
```

Разберёмся, что мы видим:

1. Основной поток и рабочие потоки теперь имеют свой код в разных файлах. Это легче поддерживать и расширять
2. Функция `startWorker` возвращает новый экземпляр, позволяя вам позже отправлять ему сообщения, если вы этого хотите.
3. Вам больше не нужно беспокоиться, если код вашего основного потока на самом деле является основным потоком (мы удалили основной оператор IF).
4. В коде потока вы можете видеть, как вы получите сообщение из основного потока, что обеспечивает двустороннюю асинхронную связь.
