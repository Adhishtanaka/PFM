import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  amountSaved: { type: Number, default: 0},
  frequency: { type: String, enum: ['one-time', 'monthly'], required: true },
},{ timestamps: true });

const incomeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  frequency: { type: String, enum: ['one-time', 'monthly'], required: true },
},{ timestamps: true });

const goalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  amountSaved: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
},{ timestamps: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  expenses: [expenseSchema],
  incomes: [incomeSchema],
  goals: [goalSchema],
});

const User = mongoose.model('User', userSchema);

export default User;
