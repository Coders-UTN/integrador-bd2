import { Usuario } from "../models/usuario.js";
import { Carrito } from "../models/carrito.js";

import {contrasenaEncriptada,ValidarContrasena} from "../services/contrasenaService.js"

import { generarToken } from "../services/authService.js"

//...................CRUD.................//

//Post(Malone):

export const RegistrarUsuario = async(req,res,next) =>{

    try{
        
      const{nombre,apellido,email,contrasena,direccion,telefono,dni} = req.body;

      if (!nombre || !apellido || !email || !contrasena || !direccion) {
            return res.status(400).json({ success: false, error: 'Estan faltando datos necesarios...' });
        }

        const contrasenaHasheada = await contrasenaEncriptada(contrasena);
 
        const usuario = new Usuario({
            nombre,
            apellido,
            email,
            dni,
            direccion,
            telefono,
            contrasena : contrasenaHasheada
        });

        const nuevoUsuario = await usuario.save();

        const token = generarToken(nuevoUsuario);


        return res.status(201).json({success: true, data:{user: nuevoUsuario,token}})

    } catch (error){
        next(error);
    }


};

// Post (Malone) - Login: 


export const InicioSesionUsuario = async(req,res,next) =>{

    try{
        const{email,contrasena} = req.body;

        if (!contrasena || !email){
            return res.status(400).json({success: false,error: 'Estaria faltando el email o la contrasena'})
        }
    
        const usuario = await Usuario.findOne({email}).select('+contrasena')
    
        if(!usuario){
            return res.status(401).json({success: false, error: 'Las credenciales ingresadas no son validas :( '})
        }
    

        const contrasenaValida = await ValidarContrasena(contrasena,usuario.contrasena);
        
        if(!contrasenaValida){

            return res.status(401).json({success: false, error: "Las credenciales ingresadas no son validas :("})

        }

        const token = generarToken(usuario);

    
        return res.status(200).json({success: true,data:{usuario,token}});

    } catch (error){

        next(error);
    }


};


//READ 



//GET


// PA LISTARLO TO - Admin Edition.


export const ObtenerTodosLosUsuarios = async(req,res,next) =>{

    try{
        const usuarios = await Usuario.find();
        res.status(200).json({success: true,data: usuarios});
    } catch(error){
        next(error);
    }
};


// VER Usuario por su id: 


export const ObtenerUsuarioPorId = async(req,res,next) =>{
    try{
        const{id} = req.params;


        if(req.user.rol !== 'admin' && req.user.id !==id){
            return res.status(403).json({success: false,error: "No tienes permitido ver este usuario - Te falta admin"})
        }

        const usuario = await Usuario.findById(id);

        if(!usuario){
            return res.status(404).json({success: false, error: "El usuario que esta buscando por el id no fue encontrado (NT) "})

        } 

        res.status(200).json({success: true, data: usuario});

    } catch(error){
        next(error);
    }
};


//UPDATE 

// Actualizar usuario -- Admin Edition:


export const actualizarUsuario = async(req,res,next) =>{
    try{
        const{id} = req.params;

        if(req.user.rol != 'admin' && req.user.id !== id){
            return res.status(403).json({success: false,error: "No tienes los permisos necesarios para realizar esta accion - Te falta admin"});

        }

        const {nombre,apellido,direccion,telefono,dni} = req.body;

        const actualizarDatos ={nombre,apellido,direccion,telefono,dni};
        const usuarioActualizado = await Usuario.findByIdAndUpdate(id,actualizarDatos,{new: true});


        if(!usuarioActualizado){
            return res.status(404).json({success: false,error:'El usuario que esta buscando para actualizar no fue encontrado (nt)'});

        }

        res.status(200).json({success: true,data:usuarioActualizado});


    } catch (error){
        next(error);
    }
};

//DELETE -- RIP Usuario :


export const eliminarUsuario = async(req,res,next) =>{

    try{
        const {id} = req.params;

        await Carrito.findOneAndDelete({ usuario: id });
        
        const usuarioEliminado = await Usuario.findByIdAndDelete(id);

        if(!usuarioEliminado){
            return(res.status(404).json({success: false,error: "El usuario que esta intentando eliminar no fue encontrado. "}))
        }

        res.status(200).json({success: true,message: "El usuario fue eliminado con exito (Q.E.P.D) "});


    } catch (error){
        next(error);
    }

};