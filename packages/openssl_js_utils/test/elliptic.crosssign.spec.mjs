import elliptic from '../src/crypto/elliptic/index.mjs';
let crypto;
if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined' && typeof window.crypto.subtle === 'object'
  && typeof window.crypto.subtle.importKey === 'function' && typeof window.crypto.subtle.sign === 'function') {
  crypto = window.crypto;
}
else crypto = null;


import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;

describe('Signing and verification cross test between pure js ecdsa and webcrypto', async () => {
  const curves = ['P-256', 'P-384', 'P-521'];
  const hashes = [ 'SHA-256', 'SHA-384', 'SHA-512'];
  let keySet = [];
  let msg;
  before(async () => {
    if (!crypto){
      crypto = await import('node-webcrypto-ossl');
      if(typeof crypto !== 'undefined' && typeof crypto.WebCrypto !== 'function' && typeof crypto.default !=='undefined')
        crypto = crypto.default;
      crypto = new crypto();
    }
    const algo = {name: 'ECDSA'};
    keySet = await Promise.all(
      curves.map(async (elem) => await crypto.subtle.generateKey(Object.assign(algo, {namedCurve: elem}), true, ['sign', 'verify']))
    );
    msg = new Uint8Array(32);
    for (let i = 0; i < 32; i++) msg[i] = 0xFF & i;
  });

  it('Signature generated by WebCrypto can be successfully verified by Elliptic', async () => {
    const jwKeys = [];
    for(let i = 0; i < keySet.length; i++){
      // change to bin keys
      jwKeys[i] = {
        publicKey: await elliptic.keyconv.binToJwk(
          await crypto.subtle.exportKey('spki', keySet[i].publicKey),
          'public'),
        privateKey: await elliptic.keyconv.binToJwk(
          await crypto.subtle.exportKey('pkcs8', keySet[i].privateKey),
          'private')
      };

      hashes.forEach( async(hash) => {
        const namedCurve = jwKeys[i].publicKey.crv;
        expect(namedCurve).to.be.equal(jwKeys[i].privateKey.crv);
        const algo = {name: 'ECDSA', hash: {name: hash}, namedCurve};  //canonical:true
        const signature = await crypto.subtle.sign(algo, keySet[i].privateKey, msg);
        const result = await elliptic.crypto.verify(algo, jwKeys[i].publicKey, signature, msg);
        expect(result).to.be.true;
      });
    }
  });

  it('Signature generated by Elliptic can be successfully verified by WebCrypto', async () => {
    const jwKeys = [];
    for(let i = 0; i < keySet.length; i++){
      // change to bin keys
      jwKeys[i] = {
        publicKey: await elliptic.keyconv.binToJwk(
          await crypto.subtle.exportKey('spki', keySet[i].publicKey),
          'public'),
        privateKey: await elliptic.keyconv.binToJwk(
          await crypto.subtle.exportKey('pkcs8', keySet[i].privateKey),
          'private')
      };

      hashes.forEach( async(hash) => {
        const namedCurve = jwKeys[i].publicKey.crv;
        expect(namedCurve).to.be.equal(jwKeys[i].privateKey.crv);
        const algo = {name: 'ECDSA', hash: {name: hash}, namedCurve};  //canonical:true
        const signature = await elliptic.crypto.sign(algo, jwKeys[i].privateKey, msg);
        const result = await crypto.subtle.verify(algo, keySet[i].publicKey, signature, msg);
        expect(result).to.be.true;
      });
    }
  });

});