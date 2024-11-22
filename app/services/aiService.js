const helper = require('../helpers/helper');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const pdfParse = require('pdf-parse');
const textract = require('textract');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

module.exports = {
    SendDataToAI: async (data) => {
        const result = await model.generateContent(data);
        return result.response.text();
    },
    // for reading text from file
    readTextFromFile: async (filepath) =>  {
        const fileExtension = filepath.split('.').pop();
    
        try {
            if (fileExtension === "txt") {
                return fs.readFileSync(filepath, 'utf-8');
            } else if (fileExtension === "pdf") {
                const pdfBuffer = fs.readFileSync(filepath);
                const pdfData = await pdfParse(pdfBuffer);
                return pdfData.text;
            } else if (fileExtension === "docx") {
                return new Promise((resolve, reject) => {
                    textract.fromFileWithPath(filepath, (error, text) => {
                        if (error) reject(error);
                        else resolve(text);
                    });
                });
            } else {
                return "Unsupported file type";
            }
        } catch (error) {
            return `An error occurred: ${error.message}`;
        }
    }
}
