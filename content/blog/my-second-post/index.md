---
title: Ускоряем восстановление бэкапов в PostgreSQL
date: "2015-05-06T23:46:37.121Z"
thumbnail: ./thumbnail.jpg
---

Недавно я решил заняться ускорением восстановления нашей базы данных в dev-окружении. Как и во многих других проектах, база вначале была небольшой, но со временем значительно выросла. Старый способ проведения операции перестал нас устраивать, а вовремя подвернувшаяся в Slack-канале картинка “DB restore foos?” побудила меня к действию.

Did you know that "despite its name, salted duck eggs can also be made from
chicken eggs, though the taste and texture will be somewhat different, and the
egg yolk will be less rich."?
([Wikipedia Link](http://en.wikipedia.org/wiki/Salted_duck_egg))

Yeah, I didn't either.
