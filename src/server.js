import express from 'express'
import hbs from 'hbs'
import path from 'path'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import flash from 'connect-flash'


const app = express();
require("dotenv").config();

const PORT = process.env.PORT  || 4000

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(
  express.urlencoded({
    extended: false
  })
);


app.use(
  session({
    secret: "This secret enough !",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser());
app.use(flash());


app.use((req, res, next) => {
  res.locals.success_flash = req.flash("success");
  res.locals.error_flash = req.flash("error");
  next()
})




app.get('/', (req, res, next) => {
  res.render("index");
});
app.get('/customer', (req, res, next) => {
  res.render("customer");
});


app.post('/customer', async (req, res) => {
  try {
    let { bvnNumber } = req.body
    //Validate user Input
    if (bvnNumber.length < 11 || bvnNumber.length === '') {
      req.flash('error', `BVN not complete, or can't be empty`);
      res.redirect('/')
      return
   }
    const url = `https://ravesandboxapi.flutterwave.com/v2/kyc/bvn/${bvnNumber}?seckey=${process.env.FLWSECK}`

      const response = await fetch(url)
    const customerBVNData = await response.json();
    if (customerBVNData.status === 'error' || customerBVNData.data == null) {
      req.flash('error', 'Oops We encounter an error validating your BVN, Try again')
      res.redirect('/')
      return
    }
    res.render('customer',{customer: customerBVNData.data, msg:'BVN successfully Validated, Welcome 👍'})
  } catch (err) {
    console.log(err)
    req.flash('error', 'Oops We encounter an error validating your BVN, Try again')
    res.redirect('/')
  }
})



app.listen(PORT , () => {
  console.log(`Server Started on port port! ${PORT}`);
});

// FLWSECK - 9b4748a667eeb35b5dac311752796fa0 - X
// curl --request GET \
//   --url https://ravesandboxapi.flutterwave.com/v2/kyc/bvn/12345678901?seckey=FLWSECK-9b4748a667eeb35b5dac311752796fa0-X\
//   --header 'content-type: application/json'
