import { Router } from 'express';
import  usermodel  from '../../database/model/user/user.model.js';
import { delete_user, getuserData, login, signup, update_user } from './user.services.js';
import { CreateSuccessResponse } from '../../common/Response/success.response.js';
import { globalhandlingerror } from '../../common/Response/err.response.js';

const userRouter = Router();

// 1. Signup 
userRouter.post('/signup', async (req, res) => {
    try {
        let{name,email,password,phone,age}=req.body
        if(!name)return res.status(400).json({message:"name is required"})
        if(!email)return res.status(400).json({message:"email is required"})
        if(!password)return res.status(400).json({message:"password is required"})
        if(!phone)return res.status(400).json({message:"phone is required"})
        let result=await signup({name,email,password,phone,age})
        if(result.exist)return res.status(400).json({message:"Email already exists"})
        res.status(201).json({message:"user signup successfully",result})
    } catch (error) { 
       const statuscode=error.status||500
    return res.status(statuscode).json({message:"Validation1 error",error:error.message})
    }
});

// 2. Login 
userRouter.post('/login', async (req, res) => {
  try {    
    const{email,password}=req.body
     const result=await login({email,password})
      if(result &&result.isError){
            res.status(result.status||401).json({message:result.message})

     }else{
            res.status(200).json({ message: "Login successful",result}); 

     }
     

  } catch (error) {
    const statuscode=error.status||500
    return res.status(statuscode).json({message:"Validation2 error",error:error.message})
  }
});


// 3. Update User 
userRouter.patch('/update-user/:id', async (req, res) => {
  try {
    // 1. الحصول على الـ ID من التوكين (req.userId تم إعداده في الـ Auth middleware)
    const {id} = req.params; 
    const { name, email, age, phone } = req.body;
    const result=await update_user(name, email, age, phone,id)
   
    res.json({ message: "User updated", user: result });
  } catch (error) {
    const statuscode=error.status||500
    return res.status(statuscode).json({message:"Validation3 error",error:error.message})
  }
});

// 4. Delete User 
userRouter.delete('/:id', async (req, res) => {
   try {
    const {id}=req.params
     const result=await delete_user(id)
    res.json({ message: "User deleted" ,result:result}); 
   } catch (error) {
     const statuscode=error.status||500
    return res.status(statuscode).json({message:"Validation4 error",error:error.message})
   }
});

// 5. Get User Data 
userRouter.get('/:id', async (req, res) => {
   try {
  const{id}=req.params
    const result=await getuserData(id)
    res.status(200).json(result); 
   } catch (error) {
     const statuscode=error.status||500
    return res.status(statuscode).json({message:"Validation5 error",error:error.message})
   }
});

export default userRouter