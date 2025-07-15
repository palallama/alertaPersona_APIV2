import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
  // constructor(private reflector: Reflector) {
  //   super();
  // }

  // canActivate(context: ExecutionContext) {
  //   const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
  //     context.getHandler(), // Verifica el método (ej. @Post('login'))
  //     context.getClass(),   // Verifica la clase (ej. @Controller)
  //   ]);

  //   if (isPublic) {
  //     return true; // Permite acceso sin JWT
  //   }

  //   return super.canActivate(context); // Exige JWT
  // }
}


// export class AuthGuard implements CanActivate {
//   constructor(private jwtService: JwtService) {}
//   logger = new Logger('AuthGuard');

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const token = this.extractTokenFromHeader(request);

//     if (!token) {
//       this.logger.log('No token provided');
//       throw new UnauthorizedException();
//     }
    
//     try {
//       const payload = await this.jwtService.verifyAsync(
//         token,
//         {
//           secret: jwtConstants.secret
//         }
//       );
//       this.logger.log(payload);
//       request['user'] = payload;
//     } catch (error) {
//       this.logger.log(error);
//       throw new UnauthorizedException();
//     }
//     return true;
//   }

//   private extractTokenFromHeader(request: Request): string | undefined {
//     const [type, token] = request.headers.authorization?.split(' ') ?? [];
//     return type === 'Bearer' ? token : undefined;
//   }
// }
