import jwt from 'jsonwebtoken'

const secreto = process.env.JWT_SECRET;

if(!secreto){
    throw new Error("Ocurrio un error grave. JWT no esta correctamnete definido en el archivo .env. !REVISAR!")
}


//......... la parte de generar el token ..........//

export const generarToken = (user) => {

    const payload = {
        id: user._id,
        rol: user.rol
    }

    //.............. Ver la expiracion del token .......//

    const expiraEn = process.env.JWT_SECRET_IN || '2h';

    return jwt.sign(payload, secreto, { expiresIn: expiraEn })

}

//............... Verificar la condicion del token..............................//


export const verificarToken = (req,res,next) =>{

    const authHeader = req.headers['authorization'];
    
    const token = authHeader && authHeader.split(' ') [1];

    if (!token){
        return res.status(401).json({
            success: false,
            error: "El acceso fue rechazado. No se proporciono un token valido"
        })
    }

    //............. Ahora Verificamos el token en si..............//

    try{
        const decifrado = jwt.verify(token, secreto);
        req.user = decifrado;
        next(); // Pa que no quede clavado aca como yo en plata :( .

    } catch(error){
        if (error.name === 'TokenExpiredError'){
            return res.status(401).json({ success: false, error: 'El token ingresado esta expirado maestro' })
        }

        return res.status(401).json({ success: false, error: 'El token ingresado es invalido, mal ahi' });
    }
}


export const EsAdmin = (req,res,next) =>{
    if (req.user && req.user.rol === 'admin'){
        
        next();
    } else{
        res.status(403).json({
            success: false,
            error: "Acceso Rechazado. Vos no sos admin"
        })
    }
}