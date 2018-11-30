import jscu from '../src/index.js';


import chai from 'chai';
// const should = chai.should();
const expect = chai.expect;


describe('Random generation test', () => {

  it('Random bytes of desired length should be generated successfully', async () => {
    const r = await jscu.crypto.random.getRandomBytes(32);
    expect(r).to.be.a('Uint8Array');
    expect(r).to.be.length(32);
  });

  it('Random ascii string of desired length should be generated successfully', async () => {
    const r = await jscu.crypto.random.getRandomAsciiString(32);
    expect(r).to.be.a('String');
    expect(r).to.be.length(32);
  });
});