
import "dotenv"
import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../interfaces/IUsersRepository";
import {sign} from "jsonwebtoken"
import{compare} from "bcrypt"

  
  interface IResponse {
    user: {
      name: string;
    };
    token: string;
  }

@injectable()
class AuthenticateUserUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository : IUsersRepository
    ){}


    async execute(email : string , password : string){

        const user = await this.usersRepository.findByEmail(email) 

        if(!user){
            throw new Error("email or password invalid")
        }

        const passwordMatch = await compare(password , user.password);

        if(!passwordMatch){
            throw new Error("email or password invalid")
        }

        const token = sign({}, process.env.USER_SECRET_TOKEN, {
            subject: user.id,
            expiresIn: "1d",
          });


          const tokenReturn: IResponse = {
            token,
            user
          };
      
          return tokenReturn;
    }
}

export {AuthenticateUserUseCase}