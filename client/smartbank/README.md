# SmartBank Frontend

A modern React banking frontend connecting to the SmartBank backend at `http://localhost:8080`.

## Tech Stack

- **React 18** + Vite
- **React Router DOM v6** – client-side routing
- **Axios** – HTTP client with JWT interceptors
- **Tailwind CSS** – utility-first styling
- **react-hot-toast** – toast notifications
- **lucide-react** – icon set
- **Razorpay Checkout** – payment integration

## Project Structure

```
src/
├── components/
│   └── common/
│       ├── AuthLayout.jsx    # Split-screen auth wrapper
│       ├── Sidebar.jsx       # Customer nav sidebar
│       └── RouteGuards.jsx   # PrivateRoute / PublicRoute
├── context/
│   └── AuthContext.jsx       # Auth state (token, email, role)
├── pages/
│   ├── auth/                 # Login, Register, VerifyOTP, Forgot/ResetPassword
│   ├── customer/             # Dashboard, Accounts, Transfer, Statements, Profile
│   └── admin/                # AdminDashboard
├── services/
│   └── api.js                # Axios instance + all API calls
└── utils/
    └── helpers.js            # formatCurrency, formatDate, downloadBlob
```

## Setup

```bash
# Install dependencies
npm install

# Add your Razorpay test key
cp .env.example .env
# Edit .env and set VITE_RAZORPAY_KEY=rzp_test_xxxxxxxx

# Start dev server (backend must be on :8080)
npm run dev
```

## Routes

| Path | Access | Description |
|---|---|---|
| `/login` | Public | Sign in |
| `/register` | Public | Create account |
| `/verify-otp` | Public | Email OTP verification |
| `/forgot-password` | Public | Request reset OTP |
| `/reset-password` | Public | Reset password |
| `/dashboard` | CUSTOMER | Overview & recent transactions |
| `/accounts` | CUSTOMER | List all accounts |
| `/accounts/create` | CUSTOMER | Open new account via Razorpay |
| `/accounts/:accountNumber` | CUSTOMER | Account detail + history |
| `/transfer` | CUSTOMER | Fund transfer |
| `/transactions/:accountNumber` | CUSTOMER | Full transaction list |
| `/statements` | CUSTOMER | Download PDF statement |
| `/profile` | CUSTOMER | User info + logout |
| `/admin/dashboard` | ADMIN | Admin overview |

## Notes

- JWT token stored in `localStorage` under keys: `token`, `email`, `role`
- 401 responses auto-redirect to `/login`
- Razorpay key loaded from `VITE_RAZORPAY_KEY` env variable
- Backend base URL: `http://localhost:8080/api`
