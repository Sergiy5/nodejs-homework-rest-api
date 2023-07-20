module.exports = (fn) => (req, res, next) => {
    /**
     * Аналог асинхронного синтаксису по типу "then"
     */
    fn(req, res, next).catch((error) => next(error))
}