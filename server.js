const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());
app.get("/test123", (req, res) => {
  res.send("SERVER IS WORKING!");
});

// Session setup — MUST be before routes
app.use(session({
  secret: "kusumira_secret",
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// ======================
// FILE UPLOAD CONFIG
// ======================

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ======================
// DB CONNECTION
// ======================

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "kusumira"
});

db.connect(err => {
  if (err) throw err;
  console.log("DB Connected");
});

// ======================
// GOOGLE AUTH STRATEGY
// ======================

passport.use(new GoogleStrategy({
  clientID: "360627535572-1q8k18ikeo1huil37e28ndgn65nj1599.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "http://localhost:8080/auth/google/callback"
},
(accessToken, refreshToken, profile, done) => {
  const name = profile.displayName;
  const email = profile.emails[0].value;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return done(err);

    if (result.length > 0) {
      return done(null, result[0]);
    }

    db.query(
      "INSERT INTO users (name, email, provider) VALUES (?, ?, ?)",
      [name, email, "google"],
      (err, result) => {
        if (err) return done(err);
        return done(null, { name, email });
      }
    );
  });
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ======================
// GOOGLE ROUTES
// ======================

// Customer Google login
app.get("/auth/google",
  (req, res, next) => {
    req.session.returnTo = req.session.returnTo || "/index.html";
    req.session.save(next);
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Brand Google login
app.get("/auth/google/brand",
  (req, res, next) => {
    req.session.returnTo = "/brand_dashboard.html";
    req.session.save(() => {
      passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
    });
  }
);

// Google callback
app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    req.session.user = {
      name: req.user.name,
      email: req.user.email
    };
    const redirectTo = req.session.returnTo || "/index.html";
    delete req.session.returnTo;
    req.session.save(() => {
      res.redirect(redirectTo);
    });
  }
);

// ======================
// USER SESSION ROUTES
// ======================

app.get("/get-user", (req, res) => {
  if (req.session.user) {
    res.json({ success: true, name: req.session.user.name, email: req.session.user.email });
  } else if (req.isAuthenticated()) {
    res.json({ success: true, name: req.user.name, email: req.user.email });
  } else {
    res.json({ success: false });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {});
  req.logout(() => {});
  res.json({ success: true });
});

// ======================
// PROTECTED DASHBOARD
// ======================

app.get("/brand_dashboard.html", (req, res) => {
  if (req.isAuthenticated() || req.session.user) {
    res.sendFile(path.join(__dirname, "brand_dashboard.html"));
  } else {
    res.redirect("/brand_login.html");
  }
});

app.get("/brand_login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "brand_login.html"));
});

// ======================
// PRODUCT ROUTES
// ======================

app.post("/add-product", upload.single("image"), (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ success: false, message: "Name and price are required" });
  }

  const image = req.file ? req.file.filename : null;

  const sql = "INSERT INTO products (name, price, image) VALUES (?, ?, ?)";
  db.query(sql, [name, price, image], (err) => {
    if (err) {
      console.log("DB Error:", err);
      return res.status(500).send("Error saving product");
    }
    res.send("Product added");
  });
});

app.get("/get-products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.log("DB Error:", err);
      return res.json([]);
    }
    res.json(results);
  });
});

// ======================
// SIGNUP & LOGIN
// ======================

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password, provider) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, hashedPassword, "local"], (err) => {
      if (err) return res.json({ success: false, message: "Email already exists!" });
      res.json({ success: true });
    });
  } catch (err) {
    res.json({ success: false, message: "Server error" });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.json({ success: false });
    if (result.length > 0) {
      const user = result[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.user = user;
        return res.json({ success: true, name: user.name });
      }
      return res.json({ success: false, message: "Wrong password" });
    }
    res.json({ success: false, message: "User not found" });
  });
});

// ======================
// SERVER
// ======================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

// ✅ Static files LAST — so routes above take priority
app.get("/checkout.html", (req, res) => {
  res.sendFile(path.join(__dirname, "checkout.html"));
});
app.use(express.static(__dirname, { index: false }));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.listen(8080, () => {
  console.log("Server running on port 8080");
});