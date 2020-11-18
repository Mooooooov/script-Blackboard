const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const dotenv = require('dotenv').config()


const login = process.env.MATRICULA;
const senha = process.env.SENHA;


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

    await page.goto('https://iesb.blackboard.com/?new_loc=%2Fultra%2Fstream', {
        waitUntil: 'load',
        timeout: 0,
    });


    await page.waitForSelector('#agree_button')
    await page.click('#agree_button')
    await page.waitForSelector('#user_id')
    await page.click('#user_id')
    await page.keyboard.type(login)
    await page.waitForSelector('#password')
    await page.click('#password')
    await page.keyboard.type(senha)
    await page.waitForSelector('#entry-login')
    await page.click('#entry-login')


    await page.waitFor(10000)

    const cookies = await page.cookies();
    await fs.writeFile('secret/cookies.json', JSON.stringify(cookies, null, 2));

    await browser.close()
}

start()