const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./src/models');
require('./utils/cronJob');

const academicSyncService = require('./services/academicSyncService');

const app = express();
academicSyncService.start();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes')); 
app.use('/api/saving-goals', require('./routes/savingGoalRoutes'));
app.use('/api/piggy-bank', require('./routes/piggyBankRoutes'));
app.use('/api/challenges', require('./routes/challengeRoutes'));
app.use('/api/currency', require('./routes/currencyRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
// Đồng bộ database
// db.sequelize.sync({ alter: true }).then(() => {
//     app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
//     console.log('Database synced successfully with models.');
// }).catch(err => {
//     console.error('Unable to connect or sync the database:', err);
// });

async function startServer() {
  try {
    // Kết nối và đồng bộ cơ sở dữ liệu
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Đồng bộ các bảng với tùy chọn alter: true
    await db.sequelize.sync({ alter: true });
    console.log('Database synced successfully with models.');
    
    // Khởi động máy chủ sau khi đồng bộ thành công
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error('Unable to connect or sync the database:', error);
    process.exit(1); // Thoát nếu có lỗi
  }
}

startServer();
