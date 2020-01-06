let jwt = require('jsonwebtoken')

// Créationde la classe MiddleWare (cf: Orienté Objet). 
// Les Method MiddleWare se rajoute dans les methode des router (ex: router.get('/', MidWares.checkToken, async (req, res) => {...}) )
let MiddleWares = new class MiddleWare {

    // Méthode de vérification du token, fair attention au variable d'entrée 
    checkToken(req, res, next) {

        // recupération du token dans le header
        const bearerHeader = req.headers['authorization']
        if (bearerHeader) {
            
            // récupération de la partie haché après bearer
            const bearer = bearerHeader.split(' ')
            const token = bearer[1]

            // verifier si token valide recup les donnée du token dans la requete a la viraible user
            try {
                const decoded = jwt.verify(token, 'tpisitech')
                req.user = decoded

                // passer a la suite du programme
                next()
            } catch(err) {
                res.status(401).json(err)
            }
            
        } else {
            res.json(401,'Unauthorized')
        }
    }
}

module.exports = MiddleWares