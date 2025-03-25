import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode'; 
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  
 // Метод для декодирования токена
 decodeToken(token: string): any {
  try {
    return jwtDecode(token); 
  } catch (error) {
    console.error('Ошибка при декодировании токена:', error);
    return null;
  }
}

// Получение расшифрованного токена из localStorage
getDecodedToken(): any {
  const token = localStorage.getItem('YXV0aFRva2Vu'); 
  if (!token) return null;

  const decoded = this.decodeToken(token);
  return decoded;
}

// Проверка истечения срока действия токена
isTokenExpired(): boolean {
  const decoded = this.getDecodedToken();
  if (!decoded || !decoded.exp) {
    return true; // Если нет токена или нет поля exp, считаем его недействительным
  }
  return (decoded.exp * 1000) < Date.now();
}


}
