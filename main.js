// Puedes usar importaciones dinámicas si usas bundlers como Vite o Webpack
import moment from 'moment';
import { DateTime } from '@formkit/tempo';

console.log('Fecha actual (moment):', moment().format('YYYY-MM-DD'));
console.log('Fecha actual (tempo):', DateTime.now().toString());

$(document).ready(function () {
  $('#tablaDemo').DataTable();
});
