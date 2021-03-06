const router = require('express').Router();
const Session = require('../models/session');
const Answer = require('../models/answers');


// POST /api/game/newgame
router.post("/newgame", async (req, res) => {
    const session = new Session({
        adminIp: req.ip,
        name: req.body.name,
        questions: req.body.questions,
        leaderboard: []
    });
    try {
        await session.save();
        res.send(session._id);
    } catch (error) {
        res.send(error);
    }

});

router.get("/:slug", async (req, res) => {
    const slug = req.params.slug;
    try {
        const game = await Session.findOne({ _id: slug });
        res.send(game);
    } catch (err) {
        res.status(500).send(err);
    }


})

router.post("/:slug", async (req, res) => {
    const answer = new Answer({
        game: req.body.body.game,
        name: req.body.body.name,
        answers: req.body.body.answers,
        score: req.body.body.score
    });
    try {
        await answer.save();
        const session = await Session.findOneAndUpdate({ _id: req.body.body.game }, { $push: { leaderboard: answer } }, { new: true });
        res.send(session);
    } catch (error) {
        res.send(error);
    }
})



module.exports = router;