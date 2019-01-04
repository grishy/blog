<p>
  <h2 align="center">
    <a href="http://grishy.ru/">
      <img width="220" src='https://cdn.dribbble.com/users/60266/screenshots/1560009/gifdribbble_cc_aerolab.gif'/><br>
      <i>Grishy.ru</i>
    </a>
    - Блог о программировании и...
  </h2>
</p>

[![Build Status](https://travis-ci.org/Grishy/blog.svg?branch=master)](https://travis-ci.org/Grishy/blog)

### О "системе"

Работает на *Hugo* и потом обрабатывается node.js (v6.x.x or v8.x.x)
- Подсветка кода
- Установка красивого русскоязычного времени
- Перевод формул в SVG
- Оптимизация картинок

### Начало работы
Для деплоя нужно загрузить и `grishy.github.io`. 
Работа с сайтом происходит через скрипт в папке `script` :smile:. Надо проверить пути в `script/index.js` 
```js
const CONFIG = {
    'gh-pages': '../grishy.github.io', //Относительно папки blog
    'public': './public'
}
```
Далее загрузить пакеты
```bash
$ npm i
```

### Команды
- `blog> node script` - Запуск локальной версии без подсветки формул и т.п.
- `blog> node script gen` - Генерация сайта с обработкой, все хранится в папке **public**
- `blog> node script deploy` - Копирование файлов в **gh-pages** и обновление GitHub репозиториев (blog, grishy.github.io).

moonman@lenovo:~/projects/blog/static/image$ jpegoptim --strip-all -f --all-progressive -m 90 ./**/*


### Разработка

Для разработки шаблона для блога в `themes/grishy` установлен **gulp**. Он собирает стили, добавляет префиксы и оптимизирует. 
```bash
> themes/grishy 
$ npm install gulp-cli -g
$ npm i
```

- `gulp` - сборка и оптимизация, запуск watch.  

:anchor: [Grishy](https://github.com/Grishy)
