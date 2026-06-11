import usermodel from "../../database/model/user/user.model.js";


//1
export const signup=async({ name, email, password, phone, age })=>{
try {
       
        const exist = await usermodel.findOne({ email });
        if (exist) return "Email already exists";         
        const result=await usermodel.create({ name, email, password, phone, age });
        return exist,result
} catch (error) {
console.error("error in signup services:",error);
throw error    
}
}
//2
export const login=async({ email, password })=>{
        try {
    const user = await usermodel.findOne({ email });
    return user
     if (!user ||email==undefined||password==undefined ) {
        return {isError:true,status:400,message:"Invalid email or password"}
    }
        } catch (error) {
             console.error("error in login services:",error);
            throw error
                
        }
}

//3
export const update_user=async( name, email, age, phone,id)=>{
try {
     // 2. إذا كان المستخدم يريد تغيير الإيميل، نتأكد أنه غير محجوز
    if (email) {
        const isEmailExist = await usermodel.findOne({ email, _id: { $ne: id } });
        if (isEmailExist) {
            return {isError:true,status:400,message:"email already exist"}

        }
    }

    // 3. التحديث الفعلي (تجنب تحديث الباسورد هنا)
    const updatedUser = await usermodel.findByIdAndUpdate(
        id, 
        { name, email, age, phone }, 
        {returnDocument:"after"}
    );
    return updatedUser

    if (!updatedUser) {
        return {isError:true,status:404,message:"user not updated"}

    }

} catch (error) {
     console.error("error in update_user services:",error);
            throw error
}
}

// 4. Delete User 
export const delete_user=async(id)=>{
    try {
        const deleted = await usermodel.findByIdAndDelete({_id:id}); 
    if (!deleted){
        const error=new Error("user not found")
            error.status=404
            throw error
    }
    return deleted
    } catch (error) {
         console.error("error in update_user services:",error);
            throw error
    }


}

// 5. Get User Data 
export const getuserData=async(id)=>{
    try {
         const user = await usermodel.findById({_id:id}).select("-password");
         if(!user){
            const error=new Error("user not found")
            error.status=404
            throw error
         }
         return user 
    } catch (error) {
        console.error("error in get user Data services:",error);
            throw error
    }
}