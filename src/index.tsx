import ReactDOM from 'react-dom';
import React from 'react';

import App from './components/App';

ReactDOM.render(<App />, document.querySelector('#root'));

if (module && module.hot) {
  module.hot.accept();

  module.hot.addStatusHandler(status => {
    if (status === 'prepare') console.clear();
  });
}
