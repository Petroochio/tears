import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import { div, canvas } from '@cycle/dom';
import isolate from '@cycle/isolate';
import REGL from 'regl';
import mat4 from 'gl-mat4';
import { map, prop } from 'ramda';

import ReglScene from './Components/ReglScene';

import page1 from './Pages/TempPage';

function view(children$) {
  return children$.map(children => div('#current-page', children));
}

function main(sources) {
  const { DOM, Time } = sources;
  const frame$ = Time.animationFrames();

  const pageDom$ = xs.of(page1.scenes)
    .map(map(sceneProps => isolate(ReglScene)({ DOM, frame$, props: sceneProps })))
    // There must be a simpler way to do this
    .map(map(prop('DOM')))
    .map(scenes => xs.combine(...scenes))
    .flatten();

  const sinks = {
    // pass the children into the view
    DOM: view(pageDom$),
  };
  return sinks;
}

export default main;
