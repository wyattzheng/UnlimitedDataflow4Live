var exp=function(){
   function g(z, t) {
    return new ar(z, t)
  }
  function ah(aA, aB) {
    var t = '';
    var z = 0;
    while (z + aB < aA.length) {
      t += aA.substring(z, z + aB) + '\n';
      z += aB
    }
    return t + aA.substring(z, aA.length)
  }
  function r(t) {
    if (t < 16) {
      return '0' + t.toString(16)
    } else {
      return t.toString(16)
    }
  }
  function af(aB, aE) {
    if (aE < aB.length + 11) {
      uv_alert('Message too long for RSA');
      return null
    }
    var aD = new Array();
    var aA = aB.length - 1;
    while (aA >= 0 && aE > 0) {
      var aC = aB.charCodeAt(aA--);
      aD[--aE] = aC
    }
    aD[--aE] = 0;
    var z = new ad();
    var t = new Array();
    while (aE > 2) {
      t[0] = 0;
      while (t[0] == 0) {
        z.nextBytes(t)
      }
      aD[--aE] = t[0]
    }
    aD[--aE] = 2;
    aD[--aE] = 0;
    return new ar(aD)
  }
  function L() {
    this.n = null;
    this.e = 0;
    this.d = null;
    this.p = null;
    this.q = null;
    this.dmp1 = null;
    this.dmq1 = null;
    this.coeff = null
  }
  function o(z, t) {
    if (z != null && t != null && z.length > 0 && t.length > 0) {
      this.n = g(z, 16);
      this.e = parseInt(t, 16)
    } else {
      uv_alert('Invalid RSA public key')
    }
  }
  function W(t) {
    return t.modPowInt(this.e, this.n)
  }
  function p(aA) {
    var t = af(aA, (this.n.bitLength() + 7) >> 3);
    if (t == null) {
      return null
    }
    var aB = this.doPublic(t);
    if (aB == null) {
      return null
    }
    var z = aB.toString(16);
    if ((z.length & 1) == 0) {
      return z
    } else {
      return '0' + z
    }
  }
  L.prototype.doPublic = W;
  L.prototype.setPublic = o;
  L.prototype.encrypt = p;
  var aw;
  var ai = 244837814094590;
  var Z = ((ai & 16777215) == 15715070);
  function ar(z, t, aA) {
    if (z != null) {
      if ('number' == typeof z) {
        this.fromNumber(z, t, aA)
      } else {
        if (t == null && 'string' != typeof z) {
          this.fromString(z, 256)
        } else {
          this.fromString(z, t)
        }
      }
    }
  }
  function h() {
    return new ar(null)
  }
  function b(aC, t, z, aB, aE, aD) {
    while (--aD >= 0) {
      var aA = t * this[aC++] + z[aB] + aE;
      aE = Math.floor(aA / 67108864);
      z[aB++] = aA & 67108863
    }
    return aE
  }
  function ay(aC, aH, aI, aB, aF, t) {
    var aE = aH & 32767,
    aG = aH >> 15;
    while (--t >= 0) {
      var aA = this[aC] & 32767;
      var aD = this[aC++] >> 15;
      var z = aG * aA + aD * aE;
      aA = aE * aA + ((z & 32767) << 15) + aI[aB] + (aF & 1073741823);
      aF = (aA >>> 30) + (z >>> 15) + aG * aD + (aF >>> 30);
      aI[aB++] = aA & 1073741823
    }
    return aF
  }
  function ax(aC, aH, aI, aB, aF, t) {
    var aE = aH & 16383,
    aG = aH >> 14;
    while (--t >= 0) {
      var aA = this[aC] & 16383;
      var aD = this[aC++] >> 14;
      var z = aG * aA + aD * aE;
      aA = aE * aA + ((z & 16383) << 14) + aI[aB] + aF;
      aF = (aA >> 28) + (z >> 14) + aG * aD;
      aI[aB++] = aA & 268435455
    }
    return aF
  }

    ar.prototype.am = ay;
    aw = 30
  ar.prototype.DB = aw;
  ar.prototype.DM = ((1 << aw) - 1);
  ar.prototype.DV = (1 << aw);
  var aa = 52;
  ar.prototype.FV = Math.pow(2, aa);
  ar.prototype.F1 = aa - aw;
  ar.prototype.F2 = 2 * aw - aa;
  var ae = '0123456789abcdefghijklmnopqrstuvwxyz';
  var ag = new Array();
  var ap,
  v;
  ap = '0'.charCodeAt(0);
  for (v = 0; v <= 9; ++v) {
    ag[ap++] = v
  }
  ap = 'a'.charCodeAt(0);
  for (v = 10; v < 36; ++v) {
    ag[ap++] = v
  }
  ap = 'A'.charCodeAt(0);
  for (v = 10; v < 36; ++v) {
    ag[ap++] = v
  }
  function az(t) {
    return ae.charAt(t)
  }
  function A(z, t) {
    var aA = ag[z.charCodeAt(t)];
    return (aA == null) ? - 1 : aA
  }
  function Y(z) {
    for (var t = this.t - 1; t >= 0; --t) {
      z[t] = this[t]
    }
    z.t = this.t;
    z.s = this.s
  }
  function n(t) {
    this.t = 1;
    this.s = (t < 0) ? - 1 : 0;
    if (t > 0) {
      this[0] = t
    } else {
      if (t < - 1) {
        this[0] = t + DV
      } else {
        this.t = 0
      }
    }
  }
  function c(t) {
    var z = h();
    z.fromInt(t);
    return z
  }
  function w(aE, z) {
    var aB;
    if (z == 16) {
      aB = 4
    } else {
      if (z == 8) {
        aB = 3
      } else {
        if (z == 256) {
          aB = 8
        } else {
          if (z == 2) {
            aB = 1
          } else {
            if (z == 32) {
              aB = 5
            } else {
              if (z == 4) {
                aB = 2
              } else {
                this.fromRadix(aE, z);
                return
              }
            }
          }
        }
      }
    }
    this.t = 0;
    this.s = 0;
    var aD = aE.length,
    aA = false,
    aC = 0;
    while (--aD >= 0) {
      var t = (aB == 8) ? aE[aD] & 255 : A(aE, aD);
      if (t < 0) {
        if (aE.charAt(aD) == '-') {
          aA = true
        }
        continue
      }
      aA = false;
      if (aC == 0) {
        this[this.t++] = t
      } else {
        if (aC + aB > this.DB) {
          this[this.t - 1] |= (t & ((1 << (this.DB - aC)) - 1)) << aC;
          this[this.t++] = (t >> (this.DB - aC))
        } else {
          this[this.t - 1] |= t << aC
        }
      }
      aC += aB;
      if (aC >= this.DB) {
        aC -= this.DB
      }
    }
    if (aB == 8 && (aE[0] & 128) != 0) {
      this.s = - 1;
      if (aC > 0) {
        this[this.t - 1] |= ((1 << (this.DB - aC)) - 1) << aC
      }
    }
    this.clamp();
    if (aA) {
      ar.ZERO.subTo(this, this)
    }
  }
  function O() {
    var t = this.s & this.DM;
    while (this.t > 0 && this[this.t - 1] == t) {
      --this.t
    }
  }
  function q(z) {
    if (this.s < 0) {
      return '-' + this.negate() .toString(z)
    }
    var aA;
    if (z == 16) {
      aA = 4
    } else {
      if (z == 8) {
        aA = 3
      } else {
        if (z == 2) {
          aA = 1
        } else {
          if (z == 32) {
            aA = 5
          } else {
            if (z == 4) {
              aA = 2
            } else {
              return this.toRadix(z)
            }
          }
        }
      }
    }
    var aC = (1 << aA) - 1,
    aF,
    t = false,
    aD = '',
    aB = this.t;
    var aE = this.DB - (aB * this.DB) % aA;
    if (aB-- > 0) {
      if (aE < this.DB && (aF = this[aB] >> aE) > 0) {
        t = true;
        aD = az(aF)
      }
      while (aB >= 0) {
        if (aE < aA) {
          aF = (this[aB] & ((1 << aE) - 1)) << (aA - aE);
          aF |= this[--aB] >> (aE += this.DB - aA)
        } else {
          aF = (this[aB] >> (aE -= aA)) & aC;
          if (aE <= 0) {
            aE += this.DB;
            --aB
          }
        }
        if (aF > 0) {
          t = true
        }
        if (t) {
          aD += az(aF)
        }
      }
    }
    return t ? aD : '0'
  }
  function R() {
    var t = h();
    ar.ZERO.subTo(this, t);
    return t
  }
  function al() {
    return (this.s < 0) ? this.negate()  : this
  }
  function G(t) {
    var aA = this.s - t.s;
    if (aA != 0) {
      return aA
    }
    var z = this.t;
    aA = z - t.t;
    if (aA != 0) {
      return aA
    }
    while (--z >= 0) {
      if ((aA = this[z] - t[z]) != 0) {
        return aA
      }
    }
    return 0
  }
  function j(z) {
    var aB = 1,
    aA;
    if ((aA = z >>> 16) != 0) {
      z = aA;
      aB += 16
    }
    if ((aA = z >> 8) != 0) {
      z = aA;
      aB += 8
    }
    if ((aA = z >> 4) != 0) {
      z = aA;
      aB += 4
    }
    if ((aA = z >> 2) != 0) {
      z = aA;
      aB += 2
    }
    if ((aA = z >> 1) != 0) {
      z = aA;
      aB += 1
    }
    return aB
  }
  function u() {
    if (this.t <= 0) {
      return 0
    }
    return this.DB * (this.t - 1) + j(this[this.t - 1] ^ (this.s & this.DM))
  }
  function aq(aA, z) {
    var t;
    for (t = this.t - 1; t >= 0; --t) {
      z[t + aA] = this[t]
    }
    for (t = aA - 1; t >= 0; --t) {
      z[t] = 0
    }
    z.t = this.t + aA;
    z.s = this.s
  }
  function X(aA, z) {
    for (var t = aA; t < this.t; ++t) {
      z[t - aA] = this[t]
    }
    z.t = Math.max(this.t - aA, 0);
    z.s = this.s
  }
  function s(aF, aB) {
    var z = aF % this.DB;
    var t = this.DB - z;
    var aD = (1 << t) - 1;
    var aC = Math.floor(aF / this.DB),
    aE = (this.s << z) & this.DM,
    aA;
    for (aA = this.t - 1; aA >= 0; --aA) {
      aB[aA + aC + 1] = (this[aA] >> t) | aE;
      aE = (this[aA] & aD) << z
    }
    for (aA = aC - 1; aA >= 0; --aA) {
      aB[aA] = 0
    }
    aB[aC] = aE;
    aB.t = this.t + aC + 1;
    aB.s = this.s;
    aB.clamp()
  }
  function l(aE, aB) {
    aB.s = this.s;
    var aC = Math.floor(aE / this.DB);
    if (aC >= this.t) {
      aB.t = 0;
      return
    }
    var z = aE % this.DB;
    var t = this.DB - z;
    var aD = (1 << z) - 1;
    aB[0] = this[aC] >> z;
    for (var aA = aC + 1; aA < this.t; ++aA) {
      aB[aA - aC - 1] |= (this[aA] & aD) << t;
      aB[aA - aC] = this[aA] >> z
    }
    if (z > 0) {
      aB[this.t - aC - 1] |= (this.s & aD) << t
    }
    aB.t = this.t - aC;
    aB.clamp()
  }
  function ab(z, aB) {
    var aA = 0,
    aC = 0,
    t = Math.min(z.t, this.t);
    while (aA < t) {
      aC += this[aA] - z[aA];
      aB[aA++] = aC & this.DM;
      aC >>= this.DB
    }
    if (z.t < this.t) {
      aC -= z.s;
      while (aA < this.t) {
        aC += this[aA];
        aB[aA++] = aC & this.DM;
        aC >>= this.DB
      }
      aC += this.s
    } else {
      aC += this.s;
      while (aA < z.t) {
        aC -= z[aA];
        aB[aA++] = aC & this.DM;
        aC >>= this.DB
      }
      aC -= z.s
    }
    aB.s = (aC < 0) ? - 1 : 0;
    if (aC < - 1) {
      aB[aA++] = this.DV + aC
    } else {
      if (aC > 0) {
        aB[aA++] = aC
      }
    }
    aB.t = aA;
    aB.clamp()
  }
  function D(z, aB) {
    var t = this.abs(),
    aC = z.abs();
    var aA = t.t;
    aB.t = aA + aC.t;
    while (--aA >= 0) {
      aB[aA] = 0
    }
    for (aA = 0; aA < aC.t; ++aA) {
      aB[aA + t.t] = t.am(0, aC[aA], aB, aA, 0, t.t)
    }
    aB.s = 0;
    aB.clamp();
    if (this.s != z.s) {
      ar.ZERO.subTo(aB, aB)
    }
  }
  function Q(aA) {
    var t = this.abs();
    var z = aA.t = 2 * t.t;
    while (--z >= 0) {
      aA[z] = 0
    }
, z) {
    var y = A.charCodeAt(z);
    if (y > 255) {
      throw 'INVALID_CHARACTER_ERR: DOM Exception 5'
    }
    return y
  };
  d.encode = function (C) {
    if (arguments.length != 1) {
      throw 'SyntaxError: Not enough arguments'
    }
    var z = d.PADCHAR;
    var E = d.ALPHA;
    var D = d.getbyte;
    var B,
    F;
    var y = [
    ];
    C = '' + C;
    var A = C.length - C.length % 3;
    if (C.length == 0) {
      return C
    }
    for (B = 0; B < A; B += 3) {
      F = (D(C, B) << 16) | (D(C, B + 1) << 8) | D(C, B + 2);
      y.push(E.charAt(F >> 18));
      y.push(E.charAt((F >> 12) & 63));
      y.push(E.charAt((F >> 6) & 63));
      y.push(E.charAt(F & 63))
    }
    switch (C.length - A) {
    case 1:
      F = D(C, B) << 16;
      y.push(E.charAt(F >> 18) + E.charAt((F >> 12) & 63) + z + z);
      break;
    case 2:
      F = (D(C, B) << 16) | (D(C, B + 1) << 8);
      y.push(E.charAt(F >> 18) + E.charAt((F >> 12) & 63) + E.charAt((F >> 6) & 63) + z);
      break
    }
    return y.join('')
  };
  if (!csza.btoa) {
    csza.btoa = d.encode
  }
}) (csza);
var hexcase = 1;
  var b64pad = '';
  var chrsz = 8;
  var mode = 32;
  function md5(s) {
    return hex_md5(s)
  }
  function hex_md5(s) {
    return binl2hex(core_md5(str2binl(s), s.length * chrsz))
  }
  function str_md5(s) {
    return binl2str(core_md5(str2binl(s), s.length * chrsz))
  }
  function hex_hmac_md5(key, data) {
    return binl2hex(core_hmac_md5(key, data))
  }
  function b64_hmac_md5(key, data) {
    return binl2b64(core_hmac_md5(key, data))
  }
  function str_hmac_md5(key, data) {
    return binl2str(core_hmac_md5(key, data))
  }
  function core_md5(x, len) {
    x[len >> 5] |= 128 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    var a = 1732584193;
    var b = - 271733879;
    var c = - 1732584194;
    var d = 271733878;
    for (var i = 0; i < x.length; i += 16) {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;
      a = md5_ff(a, b, c, d, x[i + 0], 7, - 680876936);
      d = md5_ff(d, a, b, c, x[i + 1], 12, - 389564586);
      c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5_ff(b, c, d, a, x[i + 3], 22, - 1044525330);
      a = md5_ff(a, b, c, d, x[i + 4], 7, - 176418897);
      d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5_ff(c, d, a, b, x[i + 6], 17, - 1473231341);
      b = md5_ff(b, c, d, a, x[i + 7], 22, - 45705983);
      a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5_ff(d, a, b, c, x[i + 9], 12, - 1958414417);
      c = md5_ff(c, d, a, b, x[i + 10], 17, - 42063);
      b = md5_ff(b, c, d, a, x[i + 11], 22, - 1990404162);
      a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5_ff(d, a, b, c, x[i + 13], 12, - 40341101);
      c = md5_ff(c, d, a, b, x[i + 14], 17, - 1502002290);
      b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = md5_gg(a, b, c, d, x[i + 1], 5, - 165796510);
      d = md5_gg(d, a, b, c, x[i + 6], 9, - 1069501632);
      c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5_gg(b, c, d, a, x[i + 0], 20, - 373897302);
      a = md5_gg(a, b, c, d, x[i + 5], 5, - 701558691);
      d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5_gg(c, d, a, b, x[i + 15], 14, - 660478335);
      b = md5_gg(b, c, d, a, x[i + 4], 20, - 405537848);
      a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5_gg(d, a, b, c, x[i + 14], 9, - 1019803690);
      c = md5_gg(c, d, a, b, x[i + 3], 14, - 187363961);
      b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5_gg(a, b, c, d, x[i + 13], 5, - 1444681467);
      d = md5_gg(d, a, b, c, x[i + 2], 9, - 51403784);
      c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5_gg(b, c, d, a, x[i + 12], 20, - 1926607734);
      a = md5_hh(a, b, c, d, x[i + 5], 4, - 378558);
      d = md5_hh(d, a, b, c, x[i + 8], 11, - 2022574463);
      c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5_hh(b, c, d, a, x[i + 14], 23, - 35309556);
      a = md5_hh(a, b, c, d, x[i + 1], 4, - 1530992060);
      d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5_hh(c, d, a, b, x[i + 7], 16, - 155497632);
      b = md5_hh(b, c, d, a, x[i + 10], 23, - 1094730640);
      a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5_hh(d, a, b, c, x[i + 0], 11, - 358537222);
      c = md5_hh(c, d, a, b, x[i + 3], 16, - 722521979);
      b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5_hh(a, b, c, d, x[i + 9], 4, - 640364487);
      d = md5_hh(d, a, b, c, x[i + 12], 11, - 421815835);
      c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5_hh(b, c, d, a, x[i + 2], 23, - 995338651);
      a = md5_ii(a, b, c, d, x[i + 0], 6, - 198630844);
      d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5_ii(c, d, a, b, x[i + 14], 15, - 1416354905);
      b = md5_ii(b, c, d, a, x[i + 5], 21, - 57434055);
      a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5_ii(d, a, b, c, x[i + 3], 10, - 1894986606);
      c = md5_ii(c, d, a, b, x[i + 10], 15, - 1051523);
      b = md5_ii(b, c, d, a, x[i + 1], 21, - 2054922799);
      a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5_ii(d, a, b, c, x[i + 15], 10, - 30611744);
      c = md5_ii(c, d, a, b, x[i + 6], 15, - 1560198380);
      b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5_ii(a, b, c, d, x[i + 4], 6, - 145523070);
      d = md5_ii(d, a, b, c, x[i + 11], 10, - 1120210379);
      c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5_ii(b, c, d, a, x[i + 9], 21, - 343485551);
      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd)
    }
    if (mode == 16) {
      return Array(b, c)
    } else {
      return Array(a, b, c, d)
    }
  }
  function md5_cmn(q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
  }
  function md5_ff(a, b, c, d, x, s, t) {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
  }
  function md5_gg(a, b, c, d, x, s, t) {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
  }
  function md5_hh(a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5_ii(a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
  }
  function core_hmac_md5(key, data) {
    var bkey = str2binl(key);
    if (bkey.length > 16) {
      bkey = core_md5(bkey, key.length * chrsz)
    }
    var ipad = Array(16),
    opad = Array(16);
    for (var i = 0; i < 16; i++) {
      ipad[i] = bkey[i] ^ 909522486;
      opad[i] = bkey[i] ^ 1549556828
    }
    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128)
  }
  function safe_add(x, y) {
    var lsw = (x & 65535) + (y & 65535);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 65535)
  }
  function bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }
  function str2binl(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32)
    }
    return bin
  }
  function binl2str(bin) {
    var str = '';
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < bin.length * 32; i += chrsz) {
      str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask)
    }
    return str
  }
  function binl2hex(binarray) {
    var hex_tab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
    var str = '';
    for (var i = 0; i < binarray.length * 4; i++) {
      str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 15) + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 15)
    }
    return str
  }
  function binl2b64(binarray) {
    var tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var str = '';
    for (var i = 0; i < binarray.length * 4; i += 3) {
      var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 255) << 16) | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 255) << 8) | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 255);
      for (var j = 0; j < 4; j++) {
        if (i * 8 + j * 6 > binarray.length * 32) {
          str += b64pad
        } else {
          str += tab.charAt((triplet >> 6 * (3 - j)) & 63)
        }
      }
    }
    return str
  }
  function hexchar2bin(str) {
    var arr = [
    ];
    for (var i = 0; i < str.length; i = i + 2) {
      arr.push('\\x' + str.substr(i, 2))
    }
    arr = arr.join('');
    eval('var temp = \'' + arr + '\'');
    return temp
  } 
