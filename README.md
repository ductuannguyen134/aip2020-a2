# aip2020-a2 IOU Web Application
An IOU application that allows users to log in, record and resolve debts, favors, and public requests. An “IOU” is an abbreviation of "I owe you", and it is an informal acknowledgement of a debt or favor owed. 

### 🌐 Build with the MERN Stack

MongoDB, Expressjs, React/Redux, Nodejs

![IOU App](https://imgur.com/CKWThDM.jpg)

# Contributors:
- Duc Tuan Nguyen 
- Hailey Nguyen
- Trung Duc Nguyen
- Duc Thinh Nguyen

# Dependencies(tech-stacks)
| Frontend | Backend |
| ----------- | ----------- |
| react | body-parser |
| redux | cors |
| react-router-dom | express |
| react-dom | mongoose |
| material-ui | passport |
| axios | jsonwebtoken |
| graph.js | bcryptjs |

# Dev Start commands:
## Frontend dev start (PORT: 3000):
```
- cd frontend
- npm install
- npm start
```

## Backend dev start (PORT: 5000):
### Prepare a secret .env file to connect to MongoDB

Create a .env file in the backend folder and paste the snippet below for the app to work:
```
DATABASE_URL=mongodb+srv://aip-iou:weareone@cluster0.pnmmr.mongodb.net/aip-iou?retryWrites=true&w=majority
SECRET='}]L;m7"MO"f_WD@'
```

### Start Backend
```
- cd backend
- npm install
- npm start
(if nodemon is installed, you can use nodemon server.js instead)
```

# Build:
### After deploying to AWS

Update the file in frontend/src/hoc/axios.js

```
baseURL: 'http://13.211.212.209:5000'
```

