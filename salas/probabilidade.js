const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const dotenv = require('dotenv').config()


const login = process.env.MATRICULA;
const senha = process.env.SENHA;



async function start() {
    const browser = await puppeteer.launch({
        headless: false,
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

    await page.goto('https://iesb.blackboard.com/?new_loc=%2Fultra%2Fstream', {
        waitUntil: 'load',
        timeout: 0,
    });

    await page.waitFor(7000)

    await page.click('#agree_button')
    await page.waitFor(2000)
    await page.click('#user_id')
    await page.keyboard.type(login)
    await page.click('#password')
    await page.keyboard.type(senha)
    await page.click('#entry-login')



    // Ir para a página 
    await page.goto('https://iesb.blackboard.com/ultra/courses/_540405_1/outline',  {
        waitUntil: 'networkidle2',
    });
    
    await page.waitFor(7000)
 
    // Capturar os exercicios pendentes.
    await page.click('#main-content > div.first.bb-offcanvas-panel.bb-offcanvas-right.full.with-banner.hide-in-background.panel-has-focus.active.cc_540405_1 > div > div.side-panel-content > div > div > div > div.course-content-container > div > div.panel-content > div.course-tool-content > div > div.course-outline.webkit-render-issue-fix.no-create.learning-module-enabled > div:nth-child(3) > div > div.element-card-list.inventory.js-content-outline > div:nth-child(4) > div > div > div > div > div > div.js-content-div.drag-element.last > ng-switch > div > bb-folder > div > div:nth-child(1) > div > bb-content-item-base > div > div > div > div')
    await page.waitFor(9000)
    let data = await page.evaluate(() => {
        let exercicios = document.querySelectorAll('.due-date').forEach(a => a.innerText)
        
        return exercicios
    })
    
    console.log(data);
    

}

start()