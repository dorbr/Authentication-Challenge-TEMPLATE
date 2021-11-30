class User{
    constructor(email, name, password, isAdmin = false){
        this.email = email;
        this.name = name;
        this.password = password;
        this.isAdmin = isAdmin;
        // this.info = "";
    }
    get email(){
        return this.email;
    }
    get password(){
        return this.password;
    }
    get name(){
        return this.name;
    }
    get isAdmin(){
        return this.isAdmin;
    }
    // get info(){
    //     return this.info;
    // }
    // set info(info){
    //     this.info = info;
    // }
}

module.exports = User;