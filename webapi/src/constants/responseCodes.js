const responseCodes = {
    ok: {
        code: 200,
        message: "Request successful."
    },
    created: {
        code: 201,
        message: "Request successful. Resource created."
    },
    badRequest: {
        code: 400,
        message: "Bad Request."
    },
    unauthorized: {
        code: 401,
        message: "Not authorized."
    },
    forbidden: {
        code: 403,
        message: "Forbidden"
    },
    notFound: {
        code: 404,
        message: "Resource not found."
    },
    methodNotAllowed: {
        code: 405,
        message: "Not allowed."
    },
}

module.exports = responseCodes;