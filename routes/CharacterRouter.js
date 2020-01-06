let express = require('express')
let Character = require('../Models/Character')
let MidWares = require('../MiddleWares')
let router = express.Router()

router.get('/', MidWares.checkToken, async (req, res) => {
    await Character.find({UserID:req.user.id}, (error, results) => {
        if (error) {
            console.log(400, error)
            res.json(error)
        } else {
            res.json(results)
        }
    })
})

router.get('/id/:id', MidWares.checkToken, async (req, res) => {
    await Character.find({"_id":req.params.id, UserID:req.user.id}, (error, results) => {
        if (error) {
            console.log(400, error)
            res.json(error)
        } else {
            res.json(results)
        }
    })
})

router.post('/', MidWares.checkToken, async (req, res) => {
    let body = req.body
    const currentTimeStamp = Date.now()
    body.CreatedAt = currentTimeStamp
    let newCharacter = new Character(body)
    newCharacter.UserID = req.user.id
    await newCharacter.save((error) => {
        if (error) {
            console.log(400, error)
            res.json(error)
        } else {
            console.log('La commande à bien été ajouté')
            res.json(newCharacter)
        }
    })
})

router.put('/:id', MidWares.checkToken, async (req, res) => {
    const currentTimeStamp = Date.now()
    req.body.UpdatedAt = currentTimeStamp
    await Command.findOneAndUpdate({"_id":req.body._id, UserID:req.user.id}, req.body, (err, doc) => {
        res.json(err ? 'Erreur lors de l\'enregistrement' : doc)
    })
})

router.delete('/:id', MidWares.checkToken, async (req, res) => {
    await Command.findOneAndDelete({"_id":req.params.id, UserID:req.user.id}, (err, doc) => {
        res.json(err ? 'Erreur lors de la supression' : doc )
    })
})

module.exports = router