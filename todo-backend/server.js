const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors package
const todoRoutes = require('./routes/todos');

dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use(cors());


// app.use(cors({
//   origin: 'http://localhost:3000' // Replace with your frontend URL
// }));


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/todos', todoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
