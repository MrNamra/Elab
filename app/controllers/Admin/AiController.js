const helper = require("../helpers/helper");
const aiService = require("../../services/aiService");

module.exports = {
    SendDataToAI: async (req, res) => {
        try {
            const { data } = req.body;
            const response = await aiService.SendDataToAI(data);
            res.status(200).json(response);
        } catch (error) {
            const errorResponse = helper.errorLog(error, 'AdminController/SendDataToAI');
            res.status(400).send({ errorResponse });
        }
    }
}