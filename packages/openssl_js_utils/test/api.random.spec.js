import {getTestEnv} from './prepare.js';
const env = getTestEnv();
const jscu = env.library;
const envName = env.envName;

import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


describe(`${envName}: Random generation test`, () => {

  it('Random bytes of desired length should be generated successfully', async () => {
    const r = await jscu.random.getRandomBytes(32);
    expect(r).to.be.a('Uint8Array');
    expect(r).to.be.length(32);
  });

  it('Random ascii string of desired length should be generated successfully', async () => {
    const r = await jscu.random.getRandomAsciiString(32);
    expect(r).to.be.a('String');
    expect(r).to.be.length(32);
  });
});