import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req,res){
        try{
            const{user_id}=req.params;
            const transactions=await sql`
            SELECT * FROM transactions where user_id=${user_id} ORDER BY created_at DESC
            `;
            res.status(200).json(transactions);
    
        }catch(error){
            console.log("Error in getting transaction");
            res.status(500).json({message:"Internal server error"});
        }
}

export async function createTransaction(req,res){
        try{
            const{title,amount,category,user_id}=req.body;
    
            if(!title||!category||!user_id||amount===undefined){
                return res.status(400).json({message:"All fields are required!!"});
            }
    
            const transaction=await sql `
            INSERT INTO transactions(user_id,title,amount,category)
            values(${user_id},${title},${amount},${category})
            RETURNING *
            `;
            console.log(transaction);
            res.status(201).json(transaction[0]);
    
    
    
        }catch(error){
            console.log("Error in creating transaction",error);
            res.status(500).json({message:"Internal server error"});
        }
}

export async function deleteTransaction(req,res){
        try{
    
            const { id }=req.params;
    
            if(isNaN(parseInt(id))){
                return res.status(400).json({message:"Invalid Transaction ID"});
            }
    
            const result= await sql`
            DELETE FROM transactions where id=${id} RETURNING *
            `;
    
            if(result.length===0){
                return res.status(404).json({message:"Transaction Not Found"});
            }
    
            res.status(200).json({message:"Transaction Deleted successfully"});
    
        }catch(error){
            console.log("Error deleting transaction");
            res.status(500).json({message:"Internal server error"});
        }
}

export async function getSummaryByUserId(req,res){
    try{
        const {user_id}=req.params;

        const balanceResult=await sql`
        SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id=${user_id}
        `

        const incomeResult=await sql`
        SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id=${user_id} and amount>0
        `
        const expensesResult=await sql`
        SELECT COALESCE(SUM(amount),0) as expenses FROM transactions WHERE user_id=${user_id} and amount<0
        `
        res.status(200).json({
            balance:balanceResult[0].balance,
            income:incomeResult[0].income,
            expenses:expensesResult[0].expenses
        });
    }
    catch(error){
        console.log("Error in displaying summary",error);
        res.status(500).json({message:"Internal server error"});
    }

}