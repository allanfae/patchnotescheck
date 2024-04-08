const puppeteer = require('puppeteer');
const { exec } = require('child_process');

async function verificarElemento() {
    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();

        setInterval(async () => {
            try {
                await page.goto('https://www.nightcrows.com/pt?wmsso_sign=check');

                await new Promise(resolve => setTimeout(resolve, 2000));

                const elemento = await page.evaluate(() => {
                    const xpath = '/html/body/div[1]/div/div[2]/div[3]/div/div[1]';
                    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    return element ? element.textContent : null;
                });

                if (elemento) {
                    const linhas = elemento.split('\n');
                    const mensagemOrganizada = linhas.join('\n\n');

                    console.log('Conteúdo do elemento:', mensagemOrganizada);
                    if (mensagemOrganizada.includes('NOTA DE PATCH')) {
                        console.log('Encontrou "NOTA DE PATCH" no elemento!');
                        exec('msg * Encontrou "NOTA DE PATCH" no elemento!');
                    } else {
                        console.log('Não encontrou "NOTA DE PATCH" no elemento.');
                    }
                } else {
                    console.log('Elemento não encontrado.');
                }
            } catch (error) {
                if (error.toString().includes('Execution context was destroyed')) {
                    console.error('Erro: Execution context was destroyed. Provavelmente devido a uma navegação.');
                } else {
                    console.error('Ocorreu um erro:', error);
                }
            }
        }, 30000);
    } catch (error) {
        console.error('Ocorreu um erro ao iniciar o navegador:', error);
        if (browser) {
            await browser.close();
        }
    }
}

verificarElemento();
