/**
 * @fileoverview Modulos para eventos de CLase
 * @author Pedro Nequiz
 * @version 1.0
 * @date 2023-10-01
 * @description Este archivo contiene la clase objAppSindicatos que maneja el almacenamiento y recuperación de datos en sessionStorage.
 * ============== Documentacion ===================
/** ===========================
📌 EJEMPLOS DE USO
=========================== */
/*
  Crear instancia const objApp = new objAppClass();
  Guardar datos objApp.set('Nombre', 'Pedro');

  // Arrays
  Obtener datos con get console.log(objApp.get('token'));
  Agregar a un array objApp.addToArray('ListaUsuarios', { id: 1, nombre: 'Ana' }); objApp.addToArray('ListaUsuarios', { id: 2, nombre: 'Luis' });
  Eliminar del array objApp.removeFromArray('ListaUsuarios', 'id', 1);

  // Lowers
  Usar setLower objApp.setLower('Token', 'ABC123');
  Acceso a array en minúscula objApp.addToArrayLower('SesionesActivas', { user: 'admin' }); console.log(objApp.getArrayLower('sesionesactivas'));

  // Console
  Verificar existencia console.log(objApp.has('Nombre')); // true
  Obtener datos console.log(objApp.get('Nombre'));
  Obtener todas las claves console.log(objApp.keys()); // ["Nombre", "token", "ListaUsuarios", "sesionesactivas"]

  Limpiar todo objApp.clear();   // Elimina todos los datos de sessionStorage
*/
export class objAppClass {
  constructor(initialData = {}) {
    this.set(initialData);
  }

  set(key, value = null) {
    if (typeof key === 'object' && key !== null) {
      Object.entries(key).forEach(([k, v]) => {
        sessionStorage.setItem(k, JSON.stringify(v));
      });
    } else {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  }

  // 🔹 Establecer claves en minúsculas (incluye arrays)
  setLower(key, value = null) {
    if (typeof key === 'object' && key !== null) {
      Object.entries(key).forEach(([k, v]) => {
        sessionStorage.setItem(k.toLowerCase(), JSON.stringify(v));
      });
    } else {
      sessionStorage.setItem(key.toLowerCase(), JSON.stringify(value));
    }
  }

  get(key) {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  remove(key) {
    sessionStorage.removeItem(key);
  }

  clear() {
    sessionStorage.clear();
  }

  getAll() {
    const all = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      all[key] = this.get(key);
    }
    return all;
  }

  // 🔹 Helpers de arrays
  getArray(arrayName) {
    return this.get(arrayName) || [];
  }

  addToArray(arrayName, item) {
    const array = this.getArray(arrayName);
    array.push(item);
    this.set(arrayName, array);
  }

  removeFromArray(arrayName, key, value) {
    const array = this.getArray(arrayName);
    const newArray = array.filter(item => item[key] !== value);
    this.set(arrayName, newArray);
  }

  // 🔹 Helpers de arrays en minúsculas
  getArrayLower(arrayName) {
    return this.get(arrayName.toLowerCase()) || [];
  }

  addToArrayLower(arrayName, item) {
    const array = this.getArrayLower(arrayName);
    array.push(item);
    this.setLower(arrayName, array);
  }

  removeFromArrayLower(arrayName, key, value) {
    const array = this.getArrayLower(arrayName);
    const newArray = array.filter(item => item[key] !== value);
    this.setLower(arrayName, newArray);
  }

  has(key) {
    return sessionStorage.getItem(key) !== null;
  }

  keys() {
    const keys = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      keys.push(sessionStorage.key(i));
    }
    return keys;
  }
}