function uin2hex(str) {
    var maxLength = 16;
    str = parseInt(str);
    var hex = str.toString(16);
    var len = hex.length;
    for (var i = len; i < maxLength; i++) {
        hex = "0" + hex
    }
    var arr = [];
    for (var j = 0; j < maxLength; j += 2) {
        arr.push("\\x" + hex.substr(j, 2))
    }
    var result = arr.join("");
    eval('result="' + result + '"');
    return result
}
 function getEncryption(password, salt, vcode, isMd5) {
   salt = uin2hex(salt);
    vcode = vcode || '';
    password = password || '';
    var md5Pwd = isMd5 ? password : md5(password),
    h1 = hexchar2bin(md5Pwd),
    s2 = md5(h1 + salt),
    rsaH1 = rsa_encrypt(h1),
    rsaH1Len = (rsaH1.length / 2) .toString(16),
    hexVcode = TEA.strToBytes(vcode.toUpperCase()),
    vcodeLen = '000' + vcode.length.toString(16);
    while (rsaH1Len.length < 4) {
      rsaH1Len = '0' + rsaH1Len
    }
    TEA.initkey(s2);
    var saltPwd = TEA.enAsBase64(rsaH1Len + rsaH1 + TEA.strToBytes(salt) + vcodeLen + hexVcode);
    return saltPwd.replace(/\//g,"-").replace(/\+/g,"*").replace(/\=/g,"_");
}
 return {getEncryption: getEncryption,md5: md5}
}();
module.exports=exp;
/*
        '/': '-',
        '+': '*',
        '=': '_'
*/
