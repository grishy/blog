+++
categories = ["Computer Graphics"]
date = "2017-07-29T12:30:33+03:00"
draft = false
excerpt = "На первый взгляд кажется, что нарисовать линию на экране это самое простое, что можно вообще нарисовать. Как оказалось это не так просто и есть множество различных способов это сделать"
image = "drawing-lines-is-hard/cover.jpg"
tags = ["Shader","JavaScript", "WebGL", "3D", "line", "GLSL"]
thumbnail = "drawing-lines-is-hard/thumbnail.jpg"
title = "Рисовать линии ‐ это сложно"

[translate]
  avatar = "drawing-lines-is-hard/avatar.jpg"
  name = "Matt DesLauriers"
  url = "https://mattdesl.svbtle.com/drawing-lines-is-hard"

+++

Рисование линий может и не звучит как что-то очень сложное, но довольно сложно сделать в _OpenGL_ и особенно в _WebGL_. Ниже я рассмотрю несколько различных техник рисования 2D и 3D линий и дополню каждый из них маленьким демо.  

Все исходники вы можете найти здесь: [https://github.com/mattdesl/webgl-lines](https://github.com/mattdesl/webgl-lines)
{{% toc %}}
<!-- TOC -->

- [Простые линии](#простые-линии)
- [Триангуляция линии](#триангуляция-линии)
- [Использование вершинного шейдера](#использование-вершинного-шейдера)
- [Screen-Space Projected Lines](#screen-space-projected-lines)
- [Другие подходы](#другие-подходы)
- [Используемые модули](#используемые-модули)
- [Дополнительная литература](#дополнительная-литература)

<!-- /TOC -->
{{% /toc %}}

### Простые линии

<iframe border="0" frameborder="0" src="https://mattdesl.github.io/webgl-lines/native/index.html" height="400" width="400"></iframe>

WebGL есть поддержка линий с помощью `gl.LINES`, `gl.LINE_STRIP` и `gl.LINE_LOOP`. Звучит прекрасно, неправда ли? На самом все деле не все так хорошо, и вот несколько причин:

* Драйверы могут по разному рисовать/сглаживать линии и вы не можете получить одинаково выглядющую картинку на всех девайсах или браузерах.
* Ещё максимальная ширина линии зависит от реализации. Например люди, использующие [ANGLE](http://angleproject.org) получат максимальную ширину линии равной _1.0_, что довольно бесполезно. На моём новом ноутбуке с Yosemite  линии могут быть шириной до _~10_.
* Не возможность поменять стиль поворота линии или её конца.
* MSAA не поддерживается большинством устройств и большинство браузеров не поддерживаю это для закадрового буфера (off-screen buffers). Из-за этого у вас могут быть зубчатые линии.
* Для штрихованных/пунктирных линий `glLineStipple` или устарел или не поддерживается в WebGL.

В некоторых проектах приведённые выше ограничения не помеха и `gl.LINES` оказывается приемлемым, но в большинстве случаев это не подходит для качественного продукта.

### Триангуляция линии
<iframe border="0" frameborder="0" src="https://mattdesl.github.io/webgl-lines/triangles/index.html" height="400" width="400"></iframe>

<small>Что такое триангуляция: <a href="https://ru.wikipedia.org/wiki/%D0%A2%D1%80%D0%B8%D0%B0%D0%BD%D0%B3%D1%83%D0%BB%D1%8F%D1%86%D0%B8%D1%8F_(%D0%B3%D0%B5%D0%BE%D0%BC%D0%B5%D1%82%D1%80%D0%B8%D1%8F)">читать в  Wikipedia -></a></small>  

Обычно это решают с помощью разбиения линии на треугольники или треугольные полосы и рендерить полосы как обычную геометрию. Этот способ даёт больше контроля надо отображением линии, позволяет добавить линии "колпачок" на конце, повороты линии, их соединение и т.д. Это также позволяет рисовать линии более творчески и интересно, как например в демонстрации выше.

Для создания такого эффекта обычно получают нормаль для каждой точки вдоль пути и расширение наружу на половину толщины с обеих сторон. На пример реализации можете посмотреть в [polyline-normals](https://www.npmjs.com/package/polyline-normals). Отдельную часть линии называют митром, в демке выше они чередуются по цветам (серый/оранжевый). Как соединение митров [miter] объясняется с помощью математики можете посмотреть в [этой дискуссии](https://forum.libcinder.org/topic/smooth-thick-lines-using-geometry-shader).

Вам понадобятся более продвинутые сетки для создания "колпачков" на торце линии, скошенных соединений и т.д. Обработка этих случаев может быть довольно сложной, как можно увидеть в исходниках  [Vaser C/C++](https://github.com/tyt2y3/vaserenderer)

Для сглаживания у вас есть несколько вариантов:

* Надеяться что MSAA поддерживается и вам не когда не понадобятся рендерить линии в закадровый буфер
* Добавить больше треугольников по краям линии

<div class="centerImg">
  <img src="https://github.com/tyt2y3/vaserenderer/raw/master/docs/sample_images/fade_intro_1.png">
  <img src="https://github.com/tyt2y3/vaserenderer/raw/master/docs/sample_images/fade_intro_2.png">
  <img src="https://github.com/tyt2y3/vaserenderer/raw/master/docs/sample_images/fade_intro_3.png">
  <img src="https://github.com/tyt2y3/vaserenderer/raw/master/docs/sample_images/fade_intro_4.png">
</div>

* Использовать для линии [текстуру с градиентом](https://github.com/mattdesl/lwjgl-basics/wiki/LibGDX-Finger-Swipe#5-anti-aliasing-and-stroke-effects). Это довольно просто, но плохо масштабируется
* В фрагментном шейдере, вычислять сглаживание основанное на прогнозируемом размере линии на экране.
* Рендерить [предварительно фильтрованную gl.LINES](http://people.csail.mit.edu/ericchan/articles/prefilter/) на втором проходе, по краю вашей линии

_Примечание:_ Недостатком этого способа можно считать острые края. Когда угол соединения между двумя сегментами очень острый, длинна митра экспоненциально растёт и стремится к бесконечности, что вызывает артефакты при рендеринге. В некоторых приложениях это не проблема, в других же вы можете просто ограничить длину митры или соединить с другой митрой (т.е. скосить), когда угол слишком острый. 

В Triangles демо выше используется [extrude-polyline](https://github.com/mattdesl/extrude-polyline). Маленький модуль, который находится в разработке, для построения триангулированного меша из 2D ломаной. В итоге в него планируется добавить поддержку скруглённых соединений/окончаний и правильного ограничения митров.

### Использование вершинного шейдера

<iframe border="0" frameborder="0" src="https://mattdesl.github.io/webgl-lines/expanded/index.html" height="400" width="400"></iframe>

Триангуляция может значительно усложнить ваш код и меш нужно будет перестраивать, когда изменяется тип соединения. Если вам надо простую линию в WebGL, это может быть немного перебор.

Демка выше просто растягивает линию [stroke] в вертексном шейдере, где толщина задаётся передачей значения в uniform. Мы создаем две вершины для каждой точки нашего пути и передаем [нормали линии и длину митра](https://www.npmjs.com/package/polyline-normals) как атрибуты вершины. Каждая пара имеет одну перевёрнутую нормаль (или митра), так что две точки расталкиваются от центра, образуя толстую линию.


```glsl
attribute vec2 position;
attribute vec2 normal;
attribute float miter;
uniform mat4 projection;

void main() {
    // Передвинуть точку вдоль нормали на половину толщины
    vec2 p = position.xy + vec2(normal * thickness/2.0 * miter);
    gl_Position = projection * vec4(p, 0.0, 1.0);
}
```

Эффект внутренней линии слева (нажмите, чтобы запустить анимацию) создан в фрагментном шейдере, используя заданное расстояние от центра. Мы можем также добавить линии штрихи, градиенты, свечение и другие эффекты. Для этого нам нужно ещё раз пройти по вершинам, используя `distanceAlongPath` (расстояние от начала пути), как парамерт при вычисления.

Код реализации этого подхода может быть абстрагирован в свой собственный модуль. Для ThreeJS этот уже сделано в [three-line-2d] (https://github.com/mattdesl/three-line-2d), включая штрихованные линии.

### Screen-Space Projected Lines
Предыдущее демо работало хорошо для 2D (ортогональных) линий, но может не работать так как вы хотите в 3D пространстве. Чтобы линия была с постоянной толщиной, независимо от положения в трёхмерном пространстве, нам нужно растянуть линию после проецирования в пространство экрана.

<iframe border="0" frameborder="0" src="https://mattdesl.github.io/webgl-lines/projected/index.html" height="400" width="400"></iframe>

Как и в прошлой демке, нам нужно представить каждую точку дважды (зеркально центру), так что они направлены в разные стороны. Однако, вместо того, чтобы вычислять  нормаль и длину митра на стороне **CPU**, мы будем делать это в **вертексном шейдере**. Для этого на нужно отправить атрибуты в вершинный шейдер: `next` и `previous` позиции на всем пути.  

В вертексном шейдере, мы вычисляем наше соединение и насколько надо растянуть линию _[extrusion]_ на экране, для получения постоянной толщины. Чтобы работать в экранном пространстве, нам нужно использовать постоянную однородности _[illusive homogeneous component]_, обозначаемому как `W`. Также известной как "перспектива деления". Узнать больше на [английском кратко](https://stackoverflow.com/questions/17269686/why-do-we-need-perspective-division) и на [русском с выводом](https://triplepointfive.github.io/ogltutor/tutorials/tutorial12.html). Это даёт нам нормализованные координаты на экране [Normalized Device Coordinates], которые лежат в диапазоне `[-1, 1]`. Затем мы корректируем соотношение сторон, прежде чем что-то делать с линиями. Эту операцию мы проделываем и с `previous` и `next` позиций на протяжении всего пути.

```glsl
mat4 projViewModel = projection * view * model;

//into clip space
vec4 currentProjected = projViewModel * vec4(position, 1.0);

//into NDC space [-1 .. 1]
vec2 currentScreen = currentProjected.xy / currentProjected.w;

//correct for aspect ratio (screenWidth / screenHeight)
currentScreen.x *= aspect;
```

Так же нужно обработать крайние случаи для первой и последней точки линии, но тем не менее, обработка простого сегмента выглядит так.

```glsl
//normal of line (B - A)
vec2 dir = normalize(nextScreen - currentScreen);
vec2 normal = vec2(-dir.y, dir.x);

// раздвинуть от центра & откорректировать на соотношение сторон
normal *= thickness/2.0;
normal.x /= aspect;

//offset by the direction of this point in the pair (-1 or 1)
vec4 offset = vec4(normal * direction, 0.0, 1.0);
gl_Position = currentProjected + offset;
```

Обратите внимание, что тут нет соединения двух сегментов. Этот подход иногда предпочтительнее митра, поскольку здесь нет проблем с острыми краями. Крутящийся кружок в демке выше не использует никаких митр соединений.  

С другой стороны, форма песочных часов в демо выглядела бы скомканной и деформированной без митр соединений. Для этого, в вершинном шейдере реализовано базовое объединение митр без каких либо ограничений.

Мы могли бы внести некоторые небольшие изменения в формулу вычисления ширины линии для создания другого стиля линий. Например, используя компоненту `Z` _NDC_ для масштабирования ширины линии, когда они углубляются в сцену. Это поможет создать ощущение глубины.

### Другие подходы

Как и для многих вещей в _WebGL_, есть десятки способов нарисовать линии. Все демки были сделаны с достаточно маленькими абстракциями, поэтому вы можете все их рассмотреть и выбрать что вам подходит для вашего конкретного случая. Некоторые другие подходы, которые так-же имеют право на жизнь: 

* [Трафаретная геометрия](http://www.glprogramming.com/red/chapter14.html#name13)  
Крутой трюк работающий на трафаретном буфере для создания полигонов без использования триангуляции. Однако, этот подход вообще не работает с любым MSAA. <sup>[[1][]][[2][]][[3][]]</sup>

* [Loop-Blinn Curve Rendering](http://http.developer.nvidia.com/GPUGems3/gpugems3_ch25.html)  
Независимые от разрешения кубические сплайны рендеринга, идеально для глифов шрифта.

* [Растеризация штрихов](http://perfectionkills.com/exploring-canvas-drawing-techniques/)  
Можно использовать для создания кистей как в Photoshop.

* [Single Pass Wireframe Rendering](http://ar3f.in/wireframe.html)  
Аналогично процедурно генерируем линиям в демо, но лучше подходят для создания 3D линий в режиме wireframes. <sup>[[1](http://dl.acm.org/citation.cfm?id=1180035&dl=ACM&coll=DL&CFID=634877158&CFTOKEN=74090549)]</sup>

* [Геометрический шейдер](https://forum.libcinder.org/topic/smooth-thick-lines-using-geometry-shader)  
Это позволило бы создать линиям множество различных заглушек и соединений. Правда геометрические шейдеры не поддерживаются в WebGL.

* [Analytic Distance Fields](https://www.shadertoy.com/view/lts3Df)  
Позволяет рендерить толстые сглаженные линии как в 2D так и в 3D. Но есть свои особенности из-за использования одного поля для quad и distance. Это не очень практично, но и даёт прикольные эффекты (например [размытие в движении](https://www.shadertoy.com/view/MdB3Dw))

[1]: http://zrusin.blogspot.ca/2006/07/hardware-accelerated-polygon-rendering.html
[2]: http://phoboslab.org/log/2012/09/ejecta
[3]: https://github.com/GoodBoyDigital/pixi.js

### Используемые модули
При создании демок использовалось с десяток свободных модулей из [npmjs.com](https://www.npmjs.com/). Вот список этих модулей:

* [adaptive-bezier-curve](https://www.npmjs.com/package/adaptive-bezier-curve)
* [arc-to](https://www.npmjs.com/package/arc-to)
* [extrude-polyline](https://www.npmjs.com/package/extrude-polyline)
* [polyline-normals](https://www.npmjs.com/package/polyline-normals)
* [quad-indices](https://www.npmjs.com/package/quad-indices)
* [gl-vec3](https://www.npmjs.com/package/gl-vec3), [gl-mat4](https://www.npmjs.com/package/gl-mat4)


### Дополнительная литература

* [CesiumJS - Robust Polyline Rendering](http://cesiumjs.org/2013/04/22/Robust-Polyline-Rendering-with-WebGL/)
* [MapboxGL - Drawing Antialiased Lines in WebGL](https://www.mapbox.com/blog/drawing-antialiased-lines/)
* [NVIDIA - GPU Path Rendering](https://www.graphics.rwth-aachen.de/media/teaching_files/kilgard_2012_pathrendering.pdf)
* [Prefiltered Lines](http://bitsavers.trailing-edge.com/pdf/dec/tech_reports/WRL-98-2.pdf)

---
Написание этого поста очень затянулось, так как я не особо разбирался в теме _OpenGL_ и не знал как перевести часть терминов с сохранением их первоначального смысла. По этому я пока не буду переводить статьи по темам где не силен в терминах. Ждите статей по типу «Создание эффекта туннеля».

Так же я хочу составлять список слов, которые я часто смотрел в переводчике, в конце поста. Ведь моя главная цель это разобраться в теме и подучить английский. А лучший способ это узнать - это попробовать это объяснить другому. 

<div class='right'>gl hf</div>

<style>
.post iframe {
  width: 100%;
  max-width: none;
}

.centerImg {
  text-align: center;
}

.centerImg > img {
  max-width: 22%;
  display: inline;
}
</style>