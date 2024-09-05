import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { HexColorPicker } from "react-colorful";

function hslToRgb(h:number,s:number,l:number) {
  h = (isNaN(h)?0:h) / 360;
  s = (isNaN(s)?0:s) / 100;
  l = (isNaN(l)?0:l) / 100;
      
  let t1, t2, t3, rgb, val;

  if (s == 0) {
    val = l * 255;
    return [val, val, val];
  }

  if (l < 0.5)
    t2 = l * (1 + s);
  else
    t2 = l + s - l * s;
  t1 = 2 * l - t2;

  rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    t3 = h + 1 / 3 * - (i - 1);
    t3 < 0 && t3++;
    t3 > 1 && t3--;

    if (6 * t3 < 1)
      val = t1 + (t2 - t1) * 6 * t3;
    else if (2 * t3 < 1)
      val = t2;
    else if (3 * t3 < 2)
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    else
      val = t1;

    rgb[i] = Math.round(val * 255);
  }

  return rgb;
}
function rgbToHsl([r,g,b]:Array<number>) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h:number=0, s:number, l = (max + min) / 2;

  if (max === min) {
      h = s = 0; 
  } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
          case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
          case g:
              h = (b - r) / d + 2;
              break;
          case b:
              h = (r - g) / d + 4;
              break;
      }
      h /= 6;
  }
  return [Math.round(h * 360),Math.round(s * 100),Math.round(l * 100)]
}

function hexToRgb(hex: string): Array<number> {
  hex = hex.replace(/^#/, '');

  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  return [r, g, b]
}
function rgbToHex([r, g, b]: Array<number>) {

  const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase();

  return hex;
}
var cmykToRgb = function (c: number, m: number, y: number, k: number): Array<number> {

  c = (c / 100);
  m = (m / 100);
  y = (y / 100);
  k = (k / 100);


  c = c * (1 - k) + k;
  m = m * (1 - k) + k;
  y = y * (1 - k) + k;

  var r = 1 - c;
  var g = 1 - m;
  var b = 1 - y;

  r = Math.round(255 * r);
  g = Math.round(255 * g);
  b = Math.round(255 * b);

  return [r, g, b];
}
function rgbToCmyk([r, g, b]: Array<number>): Array<number> {
  const c = 1 - (r / 255);
  const m = 1 - (g / 255);
  const y = 1 - (b / 255);

  const k = Math.min(c, Math.min(m, y));


  const cmyk = {
    c: Math.round(((c - k) / (1 - k)) * 100 || 0),
    m: Math.round(((m - k) / (1 - k)) * 100 || 0),
    y: Math.round(((y - k) / (1 - k)) * 100 || 0),
    k: Math.round(k * 100)
  };

  return [cmyk.c, cmyk.m, cmyk.y, cmyk.k];
}
function App() {
  const [hex, setHex] = useState("#aabbcc");
  const [[r, g, b], setRgb] = useState(hexToRgb(hex));
  const [[c, m, y, k], setCmyk] = useState(rgbToCmyk(hexToRgb(hex)));
  const [[h,s,l],setHsl]=useState(rgbToHsl(hexToRgb(hex)));
  function setFromHex(hex: string) {
    setHex(hex);
    const [r, g, b] = hexToRgb(hex);
    setRgb(hexToRgb(hex));
    setCmyk(rgbToCmyk([r, g, b]));
    setHsl(rgbToHsl([r,g,b]));
  }
  function setFromCMYK(c: number, m: number, y: number, k: number) {
    if (isNaN(c)) c = 0;
    if (isNaN(m)) m = 0;
    if (isNaN(y)) y = 0;
    if (isNaN(k)) k = 0;

    c = Math.max(0, Math.min(100, c));
    m = Math.max(0, Math.min(100, m));
    y = Math.max(0, Math.min(100, y));
    k = Math.max(0, Math.min(100, k));

    setCmyk([c, m, y, k]);
    const [r, g, b] = cmykToRgb(c, m, y, k);
    setRgb([r, g, b]);
    setHex(rgbToHex([r, g, b]));
    setHsl(rgbToHsl([r,g,b]));
  }
  function setFromRGB(r: number, g: number, b: number) {
    if (isNaN(r)) r = 0;
    if (isNaN(g)) g = 0;
    if (isNaN(b)) b = 0;
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));


    setRgb([r, g, b]);
    const [c, m, y, k] = rgbToCmyk([r, g, b]);
    setCmyk([c, m, y, k]);
    setHex(rgbToHex([r, g, b]));
    setHsl(rgbToHsl([r,g,b]));
  }
  function setFromHsl(h:number,s:number,l:number){
    if (isNaN(h)) h = 0;
    if (isNaN(s)) s = 0;
    if (isNaN(l)) l = 0;
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    l = Math.max(0, Math.min(100, l));
    setHsl([h,s,l]);
    const [r,g,b]=hslToRgb(h,s,l);
    setRgb([r,g,b]);
    setCmyk(rgbToCmyk([r,g,b]));
    setHex(rgbToHex([r,g,b]));
  }
  return (
    <div className='wrapper' style={{ 
        backgroundColor: hex,
        color: k>50?"white":"black" 
        }}>
      <p style={{fontSize:36, fontWeight:"bold"}}>COLOR PICKER</p>
      <div className='main'>
        <HexColorPicker color={hex} onChange={setFromHex} />
        <div className="pickWrapper">
          <div className='pickType'>
            <p>RGB: </p>
            <input type='number' value={r} onChange={(e) => setFromRGB(parseInt(e.currentTarget.value), g, b)}></input>
            <input type='number' value={g} onChange={(e) => setFromRGB(r, parseInt(e.currentTarget.value), b)}></input>
            <input type='number' value={b} onChange={(e) => setFromRGB(r, g, parseInt(e.currentTarget.value))}></input>
          </div>
          <div className='pickType'>
            <p>CMYK: </p>
            <input type='number' value={c} onChange={(e) => setFromCMYK(parseInt(e.currentTarget.value), m, y, k)} ></input>
            <input type='number' value={m} onChange={(e) => setFromCMYK(c, parseInt(e.currentTarget.value), y, k)}></input>
            <input type='number' value={y} onChange={(e) => setFromCMYK(c, m, parseInt(e.currentTarget.value), k)}></input>
            <input type='number' value={k} onChange={(e) => setFromCMYK(c, m, y, parseInt(e.currentTarget.value))}></input>
          </div>
          <div className='pickType'>
            <p>HSL: </p>
            <input type='number' value={h} onChange={(e) =>{setFromHsl(parseInt(e.currentTarget.value),s,l)} } ></input>
            <input type='number' value={s} onChange={(e) =>{setFromHsl(h,parseInt(e.currentTarget.value),l)} }></input>
            <input type='number' value={l} onChange={(e) =>{setFromHsl(h,s,parseInt(e.currentTarget.value))} }></input>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
