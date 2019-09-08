# walletJs
Wallet wrapper library which uses eth-lightwallet for ECDSA algorithm for keypair generation and digital signature


## 

```
git clone https://github.com/Vishwas1/walletJs.git
cd walletJs
npm i 
npm run start
```

Output

```
Generating new seed from password = password123 ...
Generating new account from new Seed = urge gallery cruise reunion multiply salmon endorse connect absent emerge surge volume ...
New account: PublicKey = 0x043f7b95c7e3a6550afc8e93c5750a9a573bd8f3 | PrivateKey = c91bb49d677131d4fa3c2d92167d045d15919005410101e8c4218656e8ae345a 
Signing the message = Hello World! ...
Signature is = 0x1cf0c341ee59ff2e4de685cd079956c29ec57eaef8e6a9aeb8ef08da2300815f5f60c75e091be589694b91ffe4fb49806d920bfa8f334341b82d19e42909a3271c
Verifing the message signature ...
Verification Result = true
```