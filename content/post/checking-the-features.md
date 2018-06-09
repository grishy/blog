+++
categories = ["Без категории"]
date = "2017-05-10T16:19:02+03:00"

excerpt = "Отдельная страница для проверка работоспособности блога. Всех встречаемых в нём элементов поста. В данном случае Markdown'a"

image = "checking-the-features/cover.png"
tags = []
thumbnail = "checking-the-features/thumbnail.png"
title = "Страница проверки сайта - Markdown"
+++

{{% toc %}}
<!-- TOC -->

- [Краткое руководство](#краткое-руководство)
    - [Заголовок первого уровня](#заголовок-первого-уровня)
        - [Заголовок h2](#заголовок-h2)
            - [Заголовок h3](#заголовок-h3)
                - [Заголовок h4](#заголовок-h4)
                    - [Заголовок h5](#заголовок-h5)
                        - [Заголовок h6](#заголовок-h6)
    - [Списки](#списки)
    - [Цитаты](#цитаты)
    - [Инлайн код](#инлайн-код)
    - [Горизонтальная черта](#горизонтальная-черта)
    - [Сноски](#сноски)
    - [Ссылки](#ссылки)
    - [Emphasis](#emphasis)
    - [Зачеркивание](#зачеркивание)
- [Картинки](#картинки)
- [Использование HTML внутри Markdown](#использование-html-внутри-markdown)
    - [Таблицы](#таблицы)
- [MathJax](#mathjax)

<!-- /TOC -->
{{% /toc %}}


На данную страницу я буду заходить, когда что-то буду менять в сайте. Надо же где-то проверять, что сломалось на этот раз.

Markdown - это легковесный язык разметки текста для веба. Был создан для удобства чтения и написания размеченных текстов. Движок markdown генерирует валидный XHTML. Авторы - *John Gruber* и *Aaron Swartz*. Официальная страница проекта и более подробная документация на сайте [ Daring Fireball](http://daringfireball.net/projects/markdown/).

## Краткое руководство

Абзацы создаются при помощи пустой строки. Если вокруг текста сверху и снизу есть пустые строки, то текст превращается в абзац.

Чтобы сделать перенос строки вместо абзаца,
нужно поставить два пробела в конце предыдущей строки.

Параграф выделяется пустой строкой снизу и сверху текста:

```markdown
<пустая строка>
Текст параграфа. Может быть
разбит на несколько строк.
<пустая строка>
```

Так же есть "умные дроби". Например, `4/5` пребразуется в 4/5.

Так же ест пребразование дефисов в короткое тире и тире:
кое-что (дефис, клавиша на клавиатуре).
2010--2012
век живи --- век учись (тире)

```markdown
кое-что (дефис, клавиша на клавиатуре).
2010--2012
век живи --- век учись (тире)
```
---
Заголовки отмечаются диезом `#` в начале строки, от одного до шести. Например:
```markdown
# Заголовок первого уровня #
## Заголовок h2
### Заголовок h3
#### Заголовок h4
##### Заголовок h5
###### Заголовок h6
```

# Заголовок первого уровня #
## Заголовок h2
### Заголовок h3
#### Заголовок h4
##### Заголовок h5
###### Заголовок h6

В декоративных целях заголовки можно «закрывать» с обратной стороны. Так же для первого второго типа есть альтернативный вариант
```markdown
Заголовок первого уровня
========================
Заголовок второго уровня
------------------------
```

### Списки

Для разметки неупорядоченных списков можно использовать или `*`, или `-`, или `+`:

```markdown
- элемент 1
- элемент 2
- элемент ...
```

- элемент 1
- элемент 2
- элемент ...

Вложенные пункты создаются четырьмя пробелами перед маркером пункта:
```markdown
* элемент 1
* элемент 2
    * вложенный элемент 2.1
    * вложенный элемент 2.2
* элемент ...
```

* элемент 1
* элемент 2
    * вложенный элемент 2.1
    * вложенный элемент 2.2
* элемент ...

Упорядоченный список:
```markdown
1. элемент 1
2. элемент 2
    1. вложенный
    2. вложенный
3. элемент 3
4. Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse id sem consectetuer libero luctus adipiscing.
```
1. элемент 1
2. элемент 2
    1. вложенный
    2. вложенный
3. элемент 3
4. Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse id sem consectetuer libero luctus adipiscing.

На самом деле не важно как в коде пронумерованы пункты, главное, чтобы перед элементом списка стояла цифра (любая) с точкой. Можно сделать и так:
```markdown
0. элемент 1
0. элемент 2
0. элемент 3
0. элемент 4
```
0. элемент 1
0. элемент 2
0. элемент 3
0. элемент 4

Список с абзацами:
```markdown
* Раз абзац. Lorem ipsum dolor sit amet, consectetur adipisicing elit.

* Два абзац. Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse id sem consectetuer libero luctus adipiscing.

* Три абзац. Ea, quis, alias nobis porro quos laborum minus sed fuga odio dolore natus quas cum enim necessitatibus magni provident non saepe sequi?

    Четыре абзац (Четыре пробела в начале или один tab).
```
* Раз абзац. Lorem ipsum dolor sit amet, consectetur adipisicing elit.

* Два абзац. Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse id sem consectetuer libero luctus adipiscing.

* Три абзац. Ea, quis, alias nobis porro quos laborum minus sed fuga odio dolore natus quas cum enim necessitatibus magni provident non saepe sequi?

    Четыре абзац (Четыре пробела в начале или один tab).

### Цитаты

Цитаты оформляются как в емейлах, с помощью символа `>`.
```markdown
> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
>
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.
```

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
>
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.

Или более ленивым способом, когда знак `>` ставится перед каждым элементом цитаты, будь то абзац, заголовок или пустая строка:
```markdown
> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
>
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
id sem consectetuer libero luctus adipiscing.
```

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
>
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
id sem consectetuer libero luctus adipiscing.

В цитаты можно помещать всё что угодно, в том числе вложенные цитаты:
```markdown
> ## This is a header.
>
> 1.   This is the first list item.
> 2.   This is the second list item.
>
> > Вложенная цитата.
>
> Here's some example code:
>
>     return shell_exec("echo $input | $markdown_script");
```
> ## This is a header.
>
> 1.   This is the first list item.
> 2.   This is the second list item.
>
> > Вложенная цитата.
>
> Here's some example code:
>
>       return shell_exec("echo $input | $markdown_script");
>
В чистом Маркдауне блоки кода отбиваются 4 пробелами в начале каждой строки.

Есть более удобный способ: ставим по три апострофа (на букве Ё) до и после кода. Также можно указать язык исходного кода.
```markdown
    ```html
    <nav class="nav nav-primary">
        ...
    </nav>
    ```
```

```html
<nav class="nav nav-primary">
  <ul>
    <li class="tab-conversation active">
      <a href="#" data-role="post-count" class="publisher-nav-color" data-nav="conversation">
        <span class="comment-count">0 комментариев</span>
        <span class="comment-count-placeholder">Комментарии</span>
      </a>
    </li>
    <li class="dropdown user-menu" data-role="logout">
      <a href="#" class="dropdown-toggle" data-toggle="dropdown">
        <span class="dropdown-toggle-wrapper">
          <span>
            Войти
          </span>
        </span>
        <span class="caret"></span>
      </a>
    </li>
  </ul>
</nav>
```

Самое приятное, что в коде не нужно заменять угловые скобки `< >` и амперсанд `&` на их html-сущности.

### Инлайн код

Для вставки кода внутри предложений нужно заключать этот код в апострофы (на букве Ё). Пример: `<html class="ie no-js">`.

```markdown
`<html class="ie no-js">`
``There is a literal backtick (`) here.``
```

Если внутри кода есть апостроф, то код надо обрамить двойными апострофами: ``There is a literal backtick (`) here.`` А чтобы была и подсветка синтаксиса при таком методе, я ещё не решил надо ли и если и надо, то как лучше сделать.

### Горизонтальная черта
```markdown
***
* * *
------
```
`hr` создается тремя звездочками или тремя дефисами.

***
* * *
------

### Сноски
```markdown
Быстрая, коричневая лиса[^1], перепрыгнула через ленивого пса[^2].

[^1]: Лисицы красные
[^2]: Собаки обычно не красные :)
```
Быстрая, коричневая лиса[^1], перепрыгнула через ленивого пса[^2].

[^1]: Лисицы красные
[^2]: Собаки обычно не красные :)

Так же пример есть в разделе со ссылками
### Ссылки

Это встроенная [ссылка с title элементом](http://example.com/link "Я ссылка").
Это — [без title](http://example.com/link).
Это - короткая запись <http://example.com/link>

А вот [пример][one] [нескольких][two] [ссылок][id] с разметкой как у сносок.
Прокатит и [короткая запись][] без указания id.

[one]: http://example.com/ "Опциональный заголовок"
[two]: http://example.com/some
[id]: http://example.com/links (Опциональный заголовок)
[короткая запись]: http://example.com/short
```markdown
А вот [пример][one] [нескольких][two] [ссылок][id] с разметкой как у сносок.
Прокатит и [короткая запись][] без указания id.

> [one]: http://example.com/ "Опциональный заголовок"
> [two]: http://example.com/some
> [id]: http://example.com/links (Опциональный заголовок)
> [короткая запись]: http://example.com/short
```

Вынос длинных урлов из предложения способствует сохранению читабельности исходника. Сноски можно располагать в любом месте документа.

### Emphasis

Выделять слова можно при помощи `*` и `_`. Одним символ для наклонного текста, два символа для жирного текста, три — для наклонного и жирного одновременно.

Например, это _italic_ и это тоже *italic*.
А вот так уже __strong__, и так тоже **strong**.
А так ***жирный и наклонный*** одновременно.
Пример экранирования -  \*\*очень выделенный\*\* текст

```markdown
Например, это _italic_ и это тоже *italic*.
А вот так уже __strong__, и так тоже **strong**.
А так ***жирный и наклонный*** одновременно.
Пример экранирования -  \*\*очень выделенный\*\* текст
```
### Зачеркивание

В Hugo добавлено зачеркивание текста: две тильды `~` до и после текста.
```markdown
~~Зачеркнуто~~
```
~~Зачеркнуто~~

## Картинки

Картинка без `alt` текста

![](//placehold.it/150x100)

Картинка с альтом и тайтлом:

![Alt text](//placehold.it/150x100 "Можно задать title")

```markdown
![](//placehold.it/150x100)
![Alt text](//placehold.it/150x100 "Можно задать title")
```

Запомнить просто: синтаксис как у ссылок, только перед открывающей квадратной скобкой ставится восклицательный знак.

Картинки «сноски»:

![Картинка][image1]
![Картинка][image2]
![Картинка][image3]

[image1]: //placehold.it/250x100
[image2]: //placehold.it/200x100
[image3]: //placehold.it/150x100

Картинки-ссылки:

[![Alt text](//placehold.it/150x100)](http://example.com/)

```markdown
![Картинка][image1]
![Картинка][image2]
![Картинка][image3]

[image1]: //placehold.it/250x100
[image2]: //placehold.it/200x100
[image3]: //placehold.it/150x100

//Картинка-ссылка
[![Alt text](//placehold.it/150x100)](http://example.com/)
```


## Использование HTML внутри Markdown

Mожно смешивать Markdown и HTML. Если на какие-то элементы нужно поставить классы или атрибуты, смело используем HTML:
```markdown
Выделять слова можно при помощи * и _ .
Например, это <em class="a1">italic</em> и это тоже <i class="a1">italic</i>.
А вот так уже <b>strong</b>, и так тоже <strong>strong</strong>.
```
Можно и наоборот, внутри HTML-тегов использовать Маркдаун.
```html
<section class="someclass">

### Пример Маркдауна внутри HTML
Выделять слова можно при помощи `*` и `_` .
Например, это _italic_ и это тоже *italic*.
А вот так уже __strong__, и так тоже **strong**.

</section>
```

### Таблицы

В чистом Маркдауне нет синтаксиса для таблиц, а в Hugo есть.

First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell

```markdown
First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell

```

Для красоты можно и по бокам линии нарисовать:

| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |

```markdown
| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |
```

Можно управлять выравниванием столбцов при помощи двоеточия.

| Left-Aligned  | Center Aligned  | Right Aligned |
|:------------- |:---------------:| -------------:|
| col 3 is      | some wordy text |     **$1600** |
| col 2 is      | centered        |         $12   |
| zebra stripes | are neat        |        ~~$1~~ |

```markdown
| Left-Aligned  | Center Aligned  | Right Aligned |
|:------------- |:---------------:| -------------:|
| col 3 is      | some wordy text |     **$1600** |
| col 2 is      | centered        |         $12   |
| zebra stripes | are neat        |        ~~$1~~ |
```


Внутри таблиц можно использовать ссылки, наклонный, жирный или зачеркнутый текст. Рисовать их можно в любом онлайн редакторе

- [ ] a task list item
- [x] list syntax required
- [x] incomplete
- [x] completed

Для всего остального есть обычный HTML и MathJax.

## MathJax

{{< tex >}}E = mc^2{{< /tex >}}

{{< tex >}}E = mc^2{{< /tex >}}

{{< tex >}}b + y = \sqrt{f} = \sum_n^5 {x}{{< /tex >}}

Here's sum inline math:.
Display mode math looks like:
{{< tex >}}E = mc^2{{< /tex >}}
**Убрать пробелы возле `< >`**
