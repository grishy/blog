+++
title = "{{ replace .TranslationBaseName "-" " " | title }}"
date = {{ .Date }}
draft = true

tags = []
categories = [ "Без категории" ]

# 1920x800
image = "{{ .TranslationBaseName }}/cover.jpg"
# 740x300
thumbnail = "{{ .TranslationBaseName }}/thumbnail.jpg"

excerpt = ""

[translate]
    # 40x40
    avatar = "{{ .TranslationBaseName }}/avatar.jpg"
    name = ""
    url = ""
+++

