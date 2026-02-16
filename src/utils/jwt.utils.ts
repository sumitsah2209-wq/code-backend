import jwt, { JwtPayload } from 'jsonwebtoken'
import { IJwtPayload } from '../types/global.types'
import { ENV_CONFIG } from '../config/env.config'


// '1h' '1m' , '1d'  '2 days'
// nummer 12, 345000

// sign 
export const signAccessToken = (payload:IJwtPayload) =>{
    return jwt.sign(payload,ENV_CONFIG.jwt_secret,{
        expiresIn:ENV_CONFIG.jwt_expires_in as any
    })
}


// verify
export const verifyToken  = (token:string) =>{
    type JWTPayloadReturn = IJwtPayload   & {exp:number , iat:number}
    return jwt.verify(token , ENV_CONFIG.jwt_secret)  as JWTPayloadReturn
}