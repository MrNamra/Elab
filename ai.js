require('dotenv').config()
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "i'm biginer new to coding, help me learn integrate gemini model to read text from txt,pdf,docx files and give me questions according to the text";

const callAi = async () => {
    const result = await model.generateContent(prompt);
    console.log("Response");
    console.log(result.response.text());
}
callAi();