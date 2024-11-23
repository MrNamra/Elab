const helper = require('../helpers/helper');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const SubjectData = require("../models/SubjectData");
const docx = require('docx');
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to format markdown-style text
function formatText(text) {
    // Replace markdown bold with HTML bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    // Replace newlines with HTML breaks
    text = text.replace(/\n/g, '<br>');
    // return result
    return text;
}

// Function to create DOCX from formatted text
async function createDOCX(text, title) {
    try {
        const uploadsDir = path.join(__dirname, '../../public/uploads/docx');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filename = `${Date.now()}-${title.replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
        const filepath = path.join(uploadsDir, filename);

        // Split text into paragraphs
        const paragraphs = text
            .replace(/<br>/g, '\n')
            .split('\n')
            .filter(para => para.trim() !== '');

        // Create document with proper docx imports
        const doc = new docx.Document({
            sections: [{
                properties: {},
                children: [
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: title,
                                bold: true,
                                size: 32
                            })
                        ],
                        spacing: {
                            after: 200
                        },
                        alignment: docx.AlignmentType.CENTER
                    }),
                    ...paragraphs.map(para => {
                        // Check if paragraph contains bold text
                        const parts = para.split(/<\/?b>/);
                        const runs = parts.map((part, index) => {
                            return new docx.TextRun({
                                text: part,
                                bold: index % 2 === 1, // Odd indices are bold
                                size: 24
                            });
                        });

                        return new docx.Paragraph({
                            children: runs,
                            spacing: {
                                after: 120
                            }
                        });
                    })
                ],
            }],
        });

        // Write the document to file
        const buffer = await docx.Packer.toBuffer(doc);
        fs.writeFileSync(filepath, buffer);

        return {
            filepath,
            filename
        };
    } catch (error) {
        console.error('Error creating DOCX:', error);
        throw error;
    }
}

module.exports = {
    SendDataToAI: async (data) => {
        try {
            // Validate input
            if (!data || !data.id) {
                throw new Error('Subject ID is required');
            }

            // Find the subject data
            const material = await SubjectData.findById(data.id);
            if (!material) {
                throw new Error('Subject data not found');
            }

            // Combine subject data with prompt
            const prompt = data.prompt || '';
            const fulldata = `${material.data}\n${prompt}`;

            // Process with AI
            const result = await model.generateContent(fulldata);
            let response = await result.response.text();

            // Format response text
            const formattedText = formatText(response);
            
            // Create DOCX
            const docxResult = await createDOCX(formattedText, data.title);

            return {
                success: true,
                data: formattedText,
                docx: {
                    filename: docxResult.filename,
                    path: `/uploads/docx/${docxResult.filename}`
                },
                subject: {
                    title: material.title,
                    originalContent: material.data
                }
            };
        } catch (error) {
            console.error('Error in SendDataToAI:', error);
            throw error;
        }
    },
}
