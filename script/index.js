const CONFIG = {
    'gh-pages': './build', //Относительно папки blog
    'public': './public'
}



const fs = require('fs-extra')
const exec = require('child_process').exec
const moment = require('moment')
const hljs = require('highlight.js')
const glob = require("glob")
const cheerio = require('cheerio')
const us_s = require('underscore.string')
const async = require("async")
const git = require('simple-git')
const mjAPI = require("mathjax-node")
const os = require("os")

const HUGO = os.platform() == "linux" ? "./script/hugo" : ".\\script\\hugo.exe"

mjAPI.start()
moment.locale('ru')

// Start
const param = process.argv[2]

if (param === "gen") {
    lo("Start!")

    lo("Deleting old publication...")
    fs.removeSync(CONFIG['public'])

    lo("Generate blog...")
    exec(`${HUGO}`, processing)
} else if (param === "deploy") {
    deploy()
} else if (param === "help") {
    lo("Command Reference")
    console.log(`blog> node script - Запуск локальной версии без подсветки формул и т.п.`)
    console.log(`blog> node script gen - Генерация сайта с обработкой, все хранится в папке public`)
    console.log(`blog> node script deploy - Копирование файлов в gh-pages и обновление GitHub репозиториев (blog, grishy.github.io).`)
    lo("Для отправки изменений нужно вначале сделать gen, а после deploy.")
} else {
    lo("Start hugo server...")
    exec(`${HUGO} server --buildDrafts`)
    lo("http://localhost:1313 - Ctrl + click to open")
}


/*
d8888b. d8888b.  .d88b.   .o88b. 
88  `8D 88  `8D .8P  Y8. d8P  Y8 
88oodD' 88oobY' 88    88 8P      
88~~~   88`8b   88    88 8b      
88      88 `88. `8b  d8' Y8b  d8 
88      88   YD  `Y88P'   `Y88P' 
*/

function processing(error, stdout, stderr) {
    if (error) {
        console.error(error.message)
        return
    }
    console.log(stdout)

    glob(CONFIG['public'] + '**/**/*.html', function (err, files) {
        if (err) console.error(err)

        files.forEach((item) => {
            var html = fs.readFileSync(item, 'utf8')

            var $ = cheerio.load(html, { // Переменная для всего pipeline
                // decodeEntities: false иначе "&#x417;&#x430;&#x43F;&#x43E;"
                // Вместо "Запомнить просто: синтаксис как "
                // Хотя визуально это не отображается, но в guthub будет
                // не понятно что и куда
                decodeEntities: false
            })

            async.parallel([
                (callback) => {

                    // Правильное отображение времени
                    $('.Unix-time').each((i, el) => {
                        var block = $(el)
                        var timeF = moment.unix(block.text())
                        block.text(timeF.format("DD MMMM YYYY").toUpperCase())
                    })
                    callback()

                },
                (callback) => {

                    // Подсветка кода
                    $('pre code').each((i, el) => {
                        var block = $(el)
                        var cls = block.attr('class')
                        var code = block.text()

                        if (cls == undefined) {
                            block.html(hljs.highlightAuto(code).value)
                        } else if (cls == 'language-nohighlight') {
                            // 'Есть сказали ничего не делать, не делаем :) '
                        } else {
                            // [0] - вся строка (по умолчанию в регулярках)
                            // [1] - язык
                            var lang = /(?:language-)(.*)/g.exec(cls)[1]
                            if (lang != null) {
                                var hlHTML = hljs.highlight(lang, code).value
                                block.attr('class', lang + ' hljs')
                                // < <span class="hljs-name">path</span>
                                // Одна из скобок удаляется.
                                let escHTML = us_s.escapeHTML(hlHTML)
                                block.html(escHTML)
                            }
                        }
                    })
                    callback()

                },
                (callback) => {

                    // Мат формулы
                    async.every($('span.mathjax'), function (el, cb) {
                        let block = $(el)
                        let math = block.html()

                        mjAPI.typeset({
                            math: math,
                            format: "TeX", // "inline-TeX", "MathML"
                            svg: true
                        }, function (data) {
                            block.html(data.svg)
                            cb(null, true)
                        })
                    }, () => {
                        callback()
                    });

                },
            ], function () {
                // Записываем файл назад после всех обработок
                // decodeEntities: false иначе "заменять угловые скобки &lt; &gt; и"
                // Вместо "заменять угловые скобки < > и"
                let htmlOut = $.html({
                    decodeEntities: false
                })

                // FIX cheerio
                // https://github.com/cheeriojs/cheerio/issues/1101
                // Remove in cheerio v1.0.0
                htmlOut = htmlOut.replace(`<use href="#icon-bars"`, `<use xlink:href="#icon-bars"`)

                fs.writeFile(item, htmlOut, (err) => {
                    if (err) console.error(err)
                    console.log("OK", item)
                });
            });

        });
    });

}


// d8888b. d88888b d8888b. db       .d88b.  db    db
// 88  `8D 88'     88  `8D 88      .8P  Y8. `8b  d8'
// 88   88 88ooooo 88oodD' 88      88    88  `8bd8'
// 88   88 88~~~~~ 88~~~   88      88    88    88
// 88  .8D 88.     88      88booo. `8b  d8'    88
// Y8888D' Y88888P 88      Y88888P  `Y88P'     YP

// ██████╗  ██████╗ ███╗   ██╗████████╗    ██╗   ██╗███████╗███████╗
// ██╔══██╗██╔═══██╗████╗  ██║╚══██╔══╝    ██║   ██║██╔════╝██╔════╝
// ██║  ██║██║   ██║██╔██╗ ██║   ██║       ██║   ██║███████╗█████╗  
// ██║  ██║██║   ██║██║╚██╗██║   ██║       ██║   ██║╚════██║██╔══╝  
// ██████╔╝╚██████╔╝██║ ╚████║   ██║       ╚██████╔╝███████║███████╗
// ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝   ╚═╝        ╚═════╝ ╚══════╝╚══════╝
                                                                 
function deploy() {
    const gitPublic = git(CONFIG['gh-pages'])
    const gitBlog = git("./")

    lo("Copy to the repository...")
    fs.copySync(CONFIG['public'], CONFIG['gh-pages'])

    const commitMesg = emoji() + " Обновление блога от: " + moment().format("LLL")
    lo(commitMesg)
    lo("Start git push...")

    gitBlog.add('./*')
        .commit(commitMesg)
        .push('origin', 'master', function (err) {
            if (err) console.error(err)

            lo("Blog Done!")
        });

    gitPublic.add('./*')
        .commit(commitMesg)
        .push('origin', 'master', function (err) {
            if (err) console.error(err)

            lo("GitPage Done!")
        });
}


// For fun :)
function emoji() {
    let arr = [':ghost:', ':sunglasses:', ':boom:', ':skull:', ':speech_balloon:',
        ':rage3:', ':waning_gibbous_moon:', ':tada:', ':pushpin:', ':wink:', ':hankey:'
    ]
    return arr[Math.floor(Math.random() * arr.length)]
}

function lo(msg) {
    console.log('\x1b[36m%s\x1b[0m', msg)
}
