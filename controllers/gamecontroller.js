const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const Game = require('../models/game')(
  require('../db'),
  require('sequelize').DataTypes
);

router.get('/all', (req, res) => {
  Game.findAll({ where: { ownerId: req.user.id } }).then(
    function findSuccess(games) {
      res.status(StatusCodes.OK).json({
        games: games,
        message: 'Data fetched.',
      });
    },

    function findFail() {
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'Data not found',
      });
    }
  );
});

router.get('/:id', (req, res) => {
  Game.findOne({
    where: { id: req.params.id, ownerId: req.user.id },
  }).then(
    function findSuccess(game) {
      res.status(StatusCodes.OK).json({
        game: game,
      });
    },

    function findFail(err) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'Data not found.',
      });
    }
  );
});

router.post('/create', (req, res) => {
  Game.create({
    title: req.body.game.title,
    ownerId: req.body.user.id,
    studio: req.body.game.studio,
    esrbRating: req.body.game.esrbRating,
    userRating: req.body.game.userRating,
    havePlayed: req.body.game.havePlayed,
  }).then(
    function createSuccess(game) {
      res.status(StatusCodes.CREATED).json({
        game: game,
        message: 'Game created.',
      });
    },

    function createFail(err) {
      res.status(StatusCodes.BAD_REQUEST).send(err.message);
    }
  );
});

router.put('/update/:id', (req, res) => {
  Game.update(
    {
      title: req.body.game.title,
      studio: req.body.game.studio,
      esrbRating: req.body.game.esrbRating,
      userRating: req.body.game.userRating,
      havePlayed: req.body.game.havePlayed,
    },
    {
      where: {
        id: req.params.id,
        ownerId: req.user.id,
      },
    }
  ).then(
    function updateSuccess(game) {
      res.status(StatusCodes.OK).json({
        game: game,
        message: 'Successfully updated.',
      });
    },

    function updateFail(err) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: err.message,
      });
    }
  );
});

router.delete('/remove/:id', (req, res) => {
  Game.destroy({
    where: {
      id: req.params.id,
      ownerId: req.user.id,
    },
  }).then(
    function deleteSuccess(game) {
      res.status(StatusCodes.OK).json({
        game: game,
        message: 'Successfully deleted',
      });
    },

    function deleteFail(err) {
      res.status(StatusCodes.NOT_FOUND).json({
        error: err.message,
      });
    }
  );
});

module.exports = router;
