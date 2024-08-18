import express from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import mongoose from 'mongoose';
import User from './model/Schema.js';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

app.post('/api/register', async (req, res) => {
    const { name, email, password, dateOfBirth } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = new User({ name, email, password, dateOfBirth });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, { expiresIn: '30m' });
    res.json({ accessToken: token });
});

app.get('/api/validate-token', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Token is valid' });
});

app.get('/api/dashboard', authenticateToken, async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).populate('expenses incomes goals');
     const totalIncome = user.incomes.reduce((acc, income) => acc + income.price, 0);
     const totalAmountSaved = user.expenses.reduce((acc, expense) => acc + expense.amountSaved, 0);
     const total = totalIncome - totalAmountSaved;
    res.json({ user, total });
});

app.post('/api/add-expense', authenticateToken, async (req, res) => {
    const { name, price, frequency } = req.body;
    const user = await User.findOne({ email: req.user.email });
    user.expenses.push({ name, price,frequency });
    await user.save();
    res.status(201).json({ message: 'Expense added successfully' });
});

app.post('/api/add-income', authenticateToken, async (req, res) => {
    const { name, price, frequency } = req.body;
    const user = await User.findOne({ email: req.user.email });
    user.incomes.push({ name, price, frequency });
    await user.save();
    res.status(201).json({ message: 'Income added successfully' });
});

app.post('/api/add-goal', authenticateToken, async (req, res) => {
    const { name, price, deadline } = req.body;
    const user = await User.findOne({ email: req.user.email });
    user.goals.push({ name, price, deadline });
    await user.save();
    res.status(201).json({ message: 'Goal added successfully' });
});

app.delete('/api/delete-expense/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
        const user = await User.findOne({ email: req.user.email });
        user.expenses = user.expenses.filter(expense => expense._id.toString() !== id);
        await user.save();
        res.status(200).json({ message: 'Expense deleted successfully' });
});

app.delete('/api/delete-income/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
        const user = await User.findOne({ email: req.user.email });
        user.incomes = user.incomes.filter(income => income._id.toString() !== id);
        await user.save();
        res.status(200).json({ message: 'Income deleted successfully' });
});

app.delete('/api/delete-goal/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
        const user = await User.findOne({ email: req.user.email });
        user.goals = user.goals.filter(goal => goal._id.toString() !== id);
        await user.save();
        res.status(200).json({ message: 'Goal deleted successfully' });
});

app.post('/api/assign-money', authenticateToken, async (req, res) => {
      const { type, id, amount } = req.body;
      const user = await User.findOne({ email: req.user.email });
      const item = user.type.id(id)
      if (type === 'expense') {
        item = user.expenses.id(id);
      } else if (type === 'goal') {
        item = user.goals.id(id);
      }
      item.amountSaved = (item.amountSaved || 0) + amount;
      await user.save();
      res.status(200).json({ message: 'Money assigned successfully' });
});

app.get('/api/:type/:id', authenticateToken, async (req, res) => {
      const { type, id } = req.params;
      const user = await User.findOne({ email: req.user.email });
      let item;
      if (type === 'expense') {
        item = user.expenses.id(id);
      } else if (type === 'goal') {
        item = user.goals.id(id);
      }
      res.json(item);
  });

app.listen(3000, () => {
    console.log('Server started');
});
