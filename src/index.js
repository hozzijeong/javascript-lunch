import '../templates/style.css';
<<<<<<< HEAD

import App from './App';

const $app = document.getElementById('app');

new App($app);
=======
import App from './App';

const $app = document.getElementById('app');
if ($app instanceof HTMLDivElement) {
  new App($app);
}
>>>>>>> a210a190c8c8ba6ade2c3bf78d490af3006dc894
