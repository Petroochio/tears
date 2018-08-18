import xs from 'xstream';
import { run } from '@cycle/run';
import { makeDOMDriver } from '@cycle/dom';
import { timeDriver } from '@cycle/time';

import main from './Tears';

const drivers = {
  DOM: makeDOMDriver('#root'),
  Time: timeDriver,
};

run(main, drivers);
