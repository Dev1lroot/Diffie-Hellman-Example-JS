class DHClient
{
    constructor(data = {})
    {
        this.prime      = CryptoJS.SHA256(this.generateRandomString(10)).toString(CryptoJS.enc.Hex);
        this.generator  = CryptoJS.SHA256(this.generateRandomString(10)).toString(CryptoJS.enc.Hex);
        this.secret     = CryptoJS.SHA256(this.generateRandomString(10)).toString(CryptoJS.enc.Hex);
        this.public     = CryptoJS.SHA256(this.generator + "^" + this.secret + "mod" + this.prime).toString(CryptoJS.enc.Hex);
        this.shared     = "";

        Object.keys(data).forEach((key) => {
            this[key] = data[key];
        });
    }
    generateRandomString(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
    }
    receivePublic(b_public)
    {
        this.shared = CryptoJS.SHA256(b_public + "^" + this.secret + "mod" + this.prime).toString(CryptoJS.enc.Hex);
        return this.shared;
    }
    receiveShared(b_shared)
    {
        if(parseInt(b_shared,16) > parseInt(this.shared,16))
        {
            this.final = CryptoJS.SHA256(b_shared + this.shared).toString(CryptoJS.enc.Hex);
        }
        else
        {
            this.final = CryptoJS.SHA256(this.shared + b_shared).toString(CryptoJS.enc.Hex);
        }
        return this.final;
    }
    encrypt(data)
    {
        return CryptoJS.AES.encrypt(data, this.final).toString();
    }
    decrypt(data)
    {
        return CryptoJS.AES.decrypt(data, this.final).toString(CryptoJS.enc.Utf8);
    }
}


let a = new DHClient();
let b = new DHClient();

console.log( `Alice Shared Key: ` + a.receivePublic(b.public) );
console.log( `Bob Shared Key: ` + b.receivePublic(a.public) );
console.log( `Alice Final Key: ` + a.receiveShared(b.shared) );
console.log( `Bob Final Key: ` + b.receiveShared(a.shared) );

let message = "Hello World!";

let encrypted = a.encrypt(message);
console.log( `Alice to Bob: ` + encrypted );
console.log( `Bob received: ` + b.decrypt(encrypted));
