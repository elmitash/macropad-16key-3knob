import * as CAT from './catalog.js';
import * as WIRE from './pad-wire.js';
import * as MODEL from './pad-model.js';
import * as DRIVER from './pad-driver.js';

window.CAT = CAT;
window.WIRE = WIRE;
window.MODEL = MODEL;
window.PadHttp = DRIVER.PadHttp;
window.PadWebHid = DRIVER.PadWebHid;
window.PadMock = DRIVER.PadMock;
window.PadDriver = DRIVER;
