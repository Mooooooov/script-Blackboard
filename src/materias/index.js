const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const { tarefa, forum } = require('../tarefas')

let tarefasProbabilidade = []
const url = "https://iesb.blackboard.com/learn/api/v1/courses/_540405_1/contents/_1365924_1/children?@view=Summary&expand=assignedGroups,selfEnrollmentGroups.group,gradebookCategory&limit=10"


async function start() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--disable-notifications', '--use-fake-ui-for-media-stream'],
        audio: true,
        video: true,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    })




    // Página de login do blackboard
    const page = await browser.newPage()
    await page.setViewport({
        width: 1920,
        height: 1080
    });


    const cookiesString = await fs.readFile('secret/cookies.json');
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);


    await page.goto('https://iesb.blackboard.com/?new_loc=%2Fultra%2Fstream', {
        waitUntil: 'load',
        timeout: 0,
    });

    const api = await browser.newPage()
    await api.setViewport({
        width: 1920,
        height: 1080
    });



    await api.goto(url)

    let content = await api.evaluate(() => JSON.parse(document.querySelector("body").innerText))


    content.results.forEach((result, index) => {
        tarefasProbabilidade.push(
            tarefa(
                index,
                result.contentDetail["resource/x-bb-asmt-test-link"].test.gradingColumn.courseId, // 
                result.title,
                result.contentDetail["resource/x-bb-asmt-test-link"].test.gradingColumn.dueDate

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