const wallet = require('./hypersign-wallet')

const password = "password123"
let keyStoreAndSeed;
let addrObj = {};
const messageToBeSigned = "Hello World!";
let signedObj = {};



const sign = async () => {
  try{
    console.log(`Signing the message = ${messageToBeSigned} ...`)
    signedObj = await wallet.signMessageTx(
        addrObj.publicKey.toString(), 
        messageToBeSigned, 
        keyStoreAndSeed.keyStore, 
        addrObj.privateKey);
    console.log(`Signature is = ${signedObj.signature}`)
  }catch(e){
    console.log(e);
  }
}

const verify = async () =>{
  try{
    console.log(`Verifing the message signature ...`)
    const isVerified = await wallet.verifyMessageTx(
        messageToBeSigned,
        signedObj.signatureRsv,
        addrObj.publicKey
        );
    console.log(`Verification Result = ${isVerified}`);
  }catch(e){
    console.log(e);
  }
}

const recoverKs = async ( ) => {
  try{
    keyStoreAndSeed.keyStore = {};
    keyStoreAndSeed.keyStore = await wallet.setSeed(password, keyStoreAndSeed.seed)
    addrObj =  await wallet.newAddresses(password,1,keyStoreAndSeed.keyStore);
    keyStoreAndSeed.keyStore = addrObj.keyStore;
    console.log(`Recover account: PublicKey = ${addrObj.publicKey} | PrivateKey = ${wallet.toHexString(addrObj.privateKey)} `)
    await sign();
    await verify();
  }catch(e){
    console.log(e);
  } 
}

const generateNewAddress = async () => {
  try{
    console.log(`Generating new seed from password = ${password} ...`);
    keyStoreAndSeed = await wallet.generate(password);
    console.log(`Generating new account from new Seed = ${keyStoreAndSeed.seed} ...`);
    addrObj =  await wallet.newAddresses(password,1,keyStoreAndSeed.keyStore);
    keyStoreAndSeed.keyStore = addrObj.keyStore; //update the keystore 
    console.log(`New account: PublicKey = ${addrObj.publicKey} | PrivateKey = ${wallet.toHexString(addrObj.privateKey)} `)
  }catch(e){
    console.log(e);
  }
}

(async () => {
  try{
    // generate the address
    await generateNewAddress();
    // sign the message
    await sign();
    // verify message
    await verify();
    // await recoverKs()
  }catch(e){
    console.log(e);
  }
})()
