const { parseMustacheTemplate } = require('../utils/moustache');

/**
 * Middleware to parse Mustache syntax for testCases came from google Apps Script.
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
*/
function parseMustacheSyntax(req, res, next) {
    try {
        const { configurations, reusables, testcases } = req.body;

        const configs = getConfigs(configurations);

        const parsedReusables = parseMustacheTemplate(reusables, configs);
        const parsedTestCases = parseMustacheTemplate(testcases, configs);

        //This is done because mustache replaces/encode '//' to &#x2F;
        //So we have to again parse/decode to '//';
        req.body.reusables = JSON.parse(decodeURIComponent(JSON.stringify(parsedReusables).replace(/&#x2F;/g, '/')));
        req.body.testcases = JSON.parse(decodeURIComponent(JSON.stringify(parsedTestCases).replace(/&#x2F;/g, '/')));

        next();
    } catch (err) {
        next(err);
    }
}

/**
 * Middleware to parse Mustache syntax for all testCases came from google Apps Script.
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
*/
function parseAllTestCasesMustacheSyntax(req, res, next) {
    try {
        const testCases = req.body;

        testCases.forEach(testCase => {
            const { configurations, reusables, testcases } = testCase;

            const configs = getConfigs(configurations);
    
            const parsedReusables = parseMustacheTemplate(reusables, configs);
            const parsedTestCases = parseMustacheTemplate(testcases, configs);
    
            //This is done because mustache replaces/encode '//' to &#x2F;
            //So we have to again parse/decode to '//';
            testCase.reusables = JSON.parse(decodeURIComponent(JSON.stringify(parsedReusables).replace(/&#x2F;/g, '/')));
            testCase.testcases = JSON.parse(decodeURIComponent(JSON.stringify(parsedTestCases).replace(/&#x2F;/g, '/')));
        });

        next();
    } catch (err) {
        next(err);
    }
}

/**
 * Map configurations to single object
 * 
 * @param {array} configurations 
 * @returns {Object}
 */
function getConfigs(configurations) {
    const configs = configurations.reduce((acc, curr)=> {
        if(curr['key']){
            acc[curr['key']] = curr.value;
        }
        
        return acc;
    }, {});

    return configs;
}

module.exports = {
    parseMustacheSyntax,
    parseAllTestCasesMustacheSyntax
};