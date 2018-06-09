+++
title = "Трёхмерные планеты из точек"
date = 2017-08-17T15:04:49+03:00

tags = [ "HTML5", "JS", "простое", "canvas" , "освещение"]
categories = [ "Математика" ]

# 1920x800
image = "3d-shading-with-points/cover.jpg"
# 740x300
thumbnail = "3d-shading-with-points/thumbnail.jpg"

excerpt = ""

[translate]
    # 40x40
    avatar = "3d-shading-with-points/avatar.jpg"
    name = "Jason Brown"
    url = "http://www.somethinghitme.com/2013/08/16/3d-shading-with-points/"
+++
Я недавно пересматривал старые книги на днях. В книге _Commodore Step by Step Graphics Vol 3_ я наткнулся на интересно выглядящий скриншот с небольшим по размеру кодом. На нём была показана затенённая сфера полностью сделанная из точек.
<!--more-->

Я подумал, что это будет выглядеть круто, если нарисовать их поверх другу друга, чтобы они выглядели как планеты и луны. Поэтому я перевёл Basic код в JavaScript и использовал canvas для воспроизведения эффекта.  

Вот как выглядит результат:  
![](/image/3d-shading-with-points/result.jpg)

И так, как достичь подобного эффекта. Вот функция для создания готовых планет:
```js
function drawPlanet(rad, xc, yc, color) {
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(xc, yc, rad, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
    var x1 = parseInt(Math.sqrt(rad * rad - y * y));
    for (var x = -x1; x < x1; x++) {
        var n = parseInt(Math.random() * x1) / 1.5;

        if (n > x1 + x) {
            ctx.fillRect(x + xc, y + yc, 1, 1);
        }

    }
}
```

Функция `drawPlaten` получает четыре параметра: 

* Радиус 
* Цвет планеты (RGB по каналам),
* Координат центра -- **x**
* Координат центра -- **y**

```js
ctx.beginPath();
ctx.arc(xc, yc, rad, 0, Math.PI * 2);
ctx.fill();
ctx.closePath();
```
В начале мы рисуем сплошной круг для достижения правильного эффекта перекрытия, в противном случае планеты неправильно перекрывали друг друга. Можете посмотреть на скриншот выше и представить, что точки красной планеты были на жёлтой справа.

Цикле от минус радианы до радианы - это место где и происходит вся магия. На каждой итерации цикла, когда мы идём по кругу, мы вычисляем как далеко строка от центра в _x_ и _y_ до края круга.

У нас есть две точки: радиус (центральная точка) и Y. Таким образом, используя теорему Пифагора ({{< tex >}}a^2 + b^2 = c^2{{< /tex >}}). Мы знаем _a_, _c_ и можем найти _b_.
![](/image/3d-shading-with-points/radfig1.jpg)
[Посмотреть на код, как это работает.](http://jsfiddle.net/loktar/yJhLu/)

Мы имеем точку, которая находится на краях круга, от _(radius, radius+y)_. Сейчас мы можем проитерироваться от `-x` до `x` и получить каждый пиксель между краями круга, на этом строки.

Теперь, когда у нас есть ширина строки, на которой мы находимся, мы можем перебрать каждый пиксель. Следующий шаг, определить какие пиксели надо отросовать, а какие нет. Это делается дальше по коду функции `drawPlanet`.

```js
for (var x = -x1; x < x1; x++) {
    var n = parseInt(Math.random() * x1) / 1.5;
    if (n > x1 + x) {
        ctx.fillRect(x + xc, y + yc, 1, 1);
    }
}
```

Переменная `n` хранит случайное значение между 0 и x1. Чтобы определить нужно ли нам нарисовать точку, мы проверяем `n` больше `x1 + x`. Точка будет нарисована только если n **>** x +x1, что означает x преодолел барьер. Ближе к концу цикла вероятность нарисовать точку увеличивается. Если больше ничего не добавлять, получим прикольный эффект. Пиксели случайно закрашены для половины планеты.

![](/image/3d-shading-with-points/exemple.png)

На этом моменте пример из книжки закончился. Однако я хотел добавить больше сферического эффекта. Все что нам нужно - это немного разделить значение.

```js
var n = parseInt(Math.random() * x1) / 1.5;
```

Я использовал значение 1.5, что уменьшает вероятность нарисовать точку и сдвигает их больше к краю. Так как значение x1 следует за шириной круга, мы получаем крутой эффект сферического затенения.

Ниже примеры затенения, которые можно получить изменяя значение делителя.
![](/image/3d-shading-with-points/planet-phases.png)

И это все, что нам нужно. Довольно простой эффект, использующий немного математики и случайных значений.

<p data-height="385" data-theme-id="0" data-slug-hash="zEhDB" data-default-tab="result" data-user="loktar00" data-embed-version="2" data-pen-title="Planets with points" class="codepen">See the Pen <a href="https://codepen.io/loktar00/pen/zEhDB/">Planets with points</a> by Loktar (<a href="https://codepen.io/loktar00">@loktar00</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

***
<div class="right"><a class="right"style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, 'San Francisco', 'Helvetica Neue', Helvetica, Ubuntu, Roboto, Noto, 'Segoe UI', Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px;" href="https://unsplash.com/@verophotoart?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Vero Photoart">Фото: <span style="display:inline-block;padding:2px 3px;"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white;" viewBox="0 0 32 32"><title></title><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px;">Vero Photoart</span></a></div>


Новые слова:

* _entirely_ -- полностью
* _exactly_ -- в точку
* _solid_ -- сплошной, твёрдый
* _otherwise_ -- иначе, в противном случае
* _able_ -- способны, в состоянии