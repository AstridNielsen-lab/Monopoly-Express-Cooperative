import fs from 'fs';
import path from 'path';

// Base de dados temporária em memória para testes
interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  password_hash: string;
  user_type: 'user' | 'motoboy';
  created_at: string;
}

interface Motoboy {
  id: string;
  email: string;
  name: string;
  phone: string;
  cpf: string;
  cnh: string;
  vehicle_type: string;
  vehicle_plate: string;
  password_hash: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

let users: User[] = [];
let motoboys: Motoboy[] = [];

// Database mock para testes
class MockDatabase {
  prepare(query: string) {
    return {
      get: (email?: string, password?: string) => {
        if (query.includes('users')) {
          if (password) {
            return users.find(u => u.email === email && u.password_hash === password);
          }
          return users.find(u => u.email === email);
        }
        if (query.includes('motoboys')) {
          if (password) {
            return motoboys.find(m => m.email === email && m.password_hash === password);
          }
          return motoboys.find(m => m.email === email);
        }
        return null;
      },
      run: (...params: any[]) => {
        if (query.includes('INSERT INTO users')) {
          const [id, email, name, phone, password_hash] = params;
          users.push({
            id,
            email,
            name,
            phone,
            password_hash,
            user_type: 'user',
            created_at: new Date().toISOString()
          });
        }
        if (query.includes('INSERT INTO motoboys')) {
          const [id, email, name, phone, cpf, cnh, vehicle_type, vehicle_plate, password_hash] = params;
          motoboys.push({
            id,
            email,
            name,
            phone,
            cpf,
            cnh,
            vehicle_type,
            vehicle_plate,
            password_hash,
            status: 'pending',
            created_at: new Date().toISOString()
          });
        }
      }
    };
  }
}

export function getDatabase(): MockDatabase {
  return new MockDatabase();
}

