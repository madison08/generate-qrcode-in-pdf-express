 var express = require('express');
 const { PDFDocument, StandardFonts } = require('pdf-lib');
const QRCode = require('qrcode');
const fs = require('fs/promises'); 
var app = express();

app.get('/generate-qr', async(req, res) => {

    const existingFilePath = './pdf/empty_pdf.pdf';
    const qrCodeData = "Attobra madison amoa";
    const outputFilePath = './pdf/output.pdf'

    const existingPDFBytes = await fs.readFile(existingFilePath);

    const pdfDoc = await PDFDocument.load(existingPDFBytes);

    const qrCodeImageBytes = await QRCode.toBuffer(qrCodeData, {width: 200});
    const qrCodeImage = await pdfDoc.embedPng(qrCodeImageBytes);

    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();

    const qrCodeImageDims = qrCodeImage.scale(0.5);

    page.drawImage(qrCodeImage, {
        x: 105,//width / 2 - qrCodeImageDims.width / 2,
        y: 490,//height / 2 - qrCodeImageDims.height / 2,
        width: qrCodeImageDims.width,
        height: qrCodeImageDims.height,
    });

    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputFilePath, pdfBytes);

    res.send('generated ✅');
});

app.listen('3000', () => {
    console.log("App running 3000")
})