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

    await page.click('#agree_button')
    await page.click('#user_id')
    await page.keyboard.type(login)
    await page.click('#password')
    await page.keyboard.type(senha)
    await page.click('#entry-login')



    // Ir para a página 
    await page.goto('https://iesb.blackboard.com/ultra/courses/_540990_1/outline', {
        waitUntil: 'load',
        timeout: 0,
    });
    
    await page.waitFor(10000)
    await page.click('#sessions-list-dropdown', { waitUntil: 'domcontentloaded' })
    const popup = await page.click('#sessions-list', { waitUntil: 'domcontentloaded' })

    

    //  Página na sala de aula.
    await page.setViewport({
      width: 1920,
      height: 1080
    });
    
    await page.on('popup', async popup => {

        await popup.setViewport({
            width: 1920,
            height: 1080
        });

        await popup.waitFor(20000)
        await popup.click('button[class*="confirm"]')
        await popup.waitFor(5000)
        await popup.click('#techcheck-video-ok-button')
        await popup.waitFor(10000)
        await popup.click('button[class*="later-tutorial-button"]')
        await popup.waitFor(3000)
        await popup.click('#tutorial-dialog-tutorials-menu-learn-about-tutorials-menu-close')
    })

}

start()