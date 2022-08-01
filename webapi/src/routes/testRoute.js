const { Router } = require("express");
const testController = require("../controllers/testController");
const { updateTestStatusValidator } = require("../validators/updateTestStatusValidator");
const {
    parseMustacheSyntax,
    parseAllTestCasesMustacheSyntax
} = require('../middlewares/parseMustache');

const {
    resultsValidator
} = require("../validators/resultValidator");
const {
    createTestJoiValidator,
    createTestCommandParameterTypeValidator,
    createAllTestCommandParameterTypeValidator
} = require("../validators/createTestValidator");

const router = Router();

/**
 * POST /api/v1/test
*/
router.post('/',
    parseMustacheSyntax,
    createTestJoiValidator,
    createTestCommandParameterTypeValidator,
    testController.createTests
);

/**
 * GET /api/v1/test/sheetId/:sheetId/pageId/:pageId
*/
router.get('/sheetId/:sheetId/pageId/:pageId', testController.getTest);

/**
 * POST /api/v1/test/results/all
*/
router.post('/results/all', resultsValidator, testController.getAllTest);

/**
 * POST /api/v1/test/all
*/
router.post('/all',
    parseAllTestCasesMustacheSyntax,
    createTestJoiValidator,
    createAllTestCommandParameterTypeValidator,
    testController.createAllTest
);

/**
 * PATCH /api/v1/test/sheetId/:sheetId/pageId/:pageId
*/
router.patch('/sheetId/:sheetId/pageId/:pageId', updateTestStatusValidator, testController.updateStatus);

/**
 * GET /api/v1/test/sheetId/:sheetId/pageId/:pageId
*/
router.delete('/sheetId/:sheetId/pageId/:pageId', testController.deleteTest);

module.exports = router;
