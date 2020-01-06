let express = require('express')
let User = require('../Models/User.js')
let MidWares = require('../MiddleWares')
let router = express.Router()


router.get('/', MidWares.checkToken, async (req, res) => {
    await User.find({}, (error, results) => {
        if (error) {
            console.log(400, error)
            res.json(error)
        } else {
            res.json(results)
        }
    })
})

router.get('/id/:id', MidWares.checkToken, async (req, res) => {
    await User.find({"_id":req.params.id}, (error, results) => {
        if (error) {
            console.log(400, error)
            res.json(error)
        } else {
            res.json(results)
        }
    })
})

router.post('/', (req, res) => {
    let body = req.body
    const currentTimeStamp = Date.now()
    body.CreatedAt = currentTimeStamp
    if (!body.UserName || !body.Password) {
        res.json("Veuillez entrer un nom et/ou un mot de passe")
    } else {
        let newUser = new User(body)
        newUser.save((error) => {
            if (error) {
                error.custom_msg='Erreur lors de l\'enregistrement';
                res.json(error)
            } else {
                res.json(newUser)
            }
        })
    }
})

router.put('/', MidWares.checkToken, async (req, res) => {
    const currentTimeStamp = Date.now()
    req.body.UpdatedAt = currentTimeStamp
    await User.findOneAndUpdate({"_id":req.body._id},  req.body, (err, doc) => {
        res.json(err ? 'Erreur lors de l\'enregistrement' : doc)
    })
})

router.delete('/:id', async (req, res) => {
    await User.findOneAndDelete({"_id":req.params.id}, (err, doc) => {
        res.json(err ? 'Erreur lors de la supression' : doc )
    })
})

module.exports = router