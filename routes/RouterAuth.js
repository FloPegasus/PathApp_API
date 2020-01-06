let express = require('express')
let User = require('../Models/User')
let sha256 = require('sha256')
let jwt = require('jsonwebtoken')
let router = express.Router()

// envoie un challenge au front
router.get('/', (req, res) => {

    // Mail récuperé depuis la querry (ex de querry: /auth?Email=raishu.pokeball@gmail.com)
    const mail = req.query.email

    // recuperation de la date actuelle
    const currentTimeStamp = Date.now()

    // Recherche de l'utilisateur par l'adresse mail
    User.findOne({Email:mail}, (error, result) => {
        if (error) {
            console.log(400, error)
            res.json(error)
        } else {
            if (result) {
                // le chalenge est le hachage de la concaténation de l'ID, Pasword et de la date actuelle pour qu'il soit toujours différent.
                let challenge = sha256(result._id + result.Password + currentTimeStamp)
                // envoie du challenge en front
                res.json({challenge: challenge})
            } else {
                res.json({error:"L'utilisateur "+mail+" n'existe pas"})
            }
        }
    })
})

// test du challenge et envoie du token
router.post('/', (req, res) => {

    // recuperation des donée utilisateur via email du body
    User.findOne({Email:req.body.email}, (err, result) => {
        if ( err ) {
            console.log(400, error)
            res.json(err)
        } else {

            // Recupération de l'adresse IP de l'utilisateur.
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

            // Recuperation de la date actuelle pour plus tard
            const currentTimeStamp = Date.now()

            // Recuperation de la reponse
            let client = req.body.response

            // Hachage du challenge par le back-end et sauvegarde de la reponse dans la variable server
            let server = sha256(req.body.challenge + result.Password +'isitech')

            // Comparaison de la reponse client(frontend) avec la reponse server (backend)
            if (client === server) {
                //création du token , mot secret "tpisitech", expiration: 60*60 = 1h
                let token = jwt.sign({
                    id: result._id,
                    name: result.UserName,
                    email: result.Email,
                }, "tpisitech", {expiresIn: 60*60 })

                // Recuperation des donées utilisateur
                let newConnexionUser = result

                // ajout de IP + date acuelle au donée utilisateur dans la variable LastConnection du model User
                newConnexionUser.LastConnection.push({"Ip": ip, "TimeStamp" : currentTimeStamp})

                // Modifie donnée utilisateur
                User.findOneAndUpdate({Email:result.Email}, newConnexionUser, (error, result) => {
                    //en voie du token au front
                    res.json({token,
                        userName: result.UserName,
                        userId: result._id
                    })
                })
            } else {
                res.status(401).send({error: "Unauthorized"})
            }
        }
        
    })
})

module.exports = router