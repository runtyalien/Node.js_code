const User = require('../model/user');
const Expense = require('../model/expense');

async function total (req, res) {
    try {
        console.log('Started updating total expenses...');

        const users = User.findAll();

        for(const user of users){
            const totalExpenses = await Expense.sum('amount', {
                where: { userexpenseId : user.id },
            });

            await User.update(
                {total : totalExpenses || 0 },
                {where : { id: userexpenseId }}
            );
            console.log(`Total expenses updated for user ${user.id}. New total: ${totalExpenses || 0}`);
        }
        res.json({message: "Total Expenses updated successfully"});
    } catch(error){
        console.log(error);
    }
}

module.exports = { total };