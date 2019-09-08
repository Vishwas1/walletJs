const lightwallet =  require("eth-lightwallet")

    const generate = (password) => {
        return new Promise((resolve,reject) => {
            if (password == '') {
                reject('Password is empty!')
            }
            let randomSeed = lightwallet.keystore.generateRandomSeed();
            ///give this randomSeed  to the user to save for restoring wallet
            //console.log('Random Seed = ' +  randomSeed)            
            lightwallet.keystore.createVault({
                password: password,
                seedPhrase: randomSeed,
                hdPathString: "m/0'/0'/0'"
                }, (err, ks) => {
                    if(err) {
                        //console.log('Error : error in callback of createVault. Msg = ' + err)
                        reject(err)
                    }
                    else {                        
                        resolve({keyStore : ks, seed: randomSeed})
                    }
            })
        })
    }
    const newAddresses = (password, _addCnt, ks) => {
        return new Promise((resolve,reject) => {
            if (password == '') {
                reject('Password is empty!')
            }
            
            ks.keyFromPassword(password, (err, pwDerivedKey) => {
                if(err) reject(err)
                else {   
                    const numAddr = parseInt(_addCnt) //provide number of accounts you want to create
                    ks.generateNewAddress(pwDerivedKey, numAddr);
                    const addresses = ks.getAddresses()
                    resolve({publicKey : addresses, privateKey : pwDerivedKey, keyStore : ks});
                }
            })
        } )
    }
    const setSeed = (password, seed) => {
        return new Promise((resolve, reject) => {
            /// Restoring keystore for login and restore 
            //debugger
            if (password == '') {
                reject('Password is empty!')
            }
            lightwallet.keystore.createVault({
                password: password,
                seedPhrase: seed,
                hdPathString: "m/0'/0'/0'"
                }, (err, ks) => {
                    if(err) reject(err)
                    else {
                        resolve(ks)
                    }   
            })
        })
    }
    const signMessageTx = (from,rawMsg, ks, pwDerivedKey) => {
        return new Promise((resolve, reject) =>{
            if(ks){   
                if(pwDerivedKey){
                    from = from.substring(2,from.length)
                    let signedMsgRSV = lightwallet.signing.signMsg(ks, pwDerivedKey, rawMsg, from )
                    if(signedMsgRSV) resolve({signature: lightwallet.signing.concatSig(signedMsgRSV), signatureRsv : JSON.stringify(signedMsgRSV)})
                    else reject('Error : Error after singMsg call.')
                }else {
                    reject('Error : window.pwDerivedKey is null or empty.')        
                }
            }else {
                reject('Error : window.key_Store is null or empty.')    
            }
        })
    }
    const verifyMessageTx = (rawMessage, signedMsgRSV, publicKey) => {
        return new Promise((resolve, reject) => {
            signedMsgRSV = JSON.parse(signedMsgRSV);
            //console.log('hypersing-wallet : verifyMessageTx : Promise called.')    
            //console.log('hypersing-wallet : verifyMessageTx : Before recover call.')   
            //console.log('hypersing-wallet : verifyMessageTx : Before recover call. rawMessage : ' + rawMessage)    
            //console.log('hypersing-wallet : verifyMessageTx : Before recover call. signedMsgRSV.v : ' + signedMsgRSV.v)    
            //console.log('hypersing-wallet : verifyMessageTx : Before recover call. signedMsgRSV.r : ' + signedMsgRSV.r)    
            //console.log('hypersing-wallet : verifyMessageTx : Before recover call. signedMsgRSV.s : ' + signedMsgRSV.s)    
            let newpublicKeyUint8Arr = lightwallet.signing.recoverAddress(rawMessage, signedMsgRSV.v, signedMsgRSV.r.data, signedMsgRSV.s.data)
            //console.log('hypersing-wallet : verifyMessageTx : After recover call. newpublicKeyUint8Arr ' + newpublicKeyUint8Arr)  
            
            //console.log('hypersing-wallet : verifyMessageTx : Before toHexString call.') 
            let newpublicKey = toHexString(newpublicKeyUint8Arr)
            //console.log('hypersing-wallet : verifyMessageTx : After toHexString call.')  

            newpublicKey = '0x' + newpublicKey
            if(publicKey == newpublicKey) {
                resolve(true)
            } 
            else {
                reject(false)
            }
        })
    }
    const toHexString = (byteArray) => {
        return Array.prototype.map.call(byteArray, function(byte) {
          return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
    }

    const exportPrivKey = (ks, publicKey , pwDerivedKey) => {
        return ks.exportPrivateKey(publicKey,pwDerivedKey);
    }

module.exports = {
    generate,
    newAddresses,
    setSeed,
    signMessageTx,
    verifyMessageTx,
    toHexString,
    exportPrivKey
} 
