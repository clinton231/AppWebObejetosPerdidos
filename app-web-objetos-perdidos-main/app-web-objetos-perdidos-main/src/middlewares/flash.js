
const flashMiddleware = (req, res, next) => {
    res.locals.messages = req.flash();
    next();
};

const flashHelpersMiddleware = (req, res, next) => {
    res.locals.formData = res.locals.messages?.formData ? res.locals.messages?.formData[0] : {}
    res.locals.errors = res.locals.messages?.errors ?? []
    next();
};

module.exports = {
    flashMiddleware,
    flashHelpersMiddleware,
};
