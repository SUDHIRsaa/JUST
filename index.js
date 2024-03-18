const fs = require('fs');
const path = require('path');

const puppeteer = require('puppeteer');

const pdfOptions = {
    margin: {
        top: '0mm',
        bottom: '0mm',
        left: '0mm',
        right: '0mm',
    },
    width: '210mm',
    height: '297mm',
    format: 'A4',
    scale: 1,
    deviceScaleFactor: 1,
    landscape:false
};

const generatePDF = async (htmlFilePath, pdfFilePath) => {
    const browser = await puppeteer.launch({
        headless: "new", // Explicitly set headless mode to "new"
    });

    const page = await browser.newPage();

    await page.setViewport({
        width: parseInt(pdfOptions.width),
        height: parseInt(pdfOptions.height),
        deviceScaleFactor: pdfOptions.deviceScaleFactor,
    });

    const htmlContent = fs.readFileSync(htmlFilePath).toString();

    // Set the HTML content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // await page.emulateMediaType('screen');

    // Generate PDF
    await page.pdf({
        path: pdfFilePath,
        format: pdfOptions.format,
        margin: pdfOptions.margin,
        printBackground: true,
        scale: pdfOptions.scale,
        landscape: true,
        preferCSSPageSize: true
    });

    await browser.close();
}

(async () => {
    const pdfTemplateDir = path.join(process.cwd(), '2');
    const pdfTemplateFiles = fs.readdirSync(pdfTemplateDir).filter(file => path.extname(file).toLowerCase() === '.html').map(file => path.join(pdfTemplateDir, file));
    const generatedPDFFiles = pdfTemplateFiles.map(file => file.replace(/\.html$/, '.pdf')).map(file => file.replace('2', 'puppeteer_generated'));

    for (let i = 0; i < pdfTemplateFiles.length; i++) {
        await generatePDF(pdfTemplateFiles[i], generatedPDFFiles[i]);
    }
})();