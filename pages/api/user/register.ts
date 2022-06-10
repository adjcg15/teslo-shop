import type { NextApiRequest, NextApiResponse } from 'next';

import bcrypt from 'bcryptjs';

import { db } from '../../../database';
import { User } from '../../../models';
import { jwt, validations } from '../../../utils';

type Data = 
    | { message: string }
    | { 
        token: string;
        user: {
            email: string;
            name: string;
            role: string;
        }
    }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch(req.method) {
        case 'POST':
            return registerUser(req, res);
        default:
            res.status(400).json({ message: 'Mala petición' })
    }
}

const registerUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string };
    
    if(password.length < 6) return res.status(400).json({
        message: 'La contraseña debe tener 6 caracteres como mínimo'
    });
    
    if(name.length < 2) return res.status(400).json({
        message: 'El nombre debe contener más de 2 caracteres'
    });
    
    if(!validations.isValidEmail(email)) {
        return res.status(400).json({
            message: 'El correo no tiene un formato adecuado'
        });
    }

    await db.connect();
    const user = await User.findOne({ email }).lean();
        
    if(user) {
        await db.disconnect();
        return res.status(400).json({ message: 'Usuario actualmente registrado'});
    }

    const newUser = new User({
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
        name
    });

    try {
        await newUser.save({ validateBeforeSave: true });
    } catch(e) {
        console.log(e);
        return res.status(500).json({
            message: 'Contacta con un administrador'
        });
    }
    await db.disconnect();

    const { _id } = newUser;
    const token = jwt.signToken(_id, email);

    return res.status(200).json({
        token,
        user: {
            email, 
            role: 'client', 
            name
        }
    });
}