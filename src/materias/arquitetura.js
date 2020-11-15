const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const { criaTarefa } = require('../tarefas')


const url = "https://iesb.blackboard.com/learn/api/v1/courses/_540990_1/contents/INTERACTIVE/children?@view=Summary&expand=assignedGroups,selfEnrollmentGroups.group,gradebookCategory&limit=0"
let tarefasProbabilidade = []



async function start() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--disable-notifications', '--use-fake-ui-for-media-stream'],
        audio: true,
        video: true,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    })




    // Página de API da Blackboard

    const page = await browser.newPage()
    await page.setViewport({
        width: 1920,
        height: 1080
    });


    const cookiesString = await fs.readFile('secret/cookies.json');
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);

    const api = await browser.newPage()
    await api.setViewport({
        width: 1920,
        height: 1080
    });



    await api.goto(url)
    let content = await api.evaluate(() => JSON.parse(document.querySelector("body").innerText))


    function verificaForum() {
        content.results.forEach(result => {
            if (result.genericReadOnlyData.dueDate !== null) {
                result.title
            }
        })
    }

    console.log(verificaForum());



    content.results.forEach((result, index) => {
        tarefasProbabilidade.push(
            criaTarefa(
                index,
                result.courseId, // 
                verificaForum(),
                result.genericReadOnlyData.dueDate
            )
        )
    })



    let finalText = ''
    tarefasProbabilidade.forEach(tarefa => {
        finalText += "Identificação da matéria: " + tarefa.id + "\n"
        finalText += "Matéria: " + tarefa.curseTitle + "\n"
        finalText += "Lista: " + tarefa.exercice + "\n"
        finalText += "Data de vencimento: " + tarefa.dueDate + "\n"
        finalText += "\n"
    })
    console.log(finalText)

}

start()