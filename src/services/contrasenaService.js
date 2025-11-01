import bcrypt, { hash } from 'bcrypt';

const rondas = 10; // Rondas de encriptacion a utilizar un estandar es 10.



export const contrasenaEncriptada = async(contrasena) =>{
    
    return bcrypt.hash(contrasena,rondas);


}

export const ValidarContrasena = async(contrasena,hash) =>{
    return bcrypt.compare(contrasena,hash)
}


