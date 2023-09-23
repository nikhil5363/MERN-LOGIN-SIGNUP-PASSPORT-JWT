const express = require("express");
const router = new express.Router();
const userdb = require("../models/userSchema");
var bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");


router.post("/register", async (req, res) => {

    const { fname, email, password, cpassword } = req.body;
    console.log(req.body)

    if (!fname || !email || !password || !cpassword) {
        res.status(422).json({ error: "fill all the details" })
    }

    try {
        console.log('Nikhil')

        console.log(email)

        const preuser = await userdb.findOne({ email: email });

        console.log(preuser)
        if(preuser){
            res.status(422).json({error:"This Email is Already Exist"})
        }
        else if(password!==cpassword){
            res.status(422).json({ error: "Password and Confirm Password Not Match" });
        }
        else{
            const finalUser = new userdb({
                fname, email, password, cpassword
            })
            const storeData = await finalUser.save();
            
            console.log(storeData)

            res.status(201).json({ status: 201, storeData })

        }

    }
    catch (error) {
        res.status(422).json(error.message);
        console.log("catch block error");
    }
})



// user Login

router.post("/login", async (req, res) => {
    // console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(422).json({ error: "fill all the details" })
    }

    try {

       //console.log("LOgin API");

       console.log(email)

       const userValid = await userdb.findOne({email:email});

       console.log(userValid)
       console.log("LOgin API");

        if(userValid){

            const isMatch = await bcrypt.compare(password,userValid.password);

            console.log(isMatch)

            if(!isMatch){
                res.status(422).json({ error: "invalid details"})
            }else{
                console.log('Generate Token')
                // token generate
                const token = await userValid.generateAuthtoken();
                console.log('Generated Token')
                console.log(token)

                // cookiegenerate
                res.cookie("usercookie",token,{
                    expires:new Date(Date.now()+9000000),
                    httpOnly:true
                });

                const result = {
                    userValid,
                    token
                }
                res.status(201).json({status:201,result})
            }
        }

    } catch (error) {
        res.status(401).json(error.message);
        console.log("catch block");
        console.log("catch block error");
    }
});



// user valid
router.get("/validuser",authenticate,async(req,res)=>{
    try {
        const ValidUserOne = await userdb.findOne({_id:req.userId});
        res.status(201).json({status:201,ValidUserOne});
    } catch (error) {
        res.status(401).json({status:401,error});
    }
});


// user logout

router.get("/logout",authenticate,async(req,res)=>{
    try {
        req.rootUser.tokens =  req.rootUser.tokens.filter((curelem)=>{
            return curelem.token !== req.token
        });

        res.clearCookie("usercookie",{path:"/"});

        req.rootUser.save();

        res.status(201).json({status:201})

    } catch (error) {
        res.status(401).json({status:401,error})
    }
})


module.exports = router;