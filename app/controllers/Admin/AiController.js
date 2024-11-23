const helper = require("../../helpers/helper");
const aiService = require("../../services/aiService");

module.exports = {
    SendDataToAI: async (req, res) => {
        try {
            const data = req.body;
            const response = await aiService.SendDataToAI(data);

            // Send both file and data
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.setHeader('Content-Disposition', `attachment; filename="${response.docx.filename}"`);
            res.sendFile(response.docx.filepath);

        } catch (error) {
            const errorResponse = helper.errorLog(error, 'AdminController/SendDataToAI');
            res.status(400).send({ errorResponse });
        }
    }
}