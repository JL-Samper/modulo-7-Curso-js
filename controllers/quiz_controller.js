var models = require('../models/models.js');
//autoload - factoriza el código si ruta incluye :quizId
exports.load = function (req,res,next,quizId) {
    models.Quiz.find(quizId).then(
        function(quiz) {
            if(quiz) {
                req.quiz = quiz;
                next();
            } else {
                new Error('No existe quizId = '+ quizId)}
        }
        ).catch (function(error) {next(error);});
};


//GET quizes 
exports.index = function (req,res) {
    // get the parameter and choose if the table has to be filtered or not
    // we are looking for a word or a cluster of words so we have to deal with spaces, colons ... that could appear in the whole
    // question. This can be done by %word1%word2%
    var busqueda = req.query.search;
    if(!busqueda) {
        models.Quiz.findAll().then(function(quizes) {
            res.render('quizes/index', {quizes: quizes});
        })
    } else {
        models.Quiz.findAll({where: ["pregunta like ?", ("%" + busqueda + "%").replace(' ', '%')]}).then(function(quizes) {
            res.render('quizes/index', {quizes: quizes});
        })
    }
};
// GET /quizes/show

exports.show = function (req,res) {
	models.Quiz.find(req.params.quizId).then(function(quiz)     {
		res.render('quizes/show', {quiz: req.quiz});
	})
};

// GET /quizes/answer

exports.answer = function(req,res) { 
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		if (req.query.respuesta === quiz.respuesta) {
			res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto'});
		} else {
			res.render('quizes/answer', { quiz: req.quiz, respuesta: 'Incorrecto'});
		}
	})
};
